import { SetMetadata } from '@nestjs/common';
import { Permission } from '../enums';

/**
 * Metadata key for permissions
 * Must match the key used in PermissionsGuard
 */
export const PERMISSIONS_KEY = 'permissions';

/**
 * Decorator to specify required permissions for a route
 * 
 * @param permissions - One or more permissions that are allowed to access the route
 * 
 * @example
 * ```typescript
 * // Single permission
 * @Permissions(Permission.MOVIE_CREATE)
 * async createMovieEndpoint() {}
 * 
 * // Multiple permissions (OR logic - user must have at least one)
 * @Permissions(Permission.MOVIE_VIEW, Permission.MOVIE_CREATE)
 * async movieEndpoint() {}
 * ```
 */
export const Permissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
