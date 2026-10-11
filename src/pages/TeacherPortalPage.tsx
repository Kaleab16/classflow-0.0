import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle2, FileEdit, Layers, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestsContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { ActionModal } from '../components/requests/ActionModal';
import { TeacherAnalyticsView } from '../components/teacher/TeacherAnalyticsView';
import type { RequestStatus } from '../types/request';

type StatusFilter = 'all' | RequestStatus;

const panel: React.CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid #E2E8F0',
  borderRadius: 12,
  padding: 20,
  minWidth: 0
};

export const TeacherPortalPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { requests, isLoading, actionError, clearActionError, refreshRequests } = useRequests();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);

  // RLS controls which records reach this page. The current schema has no
  // teacher_id/course_id relationship, so do not invent section assignments.
  const visibleRequests = useMemo(() => {
    const sorted = [...requests].sort(
      (a, b) => new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime()
    );
    return statusFilter === 'all'
      ? sorted
      : sorted.filter((request) => request.status === statusFilter);
  }, [requests, statusFilter]);

  const openCount = requests.filter(
    (request) => request.status !== 'resolved' && request.status !== 'closed'
  ).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
      <section style={{ ...panel, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#2563EB', letterSpacing: '0.06em' }}>
              TEACHER WORKSPACE
            </span>
            <h2 style={{ fontSize: 25, fontWeight: 800, color: '#0F172A', margin: '6px 0 4px', overflowWrap: 'anywhere' }}>
              Welcome, {currentUser.name}
            </h2>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: '#64748B', margin: 0 }}>
              Review requests returned by your account's database permissions and record decisions.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void refreshRequests()}
            disabled={isLoading}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid #CBD5E1', borderRadius: 8, padding: '9px 12px', background: '#FFFFFF', color: '#334155', cursor: isLoading ? 'wait' : 'pointer', fontWeight: 700 }}
          >
            <RefreshCw size={15} />
            {isLoading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </section>

      {actionError && (
        <div role="alert" style={{ ...panel, borderColor: '#FCA5A5', background: '#FEF2F2', color: '#991B1B' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span>{actionError}</span>
            <button type="button" onClick={clearActionError} aria-label="Dismiss error" style={{ border: 0, background: 'transparent', color: 'inherit', cursor: 'pointer' }}>Dismiss</button>
          </div>
        </div>
      )}

      <div style={{ ...panel, background: '#FFFBEB', borderColor: '#FDE68A', color: '#92400E', fontSize: 13, lineHeight: 1.6 }}>
        <strong>Assignment configuration needed:</strong> requests currently contain an instructor text field, not a secure teacher account or course-section assignment. This inbox displays records allowed by Supabase RLS. Before a multi-teacher rollout, add a teacher assignment relationship and enforce it in database policies.
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Layers size={17} color="#2563EB" />
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Request overview
        </h3>
      </div>

      <TeacherAnalyticsView requests={requests} />

      <section style={panel}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, margin: 0, color: '#0F172A' }}>
              <FileEdit size={17} color="#2563EB" /> Request inbox
            </h3>
            <p style={{ margin: '5px 0 0', fontSize: 12, color: '#64748B' }}>
              {requests.length} records available to this account · {openCount} open
            </p>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569', fontSize: 13 }}>
            Status
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              style={{ maxWidth: '100%', border: '1px solid #CBD5E1', borderRadius: 7, padding: '8px 10px', background: '#FFFFFF', color: '#0F172A' }}
            >
              <option value="all">All statuses</option>
              <option value="new">New</option>
              <option value="in_progress">In progress</option>
              <option value="waiting_for_response">Waiting for response</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </label>
        </div>

        {isLoading ? (
          <p role="status" style={{ color: '#64748B', fontSize: 13 }}>Loading requests…</p>
        ) : visibleRequests.length === 0 ? (
          <div style={{ border: '1px dashed #CBD5E1', borderRadius: 8, padding: 24, textAlign: 'center' }}>
            <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#334155' }}>No requests to display</p>
            <p style={{ margin: 0, color: '#64748B', fontSize: 13 }}>
              {requests.length === 0 ? 'No requests were returned by the database. Check the signed-in account and Supabase policies.' : 'Try another status filter.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {visibleRequests.map((request) => (
              <article key={request.id} style={{ border: '1px solid #E2E8F0', borderRadius: 9, padding: 16, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                  <StatusBadge status={request.status} />
                  <span style={{ fontSize: 12, color: '#64748B' }}>
                    {request.category} · {request.studentsAffected} affected
                  </span>
                </div>
                <h4 style={{ margin: '0 0 7px', fontSize: 16, lineHeight: 1.4, color: '#0F172A', overflowWrap: 'anywhere' }}>
                  {request.title}
                </h4>
                <p style={{ margin: '0 0 10px', fontSize: 13, lineHeight: 1.6, color: '#475569', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                  {request.studentDescription}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 12, color: '#64748B', marginBottom: 12 }}>
                  <span>Instructor field: {request.instructor || 'Not specified'}</span>
                  <span>·</span>
                  <span>Waiting on: {request.waitingOn || 'Not specified'}</span>
                </div>
                {request.repMemo.trim() && (
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 7, padding: 12, marginBottom: 12 }}>
                    <p style={{ margin: '0 0 5px', fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Representative memo</p>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: '#334155', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{request.repMemo}</p>
                  </div>
                )}
                {request.resolutionText && (
                  <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 7, padding: 12, marginBottom: 12, color: '#166534', fontSize: 13 }}>
                    <strong>Resolution:</strong> {request.resolutionText}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap', borderTop: '1px solid #F1F5F9', paddingTop: 12 }}>
                  <button type="button" onClick={() => navigate(`/teacher/requests/${request.id}`)} style={{ border: 0, background: 'transparent', color: '#475569', fontWeight: 700, cursor: 'pointer', padding: '7px 0' }}>
                    View timeline
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedReqId(request.id)}
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, border: 0, borderRadius: 7, padding: '9px 12px', background: '#166534', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}
                  >
                    <CheckCircle2 size={15} /> Review / issue decision
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section style={{ ...panel, background: '#F8FAFC' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, color: '#0F172A', margin: '0 0 7px' }}>
          <Calendar size={16} color="#64748B" /> Consultations
        </h3>
        <p style={{ margin: 0, color: '#64748B', fontSize: 13, lineHeight: 1.6 }}>
          Meeting scheduling is not connected to a database table yet. No appointments are shown because there are no persisted meeting records to display.
        </p>
      </section>

      {selectedReqId && (
        <ActionModal
          isOpen={Boolean(selectedReqId)}
          onClose={() => setSelectedReqId(null)}
          requestId={selectedReqId}
          currentStatus={requests.find((request) => request.id === selectedReqId)?.status ?? 'new'}
        />
      )}
    </div>
  );
};
