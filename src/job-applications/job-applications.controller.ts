import { Controller, Post, Body, UploadedFiles, UseInterceptors, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JobApplicationsService } from './job-applications.service';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { diskStorage } from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.config';
@ApiTags('Job Applications')
@Controller('job-applications')
export class JobApplicationsController {
  constructor(private readonly applicationsService: JobApplicationsService) {}

  @Post('apply')
  @ApiOperation({ summary: 'Create a new job application' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Job application created successfully' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'resume', maxCount: 1 },
        { name: 'cover', maxCount: 1 },
      ],
      {
        storage: new CloudinaryStorage({
          cloudinary,
          params: {
            folder: 'job-applications',
            format: async () => 'pdf',
            public_id: (req, file) => `${Date.now()}-${file.originalname}`,
          } as Record<string, unknown>,
        }),
        limits: { fileSize: 10 * 1024 * 1024 },
      },
    ),
  )
  async create(
    @Body() createJobApplicationDto: CreateJobApplicationDto,
    @UploadedFiles() files: { resume?: Express.Multer.File[]; cover?: Express.Multer.File[] },
  ) {
    const resumeFileUrl = files.resume?.[0]?.path || null;
    const coverFileUrl = files.cover?.[0]?.path || null;
  
    return this.applicationsService.create(createJobApplicationDto, resumeFileUrl, coverFileUrl);
  }
  

  @ApiOperation({ summary: 'Get all job applications' })
  @ApiResponse({ status: 200, description: 'List of all job applications' })
  @Get("getAllApplication")
  findAll() {
    return this.applicationsService.findAll();
  }

  @ApiOperation({ summary: 'Get a specific job application by ID' })
  @ApiResponse({ status: 200, description: 'Job application data' })
  @ApiResponse({ status: 404, description: 'Job application not found' })
  @Get('getApplication/:id')
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }
}
