import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AbacGuard } from './auth/abac/abac.guard';

@Module({
  imports: [],
  providers: [
    // 1. First authenticate user
    { provide: APP_GUARD, useClass: JwtAuthGuard },

    // 2. Then authorize with ABAC
    { provide: APP_GUARD, useClass: AbacGuard },
  ],
})
export class AppModule {}
