import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { PermissionGuard } from './auth/permissions.guard';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, UsersModule],
  providers: [
    // Step 1: Authenticate
    { provide: APP_GUARD, useClass: JwtAuthGuard },

    // Step 2: Authorize (permissions)
    { provide: APP_GUARD, useClass: PermissionGuard },
  ],
})
export class AppModule {}
