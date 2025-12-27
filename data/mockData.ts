
import { User, Course, Enrollment, UserRole, PaymentStatus } from '../types';

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Admin Guru',
    email: 'admin@dharm.com',
    role: UserRole.ADMIN,
    joiningDate: '2023-01-01'
  },
  {
    id: 'u2',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    role: UserRole.STUDENT,
    phone: '9876543210',
    joiningDate: '2024-03-15'
  },
  {
    id: 'u3',
    name: 'Priya Patel',
    email: 'priya@example.com',
    role: UserRole.STUDENT,
    phone: '9123456789',
    joiningDate: '2024-04-10'
  }
];

export const mockCourses: Course[] = [
  {
    id: 'c1',
    title: 'Advanced Numerology',
    description: 'Master the science of numbers and their impact on human life.',
    price: 5000,
    duration: '4 Weeks',
    recordings: [
      { id: 'r1', date: '2024-05-01', title: 'Session 1: Introduction to Grid', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { id: 'r2', date: '2024-05-02', title: 'Session 2: Psychological Numbers', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
    ]
  },
  {
    id: 'c2',
    title: 'Laal Kitab Mastery',
    description: 'Ancient remedies and planetary influences from the Red Book.',
    price: 7500,
    duration: '6 Weeks',
    recordings: []
  },
  {
    id: 'c3',
    title: 'Vastu Shastra Fundamentals',
    description: 'Create harmony by balancing elements in living spaces.',
    price: 6000,
    duration: '5 Weeks',
    recordings: []
  },
  {
    id: 'c4',
    title: 'Free Webinar: Basics of Kundli',
    description: 'A complimentary session to understand the basics of horoscope reading.',
    price: 0,
    isFree: true,
    duration: '2 Hours',
    recordings: [
      { id: 'r3', date: '2024-06-01', title: 'Free Webinar Recording', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
    ]
  },
  {
    id: 'c5',
    title: 'Upcoming: Predictive Astrology 2025',
    description: 'A specialized batch focusing on transits and dasha systems for the upcoming year.',
    price: 12000,
    isUpcoming: true,
    startDate: '2025-01-15',
    duration: '8 Weeks',
    recordings: []
  }
];

export const mockEnrollments: Enrollment[] = [
  {
    id: 'e1',
    studentId: 'u2',
    courseId: 'c1',
    paymentStatus: PaymentStatus.PAID,
    amountPaid: 5000,
    totalAmount: 5000,
    isCompleted: true,
    certificateIssued: true,
    certificateUrl: 'https://example.com/cert1.pdf'
  },
  {
    id: 'e2',
    studentId: 'u3',
    courseId: 'c1',
    paymentStatus: PaymentStatus.PARTIAL,
    amountPaid: 2500,
    totalAmount: 5000,
    isCompleted: false,
    certificateIssued: false
  }
];
