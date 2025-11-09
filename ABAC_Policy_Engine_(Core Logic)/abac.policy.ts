// src/auth/abac/abac.policy.ts

import { ForbiddenException } from '@nestjs/common';

/**
 * ABAC works by checking attributes of:
 *   - user
 *   - resource
 *   - environment (optional)
 *   - action
 *   - context
 *
 * A "policy" is a rule that decides whether a user can perform an action on a resource.
 */

// Define possible actions
export type AbacAction = 'read' | 'create' | 'update' | 'delete';

// Context passed into ABAC rule evaluation
export interface AbacContext {
  user: any;         // logged-in user object (from JWT)
  resource?: any;    // resource fetched from DB (ex: task, user, order)
  action: AbacAction; // action user wants to perform
  req?: any;         // request object if needed
}

/**
 * checkPolicy()
 * This is a simple engine where you write ABAC rules.
 * You can scale this file as your system grows.
 */
export function checkPolicy(ctx: AbacContext): boolean {
  const { user, resource, action } = ctx;

  // 1) Global admin override (example: full access)
  if (user.role === 'ADMIN') {
    return true;
  }

  // 2) Example rule:
  // Users can read or update only their own profile.
  if (
    resource?.type === 'user' &&
    resource.id === user.id &&
    (action === 'read' || action === 'update')
  ) {
    return true;
  }

  // 3) Example rule:
  // A user can only modify tasks that belong to them
  if (
    resource?.type === 'task' &&
    resource.ownerId === user.id &&
    (action === 'read' || action === 'update' || action === 'delete')
  ) {
    return true;
  }

  // 4) Example rule:
  // A manager can read tasks of users in their own department
  if (
    user.role === 'MANAGER' &&
    resource?.type === 'task' &&
    resource.departmentId === user.departmentId &&
    action === 'read'
  ) {
    return true;
  }

  // 5) If no rule matched → deny access
  throw new ForbiddenException('Access denied by ABAC policy');
}
