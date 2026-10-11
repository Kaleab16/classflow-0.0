import React from 'react';
import type { ClassRequest, Category } from '../../types/request';
import { MetricCard } from '../common/MetricCard';
import { Users, Clock, CheckCircle2, AlertCircle, BarChart3 } from 'lucide-react';

interface Props {
  requests: ClassRequest[];
}

const categoryLabels: Record<Category, string> = {
  assignment: 'Assignment',
  academic: 'Academic',
  exam: 'Exam',
  permission: 'Permission',
  general: 'General'
};

export const TeacherAnalyticsView: React.FC<Props> = ({ requests }) => {
  const resolved = requests.filter((request) => request.status === 'resolved' || request.status === 'closed').length;
  const active = requests.length - resolved;
  const resolutionRate = requests.length ? Math.round((resolved / requests.length) * 100) : 0;
  const categoryCounts = (Object.keys(categoryLabels) as Category[]).map((category) => ({
    category,
    label: categoryLabels[category],
    count: requests.filter((request) => request.category === category).length
  }));
  const maxCategoryCount = Math.max(1, ...categoryCounts.map((item) => item.count));

  const resolvedDurations = requests
    .filter((request) => request.status === 'resolved' && request.resolutionDate)
    .map((request) => {
      const start = new Date(request.submittedAt).getTime();
      const end = new Date(request.resolutionDate as string).getTime();
      return Number.isFinite(start) && Number.isFinite(end) && end >= start
        ? (end - start) / 86400000
        : null;
    })
    .filter((days): days is number => days !== null);

  const averageDays = resolvedDurations.length
    ? (resolvedDurations.reduce((sum, days) => sum + days, 0) / resolvedDurations.length).toFixed(1)
    : '—';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 12 }}>
        <MetricCard title="Requests visible" value={requests.length} icon={Users} accentColor="#2563EB" subtitle="Returned by Supabase" />
        <MetricCard title="Open requests" value={active} icon={AlertCircle} accentColor="#D97706" subtitle="Not resolved or closed" />
        <MetricCard title="Resolution rate" value={`${resolutionRate}%`} icon={CheckCircle2} accentColor="#16A34A" subtitle={`${resolved} resolved or closed`} />
        <MetricCard title="Average resolution" value={averageDays === '—' ? '—' : `${averageDays} days`} icon={Clock} accentColor="#0284C7" subtitle="Resolved requests with usable dates" />
      </div>

      <section style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <BarChart3 size={18} color="#2563EB" />
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#0F172A' }}>Request volume by category</h3>
        </div>
        {requests.length === 0 ? (
          <p style={{ margin: 0, color: '#64748B', fontSize: 13 }}>Analytics will appear when real requests are available.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {categoryCounts.map((item) => (
              <div key={item.category}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 5, fontSize: 13, color: '#334155' }}>
                  <span>{item.label}</span>
                  <strong>{item.count}</strong>
                </div>
                <div style={{ height: 8, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: `${(item.count / maxCategoryCount) * 100}%`, height: '100%', background: '#2563EB', borderRadius: 99, transition: 'width 0.2s ease' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
