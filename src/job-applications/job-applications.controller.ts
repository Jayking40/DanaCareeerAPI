import { Controller, Post, Body, UploadedFiles, UseInterceptors, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JobApplicationsService } from './job-applications.service';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
  
  @ApiTags('Job Applications')
  @Controller('job-applications')
  export class JobApplicationsController {
    constructor(private readonly applicationsService: JobApplicationsService) {}
  
    @ApiOperation({ summary: 'Create a new job application' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 201, description: 'Job application created successfully' })
    @Post()
    @UseInterceptors(
      FileFieldsInterceptor([
        { name: 'resume', maxCount: 1 },
        { name: 'cover', maxCount: 1 },
      ], {
        storage: diskStorage({
          destination: './uploads', 
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
        fileFilter: (req, file, cb) => {
          const allowedMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
          if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
          } else {
            cb(new Error('Only .pdf, .doc, and .docx files are allowed!'), false);
          }
        },
      }),
    )
    create(
      @Body() createJobApplicationDto: CreateJobApplicationDto,
      @UploadedFiles() files: { resume?: Express.Multer.File[]; cover?: Express.Multer.File[] },
    ) {
      const resumeFile = files.resume?.[0];
      const coverFile = files.cover?.[0];
      return this.applicationsService.create(createJobApplicationDto, resumeFile, coverFile);
    }
  
    @ApiOperation({ summary: 'Get all job applications' })
    @ApiResponse({ status: 200, description: 'List of all job applications' })
    @Get()
    findAll() {
      return this.applicationsService.findAll();
    }
  
    @ApiOperation({ summary: 'Get a specific job application by ID' })
    @ApiResponse({ status: 200, description: 'Job application data' })
    @ApiResponse({ status: 404, description: 'Job application not found' })
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.applicationsService.findOne(id);
    }
  }
  