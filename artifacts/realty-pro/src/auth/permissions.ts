import { UserRole } from "./auth.types";

export type Permission =
  // Admin permissions (all permissions)
  | "everything"
  // Supervisor permissions
  | "moderate_properties"
  | "manage_users"
  | "review_merchants"
  | "manage_content"
  // User permissions
  | "browse_properties"
  | "favorite_properties"
  | "contact_merchants"
  | "manage_profile"
  // Merchant permissions
  | "manage_own_properties"
  | "create_property"
  | "edit_own_property"
  | "view_leads";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: ["everything"],
  SUPERVISOR: [
    "moderate_properties",
    "manage_users",
    "review_merchants",
    "manage_content",
    "browse_properties",
    "manage_profile",
  ],
  USER: [
    "browse_properties",
    "favorite_properties",
    "contact_merchants",
    "manage_profile",
  ],
  MERCHANT: [
    "manage_own_properties",
    "create_property",
    "edit_own_property",
    "view_leads",
    "browse_properties",
    "manage_profile",
  ],
};

export function hasRole(role: UserRole, userRole: UserRole): boolean {
  if (userRole === "ADMIN") return true;
  return role === userRole;
}

export function hasPermission(permission: Permission, userRole: UserRole): boolean {
  if (userRole === "ADMIN") return true;
  return ROLE_PERMISSIONS[userRole].includes(permission);
}

export function can(permission: Permission, userRole: UserRole): boolean {
  return hasPermission(permission, userRole);
}

export function getRoleRedirectPath(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "SUPERVISOR":
      return "/supervisor";
    case "USER":
      return "/dashboard";
    case "MERCHANT":
      return "/merchant";
    default:
      return "/dashboard";
  }
}
