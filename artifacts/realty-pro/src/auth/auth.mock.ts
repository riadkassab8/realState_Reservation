import { User, UserRole } from "./auth.types";

// Demo accounts for testing
export const DEMO_ACCOUNTS: Record<UserRole, { email: string; password: string; name: string }> = {
  ADMIN: {
    email: "admin@realty-flow.local",
    password: "demo123",
    name: "Admin User",
  },
  SUPERVISOR: {
    email: "supervisor@realty-flow.local",
    password: "demo123",
    name: "Supervisor User",
  },
  USER: {
    email: "user@realty-flow.local",
    password: "demo123",
    name: "Regular User",
  },
  MERCHANT: {
    email: "merchant@realty-flow.local",
    password: "demo123",
    name: "Merchant User",
  },
};

// Simulate API delay
const SIMULATED_DELAY = 800;

// Mock login function - replace with real API call later
export async function mockLogin(email: string, password: string): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY));

  const role = Object.entries(DEMO_ACCOUNTS).find(
    ([, account]) => account.email === email && account.password === password
  )?.[0] as UserRole;

  if (!role) {
    throw new Error("Invalid credentials");
  }

  const account = DEMO_ACCOUNTS[role];
  return {
    id: `user-${role.toLowerCase()}`,
    email: account.email,
    name: account.name,
    role,
  };
}

// Mock logout function - replace with real API call later
export async function mockLogout(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));
}
