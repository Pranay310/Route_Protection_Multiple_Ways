// src/common/guards/api-key.guard.ts

import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

// Injectable makes this guard available via Nest's dependency injection.
@Injectable()
export class ApiKeyGuard implements CanActivate {

  // Header key name expected in the request.
  // Example:  "x-api-key: 12345"
  private readonly HEADER_KEY = 'x-api-key';

  // Allowed API key stored in environment variable.
  // Never hardcode API keys inside code.
  private readonly VALID_API_KEY = process.env.API_KEY;

  // canActivate runs before the controller handler.
  canActivate(context: ExecutionContext): boolean {

    // Extract request from HTTP context.
    const request = context.switchToHttp().getRequest();

    // Read incoming API key from request headers.
    const incomingApiKey = request.headers[this.HEADER_KEY];

    // If no key present in headers, immediately block request.
    if (!incomingApiKey) {
      throw new ForbiddenException(
        'Access denied: Missing API key in request headers.',
      );
    }

    // Convert incoming API key to string for safety.
    const incomingKey = String(incomingApiKey).trim();

    // Compare incoming key with valid key stored in environment variables.
    if (incomingKey !== this.VALID_API_KEY) {
      throw new ForbiddenException(
        'Access denied: Invalid API key.',
      );
    }

    // If keys match, allow request to continue.
    return true;
  }
}
