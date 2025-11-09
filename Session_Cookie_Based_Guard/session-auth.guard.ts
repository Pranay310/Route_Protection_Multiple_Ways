// src/auth/guards/session-auth.guard.ts

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
// This guard protects routes using session-based authentication.
// It checks if the user's session exists and is valid.
export class SessionAuthGuard implements CanActivate {

  // The canActivate method runs before the controller route executes.
  // If it returns true → request is allowed.
  // If it throws an exception → request is blocked.
  canActivate(context: ExecutionContext): boolean {

    // Extract the request object from the execution context.
    // In NestJS, Express request object contains session data when
    // express-session middleware is applied in main.ts.
    const req = context.switchToHttp().getRequest();

    // Guard logic:
    // When using sessions, express-session adds a `req.session` object.
    // If the user is logged in, we store something like:
    // req.session.userId = <user id>
    // So here we check if that session data exists.
    if (!req.session || !req.session.userId) {
      // If session object doesn't exist or has no userId,
      // it means the user is NOT logged in.
      throw new UnauthorizedException('Session expired or invalid');
    }

    // If we reached this point → user is authenticated.
    // Developer gets user data from: req.session.userId
    return true;
  }
}
