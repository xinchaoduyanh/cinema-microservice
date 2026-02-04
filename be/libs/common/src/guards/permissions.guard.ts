import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '../enums';
import { hasAnyPermission } from '../constants/role-permissions';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

/**
 * Guard to check if user has required permission(s)
 * 
 * This guard provides fine-grained access control based on permissions.
 * It checks if the user's role has any of the required permissions.
 * 
 * Usage:
 * ```typescript
 * @Permissions(Permission.MOVIE_CREATE)
 * @UseGuards(PermissionsGuard)
 * async createMovie() {}
 * ```
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required permissions from metadata
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no permissions required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // Get user from request
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If no user or no role, deny access
    if (!user || !user.role) {
      return false;
    }

    // Check if user's role has any of the required permissions
    return hasAnyPermission(user.role, requiredPermissions);
  }
}
