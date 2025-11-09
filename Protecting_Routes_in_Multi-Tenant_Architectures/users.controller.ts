// src/modules/users/users.controller.ts


import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

@Controller('tenant/:tenantId/users')
export class UsersController {

  @Get()
  @UseGuards(JwtAuthGuard, TenantGuard) // JWT first → TenantGuard second
  findAllUsers() {
    return { message: 'Tenant-based access allowed ✅' };
  }
}
