// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  providers: [
    // Not global here; app.module makes them global with APP_GUARD.
    RolesGuard,
    JwtAuthGuard,
  ],
  exports: [
    // Export if you plan to use @UseGuards locally in feature modules
    RolesGuard,
    JwtAuthGuard,
  ],
})
export class AuthModule {}
