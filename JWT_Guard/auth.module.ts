// src/auth/auth.module.ts


// Import NestJS module decorator
import { Module } from '@nestjs/common';
// Import our custom JWT guard
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  // Provide JwtAuthGuard so NestJS can inject it where required
  providers: [JwtAuthGuard],
  // Export JwtAuthGuard for use in other modules (like UsersModule)
  exports: [JwtAuthGuard],
})
export class AuthModule {}

