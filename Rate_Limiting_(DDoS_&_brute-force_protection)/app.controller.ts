// src/app.controller.ts


import { Controller, Get, UseGuards } from '@nestjs/common';
import { RateLimitGuard } from './common/guards/rate-limit.guard';

@Controller('auth')
export class AuthController {

  @Get('login')
  @UseGuards(RateLimitGuard) // apply rate limiting to login route
  login() {
    return { message: 'Login attempt allowed' };
  }
}
