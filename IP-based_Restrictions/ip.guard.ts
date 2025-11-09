// src/common/guards/ip.guard.ts

import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

// Marking this class as injectable so NestJS can use it through dependency injection.
@Injectable()
export class IpGuard implements CanActivate {

  // This array contains the list of allowed IP addresses.
  // Only requests coming from these IPs will be allowed.
  private readonly allowedIps = [
    '127.0.0.1',     // localhost (development)
    '::1',           // IPv6 localhost
    '103.21.244.0',  // example allowed IP (replace with real one)
  ];

  // canActivate runs before a controller route is executed.
  canActivate(context: ExecutionContext): boolean {
    
    // Extract the request object from the context (HTTP request).
    const request = context.switchToHttp().getRequest();

    // Read the incoming IP address from request headers or connection.
    // Different proxies/load balancers may send IP differently.
    const incomingIp =
      request.headers['x-forwarded-for'] ||   // IP forwarded by a reverse proxy (NGINX, Cloudflare)
      request.connection?.remoteAddress ||    // IP from direct connection
      request.ip;                             // Fallback for Express/Nest defaults

    // Convert to string and trim because some proxies send "IP, proxy-ip".
    const normalizedIp = String(incomingIp).split(',')[0].trim();

    // Check if the normalized IP exists in the allowed list.
    const isAllowed = this.allowedIps.includes(normalizedIp);

    // If the incoming IP is not allowed, throw a ForbiddenException.
    if (!isAllowed) {
      throw new ForbiddenException(
        `Access blocked: Your IP (${normalizedIp}) is not allowed.`,
      );
    }

    // If IP is allowed, simply return true to continue with route execution.
    return true;
  }
}
