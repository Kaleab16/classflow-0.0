import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ClassRequest, RequestStatus, ActivityEvent, Category, Priority } from '../types/request';
import { INITIAL_REQUESTS } from '../data/mockData';
import {
  requestsService,
  fromDbRow,
  type NewRequestDraft,
  type RequestDbRow
} from '../services/requestsService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { nowIso } from '../lib/time';

interface AddRequestResult {
  ok: boolean;
  error?: string;
}

interface RequestsContextType {
  requests: ClassRequest[];
  isLoading: boolean;
  isSupabaseConnected: boolean;
  /** Message to show when loading or saving failed; null when all is well. */
  actionError: string | null;
  clearActionError: () => void;
  updateRequestStatus: (id: string, status: RequestStatus, note?: string) => void;
  updateRepMemo: (id: string, memo: string) => void;
  resolveRequest: (id: string, resolutionText: string) => void;
  addRequest: (
    title: string,
    category: Category,
    priority: Priority,
    studentsAffected: number,
    description: string,
    instructor: string
  ) => Promise<AddRequestResult>;
  refreshRequests: () => Promise<void>;
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

const messageOf = (err: unknown, fallback: string): string =>
  err instanceof Error && err.message ? err.message : fallback;

export const RequestsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();

  // With a backend, start empty and only ever show what the database returns.
  // Demo data is used only when no backend is configured.
  const initial = isSupabaseConfigured ? [] : INITIAL_REQUESTS;
  const [requests, setRequests] = useState<ClassRequest[]>(initial);
  const [isLoading, setIsLoading] = useState<boolean>(isSupabaseConfigured);
  const [actionError, setActionError] = useState<string | null>(null);

  // The latest list, readable synchronously. Needed because one click can
  // trigger two updates back to back (e.g. edit memo, then forward it).
  const requestsRef = useRef<ClassRequest[]>(initial);
  // Saves run one after another so an older save can never land after a newer one.
  const saveChain = useRef<Promise<void>>(Promise.resolve());

  const commit = (next: ClassRequest[]) => {
    requestsRef.current = next;
    setRequests(next);
  };

  // Only a verified, signed-in user may load or subscribe to requests.
  const userId =
    isSupabaseConfigured && isAuthenticated && currentUser.verificationStatus === 'verified'
      ? currentUser.id
      : null;

  const loadRequests = async () => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const data = await requestsService.fetchRequests();
      commit(data);
    } catch (err) {
      console.error('[ClassFlow] Error loading requests:', err);
      setActionError(`Could not load requests: ${messageOf(err, 'unknown error')}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    // Signed out, pending or rejected: hold no data at all.
    if (!userId) {
      commit([]);
      setIsLoading(false);
      return;
    }

    loadRequests();

    // Live updates. Row-level security decides which rows each user receives.
    const channel = supabase
      .channel(`requests-realtime-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'requests' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newReq = fromDbRow(payload.new as RequestDbRow);
            commit(
              requestsRef.current.some((r) => r.id === newReq.id)
                ? requestsRef.current
                : [newReq, ...requestsRef.current]
            );
          } else if (payload.eventType === 'UPDATE') {
            const updated = fromDbRow(payload.new as RequestDbRow);
            commit(requestsRef.current.map((r) => (r.id === updated.id ? updated : r)));
          } else if (payload.eventType === 'DELETE') {
            const oldId = (payload.old as { id?: string } | null)?.id;
            if (oldId) {
              commit(requestsRef.current.filter((r) => r.id !== oldId));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Who is acting, for the activity log. Always the real signed-in person.
  const actorInfo = (): Pick<ActivityEvent, 'actor' | 'actorName'> => {
    switch (currentUser.role) {
      case 'class_rep':
        return { actor: 'rep', actorName: `${currentUser.name} (Class Rep)` };
      case 'teacher':
        return { actor: 'teacher', actorName: currentUser.name };
      case 'admin':
        return { actor: 'system', actorName: `${currentUser.name} (Admin)` };
      default:
        return { actor: 'student', actorName: currentUser.name };
    }
  };

  // Show the change immediately, then save it. If the save fails, tell the user
  // and reload the real data so the screen never keeps a change that was lost.
  const applyAndSave = (updated: ClassRequest) => {
    commit(requestsRef.current.map((r) => (r.id === updated.id ? updated : r)));

    saveChain.current = saveChain.current.then(async () => {
      try {
        await requestsService.updateRequest(updated);
      } catch (err) {
        console.error('[ClassFlow] Failed to save request:', err);
        setActionError(`Your change was not saved: ${messageOf(err, 'unknown error')}`);
        await loadRequests();
      }
    });
  };

  const updateRequestStatus = (id: string, status: RequestStatus, note?: string) => {
    const req = requestsRef.current.find((r) => r.id === id);
    if (!req) return;

    const timestamp = nowIso();

    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp,
      ...actorInfo(),
      action: `Updated status to "${status.replace(/_/g, ' ').toUpperCase()}"`,
      details: note
    };

    const updatedSteps = req.stakeholderSteps.map((step) => {
      if (status === 'waiting_for_response' && step.stepNumber === 3) {
        return { ...step, status: 'completed' as const, timestamp };
      }
      if (status === 'waiting_for_response' && step.stepNumber === 4) {
        return { ...step, status: 'current' as const };
      }
      if (status === 'resolved' && (step.stepNumber === 4 || step.stepNumber === 5)) {
        return { ...step, status: 'completed' as const, timestamp };
      }
      return step;
    });

    applyAndSave({
      ...req,
      status,
      lastUpdatedAt: timestamp,
      waitingOn: status === 'waiting_for_response' ? req.instructor : req.waitingOn,
      activity: [newActivity, ...req.activity],
      stakeholderSteps: updatedSteps
    });
  };

  const updateRepMemo = (id: string, memo: string) => {
    const req = requestsRef.current.find((r) => r.id === id);
    if (!req) return;

    const timestamp = nowIso();
    const actor = actorInfo();

    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp,
      ...actor,
      action: 'Analyzed & updated formal teacher memo',
      details: 'Refined student issue into structured query'
    };

    const updatedSteps = req.stakeholderSteps.map((step) => {
      if (step.stepNumber === 2) {
        return {
          ...step,
          status: 'completed' as const,
          timestamp,
          note: `${currentUser.name} approved memo`
        };
      }
      if (step.stepNumber === 3 && step.status === 'pending') {
        return { ...step, status: 'current' as const };
      }
      return step;
    });

    applyAndSave({
      ...req,
      repMemo: memo,
      repMemoStatus: 'approved_by_rep',
      lastUpdatedAt: timestamp,
      activity: [newActivity, ...req.activity],
      stakeholderSteps: updatedSteps
    });
  };

  const resolveRequest = (id: string, resolutionText: string) => {
    const req = requestsRef.current.find((r) => r.id === id);
    if (!req) return;

    const timestamp = nowIso();

    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp,
      ...actorInfo(),
      action: 'Issued resolution',
      details: resolutionText
    };

    const updatedSteps = req.stakeholderSteps.map((step) => ({
      ...step,
      status: 'completed' as const,
      timestamp: step.status === 'completed' && step.timestamp ? step.timestamp : timestamp
    }));

    applyAndSave({
      ...req,
      status: 'resolved',
      resolutionText,
      resolutionDate: timestamp,
      lastUpdatedAt: timestamp,
      activity: [newActivity, ...req.activity],
      stakeholderSteps: updatedSteps
    });
  };

  const addRequest = async (
    title: string,
    category: Category,
    priority: Priority,
    studentsAffected: number,
    description: string,
    instructor: string
  ): Promise<AddRequestResult> => {
    const timestamp = nowIso();

    const draft: NewRequestDraft = {
      title: title.trim(),
      category,
      priority,
      status: 'new',
      studentsAffected,
      submittedAt: timestamp,
      lastUpdatedAt: timestamp,
      studentDescription: description.trim(),
      repMemo: `Formal query regarding "${title.trim()}" compiled by Class Rep for ${instructor}.`,
      repMemoStatus: 'draft',
      instructor,
      waitingOn: 'Class Rep review & forward',
      activity: [
        {
          id: `act-${Date.now()}`,
          timestamp,
          actor: 'student',
          actorName: currentUser.name,
          action: 'Submitted new request',
          details: `${studentsAffected} student${studentsAffected === 1 ? '' : 's'} affected`
        }
      ],
      stakeholderSteps: [
        { stepNumber: 1, title: 'Students raised issue', actorRole: 'Students', status: 'completed', timestamp },
        { stepNumber: 2, title: 'Class Rep review & edit', actorRole: 'Class Rep', status: 'current' },
        { stepNumber: 3, title: `Forward to ${instructor}`, actorRole: 'Teacher / Admin', status: 'pending' },
        { stepNumber: 4, title: 'Instructor Decision', actorRole: 'Teacher / Admin', status: 'pending' },
        { stepNumber: 5, title: 'Communicated to Class', actorRole: 'Resolution', status: 'pending' }
      ]
    };

    // Demo mode (no backend): keep it in memory only.
    if (!isSupabaseConfigured) {
      commit([{ ...draft, id: `REQ-${Date.now()}` }, ...requestsRef.current]);
      return { ok: true };
    }

    // Live mode: the request only appears once the database has really saved it.
    try {
      const created = await requestsService.createRequest(draft);
      commit([created, ...requestsRef.current.filter((r) => r.id !== created.id)]);
      return { ok: true };
    } catch (err) {
      console.error('[ClassFlow] Failed to submit request:', err);
      return {
        ok: false,
        error: `Your request was not saved: ${messageOf(err, 'unknown error')}`
      };
    }
  };

  return (
    <RequestsContext.Provider
      value={{
        requests,
        isLoading,
        isSupabaseConnected: isSupabaseConfigured,
        actionError,
        clearActionError: () => setActionError(null),
        updateRequestStatus,
        updateRepMemo,
        resolveRequest,
        addRequest,
        refreshRequests: loadRequests
      }}
    >
      {children}
    </RequestsContext.Provider>
  );
};

export const useRequests = () => {
  const context = useContext(RequestsContext);
  if (!context) {
    throw new Error('useRequests must be used within a RequestsProvider');
  }
  return context;
};
