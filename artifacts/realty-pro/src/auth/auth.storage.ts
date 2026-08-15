import { User } from "./auth.types";

const STORAGE_KEY = "realty-auth-session";

export function saveAuthSession(user: User): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Failed to save auth session:", error);
  }
}

export function getAuthSession(): User | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to load auth session:", error);
    return null;
  }
}

export function clearAuthSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear auth session:", error);
  }
}
