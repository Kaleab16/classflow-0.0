import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { RequestStatus } from '../../types/request';
import { useRequests } from '../../context/RequestsContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  currentStatus: RequestStatus;
}

export const ActionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  requestId,
  currentStatus
}) => {
  const { updateRequestStatus, resolveRequest } = useRequests();
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus>(currentStatus);
  const [note, setNote] = useState('');
  const [resolutionText, setResolutionText] = useState('');

  const handleSave = () => {
    if (selectedStatus === 'resolved' && resolutionText.trim()) {
      resolveRequest(requestId, resolutionText);
    } else {
      updateRequestStatus(requestId, selectedStatus, note.trim() || undefined);
    }
    onClose();
  };

  const statuses: { value: RequestStatus; label: string; desc: string }[] = [
    { value: 'new', label: 'New', desc: 'Just received from students, unreviewed' },
    { value: 'in_progress', label: 'In Progress', desc: 'Rep is analyzing or formatting query' },
    { value: 'waiting_for_response', label: 'Waiting for Response', desc: 'Forwarded to instructor or administration' },
    { value: 'resolved', label: 'Resolved', desc: 'Issue answered/solved; feedback communicated to class' },
    { value: 'closed', label: 'Closed', desc: 'Archived without further action' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Request Status">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', color: '#64748B', display: 'block', marginBottom: '8px' }}>
            SELECT NEW STATUS
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {statuses.map(s => (
              <label
                key={s.value}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '10px 12px',
                  border: `1px solid ${selectedStatus === s.value ? '#2563EB' : '#E2E8F0'}`,
                  borderRadius: '6px',
                  backgroundColor: selectedStatus === s.value ? '#EFF6FF' : '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name="status"
                  value={s.value}
                  checked={selectedStatus === s.value}
                  onChange={() => setSelectedStatus(s.value)}
                  style={{ marginTop: '3px' }}
                />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{s.label}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>{s.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {selectedStatus === 'resolved' ? (
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', color: '#64748B', display: 'block', marginBottom: '6px' }}>
              RESOLUTION & OUTCOME FOR STUDENTS
            </label>
            <textarea
              rows={3}
              value={resolutionText}
              onChange={e => setResolutionText(e.target.value)}
              placeholder="e.g. Registrar confirmed students can complete registration in person at block B."
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                fontSize: '13px'
              }}
            />
          </div>
        ) : (
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', color: '#64748B', display: 'block', marginBottom: '6px' }}>
              UPDATE NOTE / ACTION LOG (OPTIONAL)
            </label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. Sent email follow-up to Dr. Samuel Tadesse."
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                fontSize: '13px'
              }}
            />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              color: '#475569'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#2563EB',
              fontSize: '13px',
              fontWeight: 600,
              color: '#FFFFFF'
            }}
          >
            Update Request
          </button>
        </div>
      </div>
    </Modal>
  );
};
