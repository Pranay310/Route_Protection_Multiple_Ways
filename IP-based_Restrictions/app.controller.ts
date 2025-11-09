import { Controller, Get, UseGuards } from '@nestjs/common';
import { IpGuard } from './common/guards/ip.guard';

@Controller('admin')
export class AdminController {

  @Get('dashboard')
  @UseGuards(IpGuard)     // Protect this route with IP restriction
  getAdminDashboard() {
    return { message: 'Welcome Admin, IP check passed!' };
  }
}
