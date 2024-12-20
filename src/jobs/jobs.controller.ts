/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/create-job.dto';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @ApiOperation({ summary: 'Create a new job' })
  @ApiResponse({
    status: 201,
    description: 'The job has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Validation errors' })
  @Post('createJob')
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @ApiOperation({ summary: 'Get all jobs' })
  @ApiResponse({ status: 200, description: 'List of jobs' })
  @Get('getAllJobs')
  findAll() {
    return this.jobsService.findAll();
  }

  @ApiOperation({ summary: 'Get a specific job by ID' })
  @ApiResponse({ status: 200, description: 'Job data' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  @Get('getJob/:id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a job by ID' })
  @ApiResponse({ status: 200, description: 'Job updated successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  @Patch('updateJob/:id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(id, updateJobDto);
  }

  @ApiOperation({ summary: 'Delete a job by ID' })
  @ApiResponse({ status: 200, description: 'Job removed successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  @Delete('deleteJob/:id')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }

  @ApiOperation({ summary: 'Toggle the isOpen status of a job' })
@ApiResponse({ status: 200, description: 'Job isOpen status toggled successfully' })
@ApiResponse({ status: 404, description: 'Job not found' })
@Patch('toggleIsOpen/:id')
async toggleIsOpen(@Param('id') id: string) {
  return await this.jobsService.toggleIsOpen(id);
}
}
