import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums';

export const OWNER_PARAM_KEY = 'ownerParam';

export type OwnerParamOptions = {
  /** Route parameter containing the resource owner's user ID. */
  param: string;
  /** Roles allowed to access another user's resource. */
  bypassRoles?: Role[];
};

/**
 * Requires the route parameter to match the authenticated user ID.
 * Use only when the route parameter is itself an owner ID, not a resource ID.
 */
export const OwnerParam = (
  param: string,
  bypassRoles: Role[] = [Role.ADMIN],
) => SetMetadata(OWNER_PARAM_KEY, { param, bypassRoles } satisfies OwnerParamOptions);
