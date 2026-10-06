import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useRequests } from '../../context/RequestsContext';
import { Send, FileText, CheckCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  currentMemo: string;
  studentDescription: string;
  instructor: string;
}

export const EditMemoModal: React.FC<Props> = ({
  isOpen,
  onClose,
  requestId,
  currentMemo,
  studentDescription,
  instructor
}) => {
  const { updateRepMemo, updateRequestStatus } = useRequests();
  const [memoText, setMemoText] = useState(currentMemo);

  const handleApproveAndSend = () => {
    updateRepMemo(requestId, memoText);
    updateRequestStatus(requestId, 'waiting_for_response', `Forwarded formal memo to ${instructor}`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Analyze & Edit Memo for ${instructor}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Raw Student Issue reference */}
        <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
            <FileText size={13} />
            <span>Raw Student Feedback</span>
          </div>
          <p style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>
            "{studentDescription}"
          </p>
        </div>

        {/* Rep Formatted Memo Editor */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
            FORMAL MEMO TO INSTRUCTOR (KALEAB'S EDITED VERSION)
          </label>
          <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>
            Structure and clarify the student issue before sending to {instructor}.
          </p>
          <textarea
            rows={5}
            value={memoText}
            onChange={e => setMemoText(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #2563EB',
              borderRadius: '6px',
              fontSize: '13px',
              color: '#0F172A',
              lineHeight: '1.5',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '14px', marginTop: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#16A34A', fontWeight: 600 }}>
            <CheckCircle size={15} />
            <span>Approved by Class Rep</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
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
              onClick={handleApproveAndSend}
              style={{
                padding: '8px 18px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#2563EB',
                fontSize: '13px',
                fontWeight: 600,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Send size={14} />
              <span>Approve & Send to Teacher</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
