import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums';

/**
 * Metadata key for roles
 * Must match the key used in RolesGuard
 */
export const ROLES_KEY = 'roles';

/**
 * Decorator to specify required roles for a route
 * 
 * @param roles - One or more roles that are allowed to access the route
 * 
 * @example
 * ```typescript
 * // Single role
 * @Roles(Role.ADMIN)
 * async adminOnlyEndpoint() {}
 * 
 * // Multiple roles (OR logic)
 * @Roles(Role.ADMIN, Role.RECEPTIONIST)
 * async staffEndpoint() {}
 * ```
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
