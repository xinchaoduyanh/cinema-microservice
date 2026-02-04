import { Permission, Role } from '../enums';

/**
 * Role-Permission mapping for the cinema management system
 * Defines what permissions each role has
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  /**
   * ADMIN - Full system access
   * Can manage all aspects of the cinema system
   */
  [Role.ADMIN]: [
    // Movie Management
    Permission.MOVIE_CREATE,
    Permission.MOVIE_UPDATE,
    Permission.MOVIE_DELETE,
    Permission.MOVIE_VIEW,

    // Cinema Management
    Permission.CINEMA_CREATE,
    Permission.CINEMA_UPDATE,
    Permission.CINEMA_DELETE,
    Permission.CINEMA_VIEW,

    // Theater Management
    Permission.THEATER_CREATE,
    Permission.THEATER_UPDATE,
    Permission.THEATER_DELETE,
    Permission.THEATER_VIEW,

    // Showtime Management
    Permission.SHOWTIME_CREATE,
    Permission.SHOWTIME_UPDATE,
    Permission.SHOWTIME_DELETE,
    Permission.SHOWTIME_VIEW,

    // Booking Management
    Permission.BOOKING_CREATE,
    Permission.BOOKING_VIEW,
    Permission.BOOKING_VIEW_ALL,
    Permission.BOOKING_CANCEL,
    Permission.BOOKING_VALIDATE,

    // F&B Management
    Permission.FNB_CREATE,
    Permission.FNB_UPDATE,
    Permission.FNB_DELETE,
    Permission.FNB_VIEW,
    Permission.FNB_ORDER,

    // Promotion Management
    Permission.PROMOTION_CREATE,
    Permission.PROMOTION_UPDATE,
    Permission.PROMOTION_DELETE,
    Permission.PROMOTION_VIEW,
    Permission.PROMOTION_APPLY,

    // User Management
    Permission.USER_CREATE,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.USER_VIEW,
    Permission.USER_VIEW_ALL,

    // Report Management
    Permission.REPORT_VIEW,
    Permission.REPORT_EXPORT,

    // Payment Management
    Permission.PAYMENT_VIEW,
    Permission.PAYMENT_REFUND,
  ],

  /**
   * RECEPTIONIST - Staff access
   * Can validate tickets, process F&B orders, and view content
   */
  [Role.RECEPTIONIST]: [
    // View content (read-only)
    Permission.MOVIE_VIEW,
    Permission.CINEMA_VIEW,
    Permission.THEATER_VIEW,
    Permission.SHOWTIME_VIEW,

    // Booking operations
    Permission.BOOKING_VIEW,
    Permission.BOOKING_VIEW_ALL,
    Permission.BOOKING_VALIDATE, // Can validate tickets at entrance

    // F&B operations
    Permission.FNB_VIEW,
    Permission.FNB_ORDER, // Can process F&B orders

    // Promotion operations
    Permission.PROMOTION_VIEW,
    Permission.PROMOTION_APPLY, // Can apply promotions for customers

    // User operations
    Permission.USER_VIEW, // Can view own profile only

    // Payment operations
    Permission.PAYMENT_VIEW, // Can view payment status
  ],

  /**
   * GUEST - Public access
   * Can browse content, book tickets, and manage own bookings
   */
  [Role.GUEST]: [
    // View public content
    Permission.MOVIE_VIEW,
    Permission.CINEMA_VIEW,
    Permission.THEATER_VIEW,
    Permission.SHOWTIME_VIEW,

    // Booking operations (own bookings only)
    Permission.BOOKING_CREATE,
    Permission.BOOKING_VIEW, // Own bookings only
    Permission.BOOKING_CANCEL, // Own bookings only

    // F&B operations
    Permission.FNB_VIEW, // Can view menu

    // Promotion operations
    Permission.PROMOTION_VIEW, // Can view available promotions
    Permission.PROMOTION_APPLY, // Can apply promotions to own bookings

    // User operations
    Permission.USER_VIEW, // Can view own profile
    Permission.USER_UPDATE, // Can update own profile
  ],
};

/**
 * Check if a role has a specific permission
 * @param role - User role
 * @param permission - Permission to check
 * @returns true if role has permission, false otherwise
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Check if a role has any of the specified permissions
 * @param role - User role
 * @param permissions - Array of permissions to check
 * @returns true if role has at least one permission, false otherwise
 */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Check if a role has all of the specified permissions
 * @param role - User role
 * @param permissions - Array of permissions to check
 * @returns true if role has all permissions, false otherwise
 */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

/**
 * Get all permissions for a role
 * @param role - User role
 * @returns Array of permissions for the role
 */
export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}
