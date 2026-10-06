import React from 'react';
import type { TeacherClassSection } from '../../data/mockData';
import { MetricCard } from '../common/MetricCard';
import { Users, Clock, CheckCircle2, UserCheck, BarChart3, ShieldCheck } from 'lucide-react';

interface Props {
  section: TeacherClassSection;
}

export const TeacherAnalyticsView: React.FC<Props> = ({ section }) => {
  const resolutionRate = Math.round((section.resolvedRequests / section.totalRequests) * 100);

  const categories = [
    { label: 'Assignment Clarifications', count: section.categoryBreakdown.assignment, color: '#2563EB' },
    { label: 'Academic / Course Registrations', count: section.categoryBreakdown.academic, color: '#0284C7' },
    { label: 'Exam Schedule Conflicts', count: section.categoryBreakdown.exam, color: '#D97706' },
    { label: 'Permission / Leave Requests', count: section.categoryBreakdown.permission, color: '#7C3AED' },
    { label: 'General Queries', count: section.categoryBreakdown.general, color: '#64748B' }
  ];

  const maxCategoryCount = Math.max(...categories.map(c => c.count));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Selected Section Header */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', backgroundColor: '#EFF6FF', padding: '2px 8px', borderRadius: '4px' }}>
              {section.courseCode}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>
              {section.courseName}
            </span>
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
            {section.sectionName}
          </h3>
        </div>

        {/* Assigned Class Rep Details */}
        <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {section.classRepName.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserCheck size={14} color="#16A34A" />
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                {section.classRepName}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              Assigned Class Representative • {section.studentsCount} Students
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        <MetricCard
          title="Total Queries Submitted"
          value={section.totalRequests}
          icon={Users}
          accentColor="#2563EB"
        />
        <MetricCard
          title="Resolution Rate"
          value={`${resolutionRate}%`}
          icon={CheckCircle2}
          accentColor="#16A34A"
          subtitle={`${section.resolvedRequests} Resolved`}
        />
        <MetricCard
          title="Avg. Response Velocity"
          value={`${section.avgResolutionDays} Days`}
          icon={Clock}
          accentColor="#0284C7"
        />
        <MetricCard
          title="Rep Performance Rating"
          value={`${section.repResponsivenessScore}%`}
          icon={ShieldCheck}
          accentColor="#7C3AED"
          subtitle="Excellent Triage"
        />
      </div>

      {/* Analytics Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
        {/* Category Volume Breakdown */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <BarChart3 size={18} color="#2563EB" />
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Query Volume Distribution by Category
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {categories.map((cat, idx) => {
              const percentage = Math.round((cat.count / maxCategoryCount) * 100);
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    <span>{cat.label}</span>
                    <span>{cat.count} queries</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${percentage}%`,
                        backgroundColor: cat.color,
                        borderRadius: '4px',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section Operational Health Summary */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px' }}>
            Section Health Insights
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase' }}>
                WORKLOAD STATUS
              </span>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                {section.pendingRequests} Active Queries Pending Teacher Input
              </p>
              <p style={{ fontSize: '12px', color: '#64748B' }}>
                Class Rep {section.classRepName} has formatted all memos and forwarded them to your inbox.
              </p>
            </div>

            <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '8px', padding: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase' }}>
                REP SATISFACTION
              </span>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#14532D', marginTop: '2px' }}>
                High Communication Score ({section.repResponsivenessScore}%)
              </p>
              <p style={{ fontSize: '12px', color: '#166534' }}>
                Rep filters raw student noise efficiently into clean memos before escalating.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
