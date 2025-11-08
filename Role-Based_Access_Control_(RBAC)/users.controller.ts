import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
@Controller('users')
export class UsersController {
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
  }
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile() {
    return { id: 1, name: 'John' };
  }
}