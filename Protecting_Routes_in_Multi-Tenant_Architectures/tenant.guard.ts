// src/common/guards/tenant.guard.ts

import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

// Injectable allows NestJS to create and manage this guard via dependency injection.
@Injectable()
export class TenantGuard implements CanActivate {

  // This guard runs before the controller handler executes.
  canActivate(context: ExecutionContext): boolean {

    // Extract HTTP request from the execution context.
    const request = context.switchToHttp().getRequest();

    // ------------------------------------------------------------
    // STEP 1: Extract tenantId FROM the authenticated user.
    // This comes from JWT payload or session data.
    // Example: req.user = { id: 1, tenantId: 'tenant_001' }
    // ------------------------------------------------------------
    const userTenantId = request.user?.tenantId;

    if (!userTenantId) {
      throw new ForbiddenException(
        'Tenant information missing in authenticated user.',
      );
    }

    // ------------------------------------------------------------
    // STEP 2: Extract tenantId FROM the incoming request.
    // We support 3 common methods:
    //   A) Route params: /tenant/:tenantId/users
    //   B) Header:     x-tenant-id: tenant_001
    //   C) Query:      ?tenantId=tenant_001
    // ------------------------------------------------------------

    const routeTenantId =
      request.params?.tenantId ||                 // /tenant/:tenantId
      request.headers['x-tenant-id'] ||           // header method
      request.query?.tenantId;                    // query method

    if (!routeTenantId) {
      throw new ForbiddenException(
        'Tenant identifier missing in request.',
      );
    }

    // Convert the incoming tenantId to string for consistency.
    const incomingTenantId = String(routeTenantId).trim();

    // ------------------------------------------------------------
    // STEP 3: Compare both tenantIds.
    // BLOCK if user tries to access another tenant’s data.
    // ------------------------------------------------------------
    if (incomingTenantId !== userTenantId) {
      throw new ForbiddenException(
        `Access denied: You do not belong to tenant "${incomingTenantId}".`,
      );
    }

    // ------------------------------------------------------------
    // STEP 4: Allow request to reach controller.
    // ------------------------------------------------------------
    return true;
  }
}
