import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { ClassRequest } from '../types/request';
import { INITIAL_REQUESTS } from '../data/mockData';

export interface RequestDbRow {
  id: string;
  title: string;
  category: ClassRequest['category'];
  priority: ClassRequest['priority'];
  status: ClassRequest['status'];
  students_affected: number;
  submitted_at: string;
  last_updated_at: string;
  student_description: string;
  rep_memo: string;
  rep_memo_status: ClassRequest['repMemoStatus'];
  instructor: string;
  waiting_on?: string | null;
  resolution_text?: string | null;
  resolution_date?: string | null;
  activity: ClassRequest['activity'];
  stakeholder_steps: ClassRequest['stakeholderSteps'];
}

export function toDbRow(req: ClassRequest): RequestDbRow {
  return {
    id: req.id,
    title: req.title,
    category: req.category,
    priority: req.priority,
    status: req.status,
    students_affected: req.studentsAffected,
    submitted_at: req.submittedAt,
    last_updated_at: req.lastUpdatedAt,
    student_description: req.studentDescription,
    rep_memo: req.repMemo,
    rep_memo_status: req.repMemoStatus,
    instructor: req.instructor,
    waiting_on: req.waitingOn ?? null,
    resolution_text: req.resolutionText ?? null,
    resolution_date: req.resolutionDate ?? null,
    activity: req.activity,
    stakeholder_steps: req.stakeholderSteps,
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
    submittedAt: row.submitted_at,
    lastUpdatedAt: row.last_updated_at,
    studentDescription: row.student_description,
    repMemo: row.rep_memo,
    repMemoStatus: row.rep_memo_status,
    instructor: row.instructor,
    waitingOn: row.waiting_on ?? undefined,
    resolutionText: row.resolution_text ?? undefined,
    resolutionDate: row.resolution_date ?? undefined,
    activity: Array.isArray(row.activity) ? row.activity : [],
    stakeholderSteps: Array.isArray(row.stakeholder_steps) ? row.stakeholder_steps : [],
  };
}

export const requestsService = {
  async fetchRequests(): Promise<ClassRequest[]> {
    if (!isSupabaseConfigured) {
      return INITIAL_REQUESTS;
    }

    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Supabase] Failed to fetch requests:', error.message);
        return INITIAL_REQUESTS;
      }

      if (!data || data.length === 0) {
        // Seed initial requests into Supabase if empty
        await this.seedInitialRequests();
        return INITIAL_REQUESTS;
      }

      return data.map((row: any) => fromDbRow(row as RequestDbRow));
    } catch (err) {
      console.error('[Supabase] Unexpected error fetching requests:', err);
      return INITIAL_REQUESTS;
    }
  },

  async seedInitialRequests(): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      const rows = INITIAL_REQUESTS.map(toDbRow);
      const { error } = await supabase.from('requests').insert(rows);
      if (error) {
        console.warn('[Supabase] Could not seed initial mock data:', error.message);
      } else {
        console.info('[Supabase] Initial requests successfully seeded to database.');
      }
    } catch (err) {
      console.warn('[Supabase] Seed error:', err);
    }
  },

  async upsertRequest(req: ClassRequest): Promise<void> {
    if (!isSupabaseConfigured) return;

    try {
      const row = toDbRow(req);
      const { error } = await supabase.from('requests').upsert(row, { onConflict: 'id' });
      if (error) {
        console.error('[Supabase] Failed to save request:', error.message);
      }
    } catch (err) {
      console.error('[Supabase] Upsert error:', err);
    }
  }
};
