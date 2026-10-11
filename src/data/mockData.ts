import type { ClassRequest } from '../types/request';

export const INITIAL_REQUESTS: ClassRequest[] = [
  {
    id: 'REQ-101',
    title: 'Assignment clarification',
    category: 'assignment',
    priority: 'high',
    status: 'in_progress',
    studentsAffected: 12,
    submittedAt: 'September 24, 2026',
    lastUpdatedAt: '10 min ago',
    studentDescription: 'Several students are unclear about whether the Software Architecture Assignment #2 should be submitted individually or in groups of 3, and whether the UML diagram format needs Enterprise Architect files or PDF export.',
    repMemo: 'Dear Dr. Samuel, 12 students in Section A requested formal clarification regarding Assignment #2: (1) Confirming individual vs 3-person group submission rules, and (2) Specifying accepted UML file formats (PDF export vs .EAP). Requesting your guidance.',
    repMemoStatus: 'approved_by_rep',
    instructor: 'Dr. Samuel Tadesse',
    waitingOn: 'Dr. Samuel Tadesse',
    activity: [
      {
        id: 'act-1',
        timestamp: 'Sep 24, 09:15 AM',
        actor: 'student',
        actorName: '12 Students (via Rep)',
        action: 'Request received from student group'
      },
      {
        id: 'act-2',
        timestamp: 'Sep 24, 10:30 AM',
        actor: 'rep',
        actorName: 'Kaleab (Class Rep)',
        action: 'Reviewed issue and compiled formal request memo'
      },
      {
        id: 'act-3',
        timestamp: 'Sep 24, 11:00 AM',
        actor: 'rep',
        actorName: 'Kaleab (Class Rep)',
        action: 'Forwarded approved request memo to Dr. Samuel Tadesse'
      }
    ],
    stakeholderSteps: [
      { stepNumber: 1, title: 'Students raised issue', actorRole: 'Students', status: 'completed', timestamp: 'Sep 24', note: '12 students flagged submission confusion' },
      { stepNumber: 2, title: 'Class Rep analyzed & edited memo', actorRole: 'Class Rep', status: 'completed', timestamp: 'Sep 24', note: 'Kaleab reviewed & formulated formal query' },
      { stepNumber: 3, title: 'Forwarded to Instructor', actorRole: 'Teacher / Admin', status: 'current', timestamp: 'Sep 24', note: 'Waiting for Dr. Samuel Tadesse response' },
      { stepNumber: 4, title: 'Instructor Decision', actorRole: 'Teacher / Admin', status: 'pending' },
      { stepNumber: 5, title: 'Communicated back to Students', actorRole: 'Resolution', status: 'pending' }
    ]
  },
  {
    id: 'REQ-102',
    title: 'Course registration issue',
    category: 'academic',
    priority: 'medium',
    status: 'waiting_for_response',
    studentsAffected: 7,
    submittedAt: 'September 22, 2026',
    lastUpdatedAt: '1 hour ago',
    studentDescription: '7 students are missing prerequisite validation for Database Systems II on the portal due to late grade posting from previous semester.',
    repMemo: 'Formal memo submitted to Department Registrar office detailing 7 Section A students unable to register for Database Systems II due to pending prerequisite grade sync.',
    repMemoStatus: 'approved_by_rep',
    instructor: 'Dr. Meron Kebede',
    waitingOn: 'Department Registrar',
    resolutionText: 'Registrar confirmed that students can complete the missing course registration step directly through the department office desk by Friday.',
    resolutionDate: 'September 25, 2026',
    activity: [
      { id: 'act-10', timestamp: 'Sep 22, 02:00 PM', actor: 'student', actorName: '7 Students', action: 'Reported portal registration blockage' },
      { id: 'act-11', timestamp: 'Sep 23, 09:00 AM', actor: 'rep', actorName: 'Kaleab (Class Rep)', action: 'Submitted escalation list to Department Registrar' }
    ],
    stakeholderSteps: [
      { stepNumber: 1, title: 'Students raised issue', actorRole: 'Students', status: 'completed', timestamp: 'Sep 22' },
      { stepNumber: 2, title: 'Class Rep analyzed & edited memo', actorRole: 'Class Rep', status: 'completed', timestamp: 'Sep 23' },
      { stepNumber: 3, title: 'Escalated to Department Registrar', actorRole: 'Teacher / Admin', status: 'completed', timestamp: 'Sep 23' },
      { stepNumber: 4, title: 'Registrar Resolution Received', actorRole: 'Teacher / Admin', status: 'completed', timestamp: 'Sep 25' },
      { stepNumber: 5, title: 'Students Notified by Class Rep', actorRole: 'Resolution', status: 'completed', timestamp: 'Sep 25' }
    ]
  },
  {
    id: 'REQ-103',
    title: 'Exam schedule question',
    category: 'exam',
    priority: 'high',
    status: 'new',
    studentsAffected: 24,
    submittedAt: 'September 25, 2026',
    lastUpdatedAt: 'Just now',
    studentDescription: '24 students noted a clash between Midterm Exam for Software Architecture and Discrete Math on Thursday morning.',
    repMemo: 'Notice to Dr. Samuel Tadesse: 24 students have overlapping midterm schedules on Thursday 9:00 AM. Requesting shift of Software Architecture exam to 2:00 PM.',
    repMemoStatus: 'draft',
    instructor: 'Dr. Samuel Tadesse',
    waitingOn: 'Kaleab (Review & Forward)',
    activity: [
      { id: 'act-20', timestamp: 'Sep 25, 08:15 AM', actor: 'student', actorName: '24 Students', action: 'Submitted midterm conflict notification' }
    ],
    stakeholderSteps: [
      { stepNumber: 1, title: 'Students raised schedule conflict', actorRole: 'Students', status: 'current', timestamp: 'Sep 25' },
      { stepNumber: 2, title: 'Class Rep review & memo formulation', actorRole: 'Class Rep', status: 'pending' },
      { stepNumber: 3, title: 'Send to Dr. Samuel Tadesse', actorRole: 'Teacher / Admin', status: 'pending' },
      { stepNumber: 4, title: 'Instructor Confirmation', actorRole: 'Teacher / Admin', status: 'pending' },
      { stepNumber: 5, title: 'Broadcast updated schedule', actorRole: 'Resolution', status: 'pending' }
    ]
  }
];

// Generate 52 weeks (364 days) of mock contribution data for circular heatmap
export const GENERATE_CONTRIBUTION_DAYS = () => {
  const days = [];
  const today = new Date();
  
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate pseudo-random contribution intensity (0 to 4)
    const dayOfWeek = date.getDay();
    let count = 0;
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      const seed = (i * 37 + 13) % 10;
      if (seed > 2) count = (seed % 4) + 1; // 1-4 actions
    }

    days.push({
      date: date.toISOString().split('T')[0],
      count, // number of rep actions on this day
      intensity: count === 0 ? 0 : count <= 1 ? 1 : count <= 2 ? 2 : count <= 3 ? 3 : 4
    });
  }
  return days;
};
