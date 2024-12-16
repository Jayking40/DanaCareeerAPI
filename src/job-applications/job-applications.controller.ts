import { Controller, Post, Body, UploadedFiles, UseInterceptors, Get, Param, BadRequestException } from '@nestjs/common';
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
  @ApiResponse({ status: 201, description: 'Job application created successfully' })
  async create(
    @Body() createJobApplicationDto: CreateJobApplicationDto,
  ) {
    const { resumeBase64, coverBase64, ...data } = createJobApplicationDto;

    if (!resumeBase64 || !coverBase64) {
      throw new BadRequestException('Resume and cover letter are required.');
    }

    try {
      const resumeUrl = await this.uploadBase64ToCloudinary(resumeBase64, 'resume');
      const coverUrl = await this.uploadBase64ToCloudinary(coverBase64, 'cover-letter');

      return await this.applicationsService.create(data, resumeUrl, coverUrl);
    } catch (error) {
      console.error('Error uploading files to Cloudinary:', error);
      throw new BadRequestException('Failed to upload files to cloud storage.');
    }
  }

  private async uploadBase64ToCloudinary(base64: string, folder: string): Promise<string> {
    try {
      const uploadResponse = await cloudinary.uploader.upload(`data:application/pdf;base64,${base64}`, {
        folder: `job-applications/${folder}`,
      });
      return uploadResponse.secure_url; 
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new BadRequestException('Cloudinary upload failed.');
    }
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
