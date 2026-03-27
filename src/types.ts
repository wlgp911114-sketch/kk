export interface Participant {
  id?: string;
  name: string;
  dob: string;
  phone: string;
  region: string;
  score: number;
  answers: boolean[];
  createdAt: string;
}

export interface QuizQuestion {
  id?: string;
  question: string;
  answer: boolean;
  explanation: string;
  order: number;
}

export interface CMSContent {
  id?: string;
  section: string;
  title: string;
  content: string;
  imageUrl?: string;
  updatedAt: string;
}

export interface Settings {
  id?: string;
  primaryColor: string;
  accentColor: string;
  bannerUrl: string;
}

export type UserRole = 'admin' | 'user';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
}
