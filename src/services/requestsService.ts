import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { ClassRequest } from '../types/request';
import { INITIAL_REQUESTS } from '../data/mockData';

// Shape of a row in public.requests (see supabase/schema.sql).
export interface RequestDbRow {
  id: string;
  title: string;
  category: ClassRequest['category'];
  priority: ClassRequest['priority'];
  status: ClassRequest['status'];
  students_affected: number;
  student_description: string;
  rep_memo: string;
  rep_memo_status: ClassRequest['repMemoStatus'];
  instructor: string;
  waiting_on?: string | null;
  resolution_text?: string | null;
  resolution_date?: string | null;
  activity: ClassRequest['activity'];
  stakeholder_steps: ClassRequest['stakeholderSteps'];
  created_by?: string | null;
  created_by_name?: string | null;
  created_at: string;
  updated_at?: string | null;
}

// A request that has not been saved yet: the database assigns the id, the
// author and the timestamps.
export type NewRequestDraft = Omit<ClassRequest, 'id'>;

// Columns a student may send when creating a request. The database overwrites
// author, status and timestamps no matter what is sent here.
function toInsertRow(draft: NewRequestDraft) {
  return {
    title: draft.title,
    category: draft.category,
    priority: draft.priority,
    status: draft.status,
    students_affected: draft.studentsAffected,
    student_description: draft.studentDescription,
    rep_memo: draft.repMemo,
    rep_memo_status: draft.repMemoStatus,
    instructor: draft.instructor,
    waiting_on: draft.waitingOn ?? null,
    activity: draft.activity,
    stakeholder_steps: draft.stakeholderSteps
  };
}

// Columns that change when staff work on a request. Title, description,
// author and dates are never rewritten.
function toUpdateRow(req: ClassRequest) {
  return {
    status: req.status,
    rep_memo: req.repMemo,
    rep_memo_status: req.repMemoStatus,
    waiting_on: req.waitingOn ?? null,
    resolution_text: req.resolutionText ?? null,
    resolution_date: req.resolutionDate ?? null,
    activity: req.activity,
    stakeholder_steps: req.stakeholderSteps
  };
}

export function fromDbRow(row: RequestDbRow): ClassRequest {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    priority: row.priority,
    status: row.status,
    studentsAffected: row.students_affected,
    // ISO timestamps; the UI formats them with lib/time.ts when displaying.
    submittedAt: row.created_at,
    lastUpdatedAt: row.updated_at ?? row.created_at,
    studentDescription: row.student_description,
    repMemo: row.rep_memo,
    repMemoStatus: row.rep_memo_status,
    instructor: row.instructor,
    waitingOn: row.waiting_on ?? undefined,
    resolutionText: row.resolution_text ?? undefined,
    resolutionDate: row.resolution_date ?? undefined,
    activity: Array.isArray(row.activity) ? row.activity : [],
    stakeholderSteps: Array.isArray(row.stakeholder_steps) ? row.stakeholder_steps : [],
    createdBy: row.created_by ?? undefined,
    createdByName: row.created_by_name ?? undefined
  };
}

// All methods throw on failure. Nothing silently falls back to demo data when a
// backend is configured, so a failed save is never shown as a success.
export const requestsService = {
  async fetchRequests(): Promise<ClassRequest[]> {
    if (!isSupabaseConfigured) {
      return INITIAL_REQUESTS;
    }

    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map((row: RequestDbRow) => fromDbRow(row));
  },

  async createRequest(draft: NewRequestDraft): Promise<ClassRequest> {
    const { data, error } = await supabase
      .from('requests')
      .insert(toInsertRow(draft))
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return fromDbRow(data as RequestDbRow);
  },

  async updateRequest(req: ClassRequest): Promise<void> {
    if (!isSupabaseConfigured) return;

    const { data, error } = await supabase
      .from('requests')
      .update(toUpdateRow(req))
      .eq('id', req.id)
      .select('id');

    if (error) {
      throw new Error(error.message);
    }
    // A row-level-security block returns no error and no rows.
    if (!data || data.length === 0) {
      throw new Error('You do not have permission to change this request.');
    }
  }
};
