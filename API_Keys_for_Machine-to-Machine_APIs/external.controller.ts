// src/modules/external/external.controller.ts

import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';

@Controller('external')
export class ExternalApiController {

  @Get('sync-data')
  @UseGuards(ApiKeyGuard) // Apply API key protection for this route
  syncData() {
    return { message: 'Data sync executed successfully.' };
  }
}
