import { User, UserRole } from "@/auth/auth.types";
import { DEMO_ACCOUNTS } from "@/auth/auth.mock";

const STORAGE_KEY = "admin-users";

// Extended User interface for admin management
export interface ExtendedUser extends User {
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  lastActivity?: string;
  password?: string; // For demo purposes only
}

// Get all users (demo + admin-created)
export function getAllUsers(): ExtendedUser[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  const adminUsers: ExtendedUser[] = stored ? JSON.parse(stored) : [];
  
  // Convert demo accounts to ExtendedUser format
  const demoUsers: ExtendedUser[] = Object.entries(DEMO_ACCOUNTS).map(([role, account]) => ({
    id: `user-${role.toLowerCase()}`,
    email: account.email,
    name: account.name,
    role: role as UserRole,
    status: "active" as const,
    createdAt: new Date().toISOString(),
    password: account.password,
  }));
  
  return [...demoUsers, ...adminUsers];
}

// Add a new user (for Admin)
export function addUser(user: Omit<ExtendedUser, "id" | "createdAt">): ExtendedUser {
  const allUsers = getAllUsers();
  const newId = `user-${Date.now()}`;
  
  const newUser: ExtendedUser = {
    id: newId,
    ...user,
    createdAt: new Date().toISOString(),
  };
  
  const stored = localStorage.getItem(STORAGE_KEY);
  const adminUsers: ExtendedUser[] = stored ? JSON.parse(stored) : [];
  adminUsers.push(newUser);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(adminUsers));
  
  return newUser;
}

// Update a user (for Admin)
export function updateUser(id: string, updates: Partial<ExtendedUser>): ExtendedUser | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  
  const adminUsers: ExtendedUser[] = JSON.parse(stored);
  const index = adminUsers.findIndex((u) => u.id === id);
  
  if (index === -1) return null;
  
  adminUsers[index] = {
    ...adminUsers[index],
    ...updates,
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(adminUsers));
  return adminUsers[index];
}

// Delete a user (for Admin)
export function deleteUser(id: string): boolean {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return false;
  
  const adminUsers: ExtendedUser[] = JSON.parse(stored);
  const filtered = adminUsers.filter((u) => u.id !== id);
  
  if (filtered.length === adminUsers.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

// Get user by email (for auth integration)
export function getUserByEmail(email: string): ExtendedUser | null {
  const allUsers = getAllUsers();
  return allUsers.find((u) => u.email === email) || null;
}

// Get users by role
export function getUsersByRole(role: UserRole): ExtendedUser[] {
  return getAllUsers().filter((u) => u.role === role);
}

// Update user status
export function updateUserStatus(id: string, status: ExtendedUser["status"]): boolean {
  return updateUser(id, { status }) !== null;
}
