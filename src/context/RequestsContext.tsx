import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ClassRequest, RequestStatus, ActivityEvent, Category, Priority } from '../types/request';
import { INITIAL_REQUESTS } from '../data/mockData';
import { requestsService, fromDbRow, type RequestDbRow } from '../services/requestsService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface RequestsContextType {
  requests: ClassRequest[];
  isLoading: boolean;
  isSupabaseConnected: boolean;
  updateRequestStatus: (id: string, status: RequestStatus, note?: string) => void;
  updateRepMemo: (id: string, memo: string) => void;
  resolveRequest: (id: string, resolutionText: string) => void;
  addRequest: (title: string, category: Category, priority: Priority, studentsAffected: number, description: string, instructor: string) => void;
  refreshRequests: () => Promise<void>;
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

export const RequestsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<ClassRequest[]>(INITIAL_REQUESTS);
  const [isLoading, setIsLoading] = useState<boolean>(isSupabaseConfigured);

  const loadRequests = async () => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await requestsService.fetchRequests();
      setRequests(data);
    } catch (err) {
      console.error('[ClassFlow] Error loading requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();

    if (!isSupabaseConfigured) return;

    // Listen to realtime changes from Supabase
    const channel = supabase
      .channel('requests-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'requests' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newReq = fromDbRow(payload.new as RequestDbRow);
            setRequests((prev) => {
              if (prev.some((r) => r.id === newReq.id)) return prev;
              return [newReq, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updated = fromDbRow(payload.new as RequestDbRow);
            setRequests((prev) =>
              prev.map((r) => (r.id === updated.id ? updated : r))
            );
          } else if (payload.eventType === 'DELETE') {
            const oldId = (payload.old as any)?.id;
            if (oldId) {
              setRequests((prev) => prev.filter((r) => r.id !== oldId));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateRequestStatus = (id: string, status: RequestStatus, note?: string) => {
    setRequests((prev) => {
      let updatedReq: ClassRequest | null = null;
      const next = prev.map((req) => {
        if (req.id !== id) return req;

        const newActivity: ActivityEvent = {
          id: `act-${Date.now()}`,
          timestamp: 'Just now',
          actor: 'rep',
          actorName: 'Kaleab (Class Rep)',
          action: `Updated status to "${status.replace(/_/g, ' ').toUpperCase()}"`,
          details: note,
        };

        const updatedSteps = req.stakeholderSteps.map((step) => {
          if (status === 'waiting_for_response' && step.stepNumber === 3) {
            return { ...step, status: 'completed' as const, timestamp: 'Today' };
          }
          if (status === 'waiting_for_response' && step.stepNumber === 4) {
            return { ...step, status: 'current' as const };
          }
          if (status === 'resolved' && (step.stepNumber === 4 || step.stepNumber === 5)) {
            return { ...step, status: 'completed' as const, timestamp: 'Today' };
          }
          return step;
        });

        updatedReq = {
          ...req,
          status,
          lastUpdatedAt: 'Just now',
          waitingOn: status === 'waiting_for_response' ? req.instructor : req.waitingOn,
          activity: [newActivity, ...req.activity],
          stakeholderSteps: updatedSteps,
        };
        return updatedReq;
      });

      if (updatedReq) {
        requestsService.upsertRequest(updatedReq);
      }
      return next;
    });
  };

  const updateRepMemo = (id: string, memo: string) => {
    setRequests((prev) => {
      let updatedReq: ClassRequest | null = null;
      const next = prev.map((req) => {
        if (req.id !== id) return req;

        const newActivity: ActivityEvent = {
          id: `act-${Date.now()}`,
          timestamp: 'Just now',
          actor: 'rep',
          actorName: 'Kaleab (Class Rep)',
          action: 'Analyzed & updated formal teacher memo',
          details: 'Refined student issue into structured query',
        };

        const updatedSteps = req.stakeholderSteps.map((step) => {
          if (step.stepNumber === 2) {
            return { ...step, status: 'completed' as const, timestamp: 'Today', note: 'Kaleab approved memo' };
          }
          if (step.stepNumber === 3 && step.status === 'pending') {
            return { ...step, status: 'current' as const };
          }
          return step;
        });

        updatedReq = {
          ...req,
          repMemo: memo,
          repMemoStatus: 'approved_by_rep',
          lastUpdatedAt: 'Just now',
          activity: [newActivity, ...req.activity],
          stakeholderSteps: updatedSteps,
        };
        return updatedReq;
      });

      if (updatedReq) {
        requestsService.upsertRequest(updatedReq);
      }
      return next;
    });
  };

  const resolveRequest = (id: string, resolutionText: string) => {
    setRequests((prev) => {
      let updatedReq: ClassRequest | null = null;
      const next = prev.map((req) => {
        if (req.id !== id) return req;

        const newActivity: ActivityEvent = {
          id: `act-${Date.now()}`,
          timestamp: 'Just now',
          actor: 'teacher',
          actorName: req.instructor,
          action: 'Issued resolution',
          details: resolutionText,
        };

        const updatedSteps = req.stakeholderSteps.map((step) => ({
          ...step,
          status: 'completed' as const,
          timestamp: 'Today',
        }));

        updatedReq = {
          ...req,
          status: 'resolved',
          resolutionText,
          resolutionDate: 'Today',
          lastUpdatedAt: 'Just now',
          activity: [newActivity, ...req.activity],
          stakeholderSteps: updatedSteps,
        };
        return updatedReq;
      });

      if (updatedReq) {
        requestsService.upsertRequest(updatedReq);
      }
      return next;
    });
  };

  const addRequest = (
    title: string,
    category: Category,
    priority: Priority,
    studentsAffected: number,
    description: string,
    instructor: string
  ) => {
    const newReq: ClassRequest = {
      id: `REQ-${100 + requests.length + 1}`,
      title,
      category,
      priority,
      status: 'new',
      studentsAffected,
      submittedAt: 'Today',
      lastUpdatedAt: 'Just now',
      studentDescription: description,
      repMemo: `Formal query regarding "${title}" compiled by Class Rep for ${instructor}.`,
      repMemoStatus: 'draft',
      instructor,
      waitingOn: 'Kaleab (Review & Forward)',
      activity: [
        {
          id: `act-${Date.now()}`,
          timestamp: 'Just now',
          actor: 'student',
          actorName: `${studentsAffected} Students (via Portal)`,
          action: 'Submitted new request',
        },
      ],
      stakeholderSteps: [
        { stepNumber: 1, title: 'Students raised issue', actorRole: 'Students', status: 'completed', timestamp: 'Today' },
        { stepNumber: 2, title: 'Class Rep review & edit', actorRole: 'Class Rep', status: 'current' },
        { stepNumber: 3, title: `Forward to ${instructor}`, actorRole: 'Teacher / Admin', status: 'pending' },
        { stepNumber: 4, title: 'Instructor Decision', actorRole: 'Teacher / Admin', status: 'pending' },
        { stepNumber: 5, title: 'Communicated to Class', actorRole: 'Resolution', status: 'pending' },
      ],
    };

    setRequests((prev) => [newReq, ...prev]);
    requestsService.upsertRequest(newReq);
  };

  return (
    <RequestsContext.Provider
      value={{
        requests,
        isLoading,
        isSupabaseConnected: isSupabaseConfigured,
        updateRequestStatus,
        updateRepMemo,
        resolveRequest,
        addRequest,
        refreshRequests: loadRequests,
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
