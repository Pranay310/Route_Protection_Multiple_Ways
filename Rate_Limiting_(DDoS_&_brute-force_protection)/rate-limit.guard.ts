// src/common/guards/rate-limit.guard.ts

import { Injectable, CanActivate, ExecutionContext, TooManyRequestsException } from '@nestjs/common';

// Injectable allows NestJS to manage this class using dependency injection.
@Injectable()
export class RateLimitGuard implements CanActivate {

  // Store tracking data for each IP.
  // Key = IP address, value = { count, timestamp }
  // This is simple in-memory rate limiting.
  private readonly requests = new Map<string, { count: number; firstRequestTime: number }>();

  // Maximum allowed requests within the window
  private readonly MAX_REQUESTS = 10; // limit (example: 10 requests)
  
  // Time window in milliseconds (example: 1 minute)
  private readonly WINDOW_SIZE = 60 * 1000;

  // This function runs before the route handler executes
  canActivate(context: ExecutionContext): boolean {
    
    // Extract request object from the incoming context
    const request = context.switchToHttp().getRequest();

    // Get requester IP address. Works behind proxies/load balancers.
    const ip =
      request.headers['x-forwarded-for'] || // client IP forwarded by proxy
      request.connection?.remoteAddress ||  // direct connection IP
      request.ip;                           // fallback IP

    // Normalize IP (some proxies return multiple IPs separated by commas)
    const normalizedIp = String(ip).split(',')[0].trim();

    // Current timestamp in milliseconds
    const currentTime = Date.now();

    // Check if this IP already has tracking data
    const record = this.requests.get(normalizedIp);

    // If no record exists, this is a new IP making a request
    if (!record) {
      this.requests.set(normalizedIp, {
        count: 1,                 // first request
        firstRequestTime: currentTime, // start window time
      });
      return true; // allow request
    }

    // Calculate time passed since first request
    const timePassed = currentTime - record.firstRequestTime;

    // If window has expired, reset tracking data
    if (timePassed > this.WINDOW_SIZE) {
      this.requests.set(normalizedIp, {
        count: 1,
        firstRequestTime: currentTime,
      });
      return true; // allow request
    }

    // If within time window, increment request count
    record.count += 1;

    // If request count exceeds limit, block the request
    if (record.count > this.MAX_REQUESTS) {
      throw new TooManyRequestsException(
        `Rate limit exceeded. Try again after ${Math.ceil(
          (this.WINDOW_SIZE - timePassed) / 1000,
        )} seconds.`,
      );
    }

    // Save updated record
    this.requests.set(normalizedIp, record);

    // Allow normal execution of the route
    return true;
  }
}
