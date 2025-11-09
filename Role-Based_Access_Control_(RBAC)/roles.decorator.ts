// src/auth/roles.decorator.ts

import { SetMetadata } from '@nestjs/common';
import { Role } from './roles.enum';

// A constant metadata key under which we'll store required roles
export const ROLES_KEY = 'roles';

/**
 * @Roles(...roles)
 * Declarative decorator to mark a route/handler with required roles.
 * Example: @Roles(Role.ADMIN, Role.MANAGER)
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
