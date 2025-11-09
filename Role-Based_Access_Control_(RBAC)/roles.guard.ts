// src/auth/roles.guard.ts

import {
  CanActivate,            // Interface every guard must implement
  ExecutionContext,       // Provides access to request context (HTTP/RPC/WS)
  Injectable,             // Marks class as injectable for Nest DI
  ForbiddenException,     // Thrown when the user is authenticated but not allowed
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';     // Reads decorator metadata at runtime
import { ROLES_KEY } from './roles.decorator';// Metadata key used by @Roles
import { Role } from './roles.enum';          // Our role enum

/**
 * RolesGuard
 * - Assumes that authentication already happened (e.g., JwtAuthGuard)
 * - Reads required roles from handler/class metadata
 * - Checks if req.user.roles includes any required role
 */
@Injectable()
export class RolesGuard implements CanActivate {
  // Reflector lets us read metadata set by decorators like @Roles
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Read required roles from the route handler first, then the class (controller)
    const requiredRoles =
      this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),   // method-level metadata
        context.getClass(),     // controller-level metadata
      ]);

    // If no roles were specified, allow access (route is public to any authenticated user)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Switch into HTTP context and grab the underlying Express request
    const req = context.switchToHttp().getRequest();

    // JwtAuthGuard should have attached `user` to the request earlier
    const user = req.user as { id: string; roles?: Role[] };

    // If user is missing, something is wrong with the auth chain; block access
    if (!user) {
      throw new ForbiddenException('Missing user context');
    }

    // Normalize roles (ensure array) to avoid runtime issues
    const userRoles: Role[] = Array.isArray(user.roles) ? user.roles : [];

    // Check if user has at least one of the required roles
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    // If not, throw 403 Forbidden (authenticated but not authorized)
    if (!hasRole) {
      throw new ForbiddenException(
        `Insufficient role. Required: [${requiredRoles.join(
          ', ',
        )}], you have: [${userRoles.join(', ')}]`,
      );
    }

    // All checks passed; allow the request to proceed
    return true;
  }
}
