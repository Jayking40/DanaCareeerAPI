/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @ApiOperation({ summary: 'Get dashboard analytics' })
  @ApiResponse({
    status: 200,
    description: 'Analytics data for the dashboard',
  })
  @Get('dashboard')
  async getAnalytics() {
    return await this.analyticsService.getAnalytics();
  }
}
