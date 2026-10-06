import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useRequests } from '../../context/RequestsContext';
import type { Category, Priority } from '../../types/request';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NewRequestModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addRequest } = useRequests();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('assignment');
  const [priority, setPriority] = useState<Priority>('medium');
  const [studentsAffected, setStudentsAffected] = useState(1);
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('Dr. Samuel Tadesse');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addRequest(title, category, priority, studentsAffected, description, instructor);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log New Class Request">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
            REQUEST TITLE
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Lab assignment extension request"
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '13px' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
              CATEGORY
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '13px' }}
            >
              <option value="assignment">Assignment</option>
              <option value="academic">Academic / Course</option>
              <option value="exam">Exam / Schedule</option>
              <option value="permission">Permission / Excuse</option>
              <option value="general">General Issue</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
              PRIORITY
            </label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as Priority)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '13px' }}
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
              STUDENTS AFFECTED
            </label>
            <input
              type="number"
              min={1}
              max={48}
              value={studentsAffected}
              onChange={e => setStudentsAffected(parseInt(e.target.value) || 1)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
              TARGET INSTRUCTOR / DEPT
            </label>
            <select
              value={instructor}
              onChange={e => setInstructor(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '13px' }}
            >
              <option value="Dr. Samuel Tadesse">Dr. Samuel Tadesse</option>
              <option value="Dr. Meron Kebede">Dr. Meron Kebede</option>
              <option value="Abel Getachew">Abel Getachew</option>
              <option value="Department Registrar">Department Registrar</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
            STUDENT ISSUE DESCRIPTION
          </label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe what the students brought to you..."
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '13px' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', fontSize: '13px', color: '#475569' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', backgroundColor: '#2563EB', fontSize: '13px', color: '#FFFFFF', fontWeight: 600 }}
          >
            Save Request
          </button>
        </div>
      </form>
    </Modal>
  );
};
