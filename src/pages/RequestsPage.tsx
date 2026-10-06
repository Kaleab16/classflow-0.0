import React, { useState } from 'react';
import { useRequests } from '../context/RequestsContext';
import { RequestRow } from '../components/requests/RequestRow';
import type { RequestStatus } from '../types/request';
import { Inbox } from 'lucide-react';

export const RequestsPage: React.FC = () => {
  const { requests } = useRequests();
  const [activeTab, setActiveTab] = useState<'all' | RequestStatus>('all');

  const filteredRequests = requests.filter(r => {
    if (activeTab === 'all') return true;
    return r.status === activeTab;
  });

  const tabs: { key: 'all' | RequestStatus; label: string; count: number }[] = [
    { key: 'all', label: 'All Requests', count: requests.length },
    { key: 'new', label: 'New', count: requests.filter(r => r.status === 'new').length },
    { key: 'in_progress', label: 'In Progress', count: requests.filter(r => r.status === 'in_progress').length },
    { key: 'waiting_for_response', label: 'Waiting for Teacher', count: requests.filter(r => r.status === 'waiting_for_response').length },
    { key: 'resolved', label: 'Resolved', count: requests.filter(r => r.status === 'resolved').length }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
          Class Requests Queue
        </h2>
        <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
          Organize, review, and track all academic issues, exam questions, and student petitions
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '2px' }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '6px 6px 0 0',
                fontSize: '13px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#2563EB' : '#64748B',
                backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                border: isActive ? '1px solid #E2E8F0' : '1px solid transparent',
                borderBottom: isActive ? '2px solid #2563EB' : '1px solid transparent',
                cursor: 'pointer'
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: '11px',
                  backgroundColor: isActive ? '#EFF6FF' : '#F1F5F9',
                  color: isActive ? '#2563EB' : '#475569',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  fontWeight: 700
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Requests Table */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: '#64748B', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Request Title / Target</th>
              <th style={{ padding: '12px 16px' }}>Category</th>
              <th style={{ padding: '12px 16px' }}>Students</th>
              <th style={{ padding: '12px 16px' }}>Priority</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Last Updated</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map(req => (
                <RequestRow key={req.id} request={req} />
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
                  <Inbox size={32} color="#CBD5E1" style={{ margin: '0 auto 8px auto', display: 'block' }} />
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>No requests in this view</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
