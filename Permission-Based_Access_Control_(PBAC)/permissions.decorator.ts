// src/auth/permissions.decorator.ts

import { SetMetadata } from '@nestjs/common';
import { Permission } from './permissions.enum';

// The metadata key to store required permissions for a route.
// This is how NestJS retrieves the required permissions later.
export const PERMISSIONS_KEY = 'permissions';

/**
 * @Permissions(...perms)
 * Example:
 *   @Permissions(Permission.UPDATE_USER, Permission.READ_USER)
 *
 * This decorator simply attaches metadata to the route handler.
 */
export const Permissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
