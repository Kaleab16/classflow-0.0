export type RequestStatus = 
  | 'new'
  | 'in_progress'
  | 'waiting_for_response'
  | 'resolved'
  | 'closed';

export type Priority = 'high' | 'medium' | 'low';

export type Category = 'assignment' | 'academic' | 'exam' | 'permission' | 'general';

export interface ActivityEvent {
  id: string;
  timestamp: string;
  actor: 'student' | 'rep' | 'teacher' | 'system';
  actorName: string;
  action: string;
  details?: string;
}

export interface StakeholderStep {
  stepNumber: number;
  title: string;
  actorRole: 'Students' | 'Class Rep' | 'Teacher / Admin' | 'Resolution';
  status: 'completed' | 'current' | 'pending';
  timestamp?: string;
  note?: string;
}

export interface ClassRequest {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  status: RequestStatus;
  studentsAffected: number;
  submittedAt: string;
  lastUpdatedAt: string;
  studentDescription: string;
  repMemo: string;
  repMemoStatus: 'draft' | 'approved_by_rep';
  instructor: string;
  waitingOn?: string;
  resolutionText?: string;
  resolutionDate?: string;
  activity: ActivityEvent[];
  stakeholderSteps: StakeholderStep[];
  /** Account id of the person who submitted the request (set by the database). */
  createdBy?: string;
  createdByName?: string;
}
