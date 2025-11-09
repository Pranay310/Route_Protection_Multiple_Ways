// src/users/users.controller.ts

import { Controller, Get, Patch } from '@nestjs/common';
import { Permissions } from '../auth/permissions.decorator';
import { Permission } from '../auth/permissions.enum';

@Controller('users')
export class UsersController {
  
  // No permissions required (just authenticated)
  @Get('me')
  getMe() {
    return { message: 'Accessible to any logged-in user' };
  }

  // Only users with CREATE_USER permission can create a new user
  @Permissions(Permission.CREATE_USER)
  @Patch('create')
  createUser() {
    return { message: 'User created successfully' };
  }

  // Only users with admin-level privileged permission
  @Permissions(Permission.VIEW_ADMIN_DASHBOARD)
  @Get('admin/dashboard')
  adminDashboard() {
    return { stats: 'Top secret admin stats' };
  }
}
