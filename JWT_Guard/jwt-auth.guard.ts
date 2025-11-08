// src/auth/guards/jwt-auth.guard.ts

// Import required NestJS interfaces and classes
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
// Import jsonwebtoken library for verifying JWT tokens
import * as jwt from 'jsonwebtoken';

@Injectable() // Makes this class available for dependency injection
export class JwtAuthGuard implements CanActivate {
  // This method runs before controller route execution
  canActivate(context: ExecutionContext): boolean {
    // Get the incoming request object
    const req = context.switchToHttp().getRequest();

    // Extract token from "Authorization: Bearer <token>"
    const token = req.headers.authorization?.split(' ')[1];

    // If no token found, block request with 401
    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    try {
      // Verify and decode token using JWT secret
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      // Attach decoded payload (user info) to request for controller use
      req.user = payload;

      // Allow request to continue
      return true;
    } catch (err) {
      // Token invalid or expired, deny access
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

