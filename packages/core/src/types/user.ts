// User and Authentication types

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface Profile {
  user_id: string;
  full_name?: string;
  target_score?: number;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export type UserRole = 'student' | 'teacher' | 'consultancy_owner' | 'super_admin';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
