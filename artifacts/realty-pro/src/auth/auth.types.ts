export type UserRole = "ADMIN" | "SUPERVISOR" | "USER" | "MERCHANT";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}
