
export enum UserRole {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT'
}

export enum PaymentStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  dob?: string;
  joiningDate: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  isFree?: boolean;
  isUpcoming?: boolean;
  startDate?: string;
  duration: string;
  recordings: Recording[];
  thumbnail?: string;
}

export interface Recording {
  id: string;
  date: string;
  title: string;
  url: string; // Supports YouTube URLs
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  totalAmount: number;
  isCompleted: boolean;
  certificateIssued: boolean;
  certificateUrl?: string;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  courses: Course[];
  enrollments: Enrollment[];
}
