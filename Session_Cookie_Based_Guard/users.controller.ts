// src/users/users.controller.ts

import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';

@Controller('users')
export class UsersController {
  
  // Protect this route using session authentication.
  @UseGuards(SessionAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    // req.session contains data stored during login.
    return {
      message: 'User profile fetched successfully',
      userId: req.session.userId,
    };
  }
}
