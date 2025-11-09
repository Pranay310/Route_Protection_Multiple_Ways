// src/app.module.ts

import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';   // your existing guard
import { RolesGuard } from './auth/roles.guard';
import { UsersModule } from './users/users.module';     // example feature module

@Module({
  imports: [AuthModule, UsersModule],    // bring in auth + feature modules
  providers: [
    // 1) Authenticate all routes by default
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // 2) Then enforce RBAC on top
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
