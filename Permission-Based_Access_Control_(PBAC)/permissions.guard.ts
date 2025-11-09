// src/auth/permissions.guard.ts

import {
  CanActivate,             // Contract for Guards
  ExecutionContext,        // Gives access to route metadata & request
  Injectable,              // Marks this class as injectable for Nest's DI
  ForbiddenException,      // Thrown when user is logged in but not allowed
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';          // Used to read metadata
import { PERMISSIONS_KEY } from './permissions.decorator';
import { Permission } from './permissions.enum';

@Injectable()
// PermissionGuard enforces Permission-Based Access Control.
// It assumes authentication (JWT/session) already happened earlier.
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {

    // 1) Read required permissions from route handler or controller
    const requiredPermissions =
      this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
        context.getHandler(),   // method-level metadata
        context.getClass(),     // controller-level metadata
      ]);

    // If route doesn't specify permissions → allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // 2) Get the request object (Express)
    const req = context.switchToHttp().getRequest();

    // 3) JwtAuthGuard should already have attached user object to req.user
    const user = req.user as {
      id: string;
      email: string;
      permissions?: Permission[];
    };

    // If user data is missing → this is an authentication failure
    if (!user) {
      throw new ForbiddenException('User context is missing. Authentication required.');
    }

    // If user has no permission array → treat like no privileges
    const userPermissions = Array.isArray(user.permissions)
      ? user.permissions
      : [];

    // 4) Check if user has *all* required permissions
    // PBAC is typically AND-based (must have all permissions).
    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    // If user lacks any required permission → deny
    if (!hasAllPermissions) {
      throw new ForbiddenException(
        `Missing required permissions: [${requiredPermissions.join(
          ', ',
        )}]. Your permissions: [${userPermissions.join(', ')}]`,
      );
    }

    // 5) All checks passed → allow route execution
    return true;
  }
}
