export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin'
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
  phone?: string;
  bio?: string;
  createdAt: any;
}

export enum CourseCategory {
  SSC = 'SSC',
  HSC = 'HSC',
  SKILLS = 'Skills'
}

export enum CourseStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PUBLISHED = 'published'
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  discountPrice?: number;
  category: CourseCategory;
  subject: string;
  className: string;
  group?: string;
  instructorId: string;
  instructorName?: string;
  status: CourseStatus;
  createdAt: any;
  updatedAt: any;
}

export interface Lesson {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  description: string;
  videoUrl: string;
  isFree: boolean;
  duration?: string;
  order: number;
  createdAt: any;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: any;
  progress: number;
  completedLessons: string[];
}

export interface Payment {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  method: 'bkash' | 'nagad';
  status: 'completed' | 'pending' | 'failed';
  transactionId: string;
  createdAt: any;
}
