// src/users/users.controller.ts

import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AbacGuard } from '../auth/abac/abac.guard';
import { AbacAction } from '../auth/abac/abac-action.decorator';

@Controller('tasks')
export class TasksController {
  
  // Example: reading a task
  @Get(':id')
  @UseGuards(AbacGuard)
  @AbacAction('read') // action descriptor for ABAC
  async getTask(@Param('id') id: string, @Req() req) {

    // Simulated DB fetch
    const task = {
      id,
      type: 'task',
      ownerId: 'u55',         // owner of the task
      departmentId: 'D1',     // department for manager rule
    };

    // Make task available to ABAC guard
    req.resource = task;

    return task;
  }
}
