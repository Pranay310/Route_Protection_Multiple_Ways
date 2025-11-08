// src/users/users.controller.ts

// Import NestJS decorators for controllers and route protection
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
// Import our custom JWT guard
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users') // Base URL = /users
export class UsersController {

  @UseGuards(JwtAuthGuard) // Protect this route with JWT guard
  @Get('profile') // GET /users/profile
  getProfile(@Req() req) {
    // Return user data added by the guard after successful JWT verification
    return req.user;
  }
}
