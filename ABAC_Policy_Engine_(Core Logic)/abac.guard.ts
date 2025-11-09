// src/auth/abac/abac.guard.ts

import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { checkPolicy } from './abac.policy';

// KEY used to store metadata using decorator
const ABAC_ACTION_KEY = 'abac_action';

/**
 * Decorator function to specify what action is being performed.
 * Example: @AbacAction('update')
 */
export const AbacAction = (action: string) =>
  Reflect.metadata(ABAC_ACTION_KEY, action);

@Injectable()
// ABAC Guard
// Reads the action from metadata,
// fetches resource if needed,
// evaluates ABAC policy,
// and allows or blocks the request.
export class AbacGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract request object
    const req = context.switchToHttp().getRequest();

    // Read which action this route requires
    const action =
      this.reflector.get<string>(ABAC_ACTION_KEY, context.getHandler()) ||
      'read';

    // Logged-in user (set by JwtAuthGuard)
    const user = req.user;

    // Some ABAC systems fetch resource by ID to evaluate conditions
    // Example: GET /tasks/:id → fetch task from DB
    let resource = null;

    // If controller sets req.resource (optional)
    // Many apps manually attach resource in controller before guard
    if (req.resource) {
      resource = req.resource;
    }

    // Optionally you can auto-fetch resource here using IDs from params
    // In enterprise systems, ABAC fetches resource using repository
    // Example (pseudo):
    //
    // const id = req.params.id;
    // resource = await this.taskRepo.findOne({ id });

    // Now evaluate ABAC policy
    // If it returns true → allowed
    // If throws ForbiddenException → denied
    return checkPolicy({
      user,
      resource,
      action,
      req,
    });
  }
}
