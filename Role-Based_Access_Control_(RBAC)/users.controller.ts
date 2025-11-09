// src/users/users.controller.ts

import { Controller, Get, Req } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator'; // decorator to mark required roles
import { Role } from '../auth/roles.enum';       // allowed role values

@Controller('users') // All routes here start with /users
export class UsersController {
  /**
   * GET /users/me
   * - Any authenticated user can access (no @Roles decorator)
   * - JwtAuthGuard will have set req.user
   */
  @Get('me')
  getMe(@Req() req: any) {
    // Return the authenticated user payload
    return req.user;
  }

  /**
   * GET /users/admin/overview
   * - Only ADMINs can access
   * - RolesGuard will verify req.user.roles contains Role.ADMIN
   */
  @Roles(Role.ADMIN)
  @Get('admin/overview')
  adminOverview() {
    return { stats: 'Top-secret admin stats' };
  }

  /**
   * GET /users/managed
   * - Accessible by MANAGER or ADMIN (any of them)
   */
  @Roles(Role.MANAGER, Role.ADMIN)
  @Get('managed')
  managedArea() {
    return { area: 'Manager/Admin shared zone' };
  }
}
