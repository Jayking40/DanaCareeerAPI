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
    const { resumeCv, coverLetter, ...data } = createJobApplicationDto;
  
    try {
      let resumeUrl = null;
      let coverUrl = null;
  
      if (resumeCv) {
        console.log('Uploading resume to Cloudinary...');
        resumeUrl = await this.uploadBase64ToCloudinary(resumeCv, 'resume');
      }
  
      if (coverLetter) {
        console.log('Uploading cover letter to Cloudinary...');
        coverUrl = await this.uploadBase64ToCloudinary(coverLetter, 'cover-letter');
      }
  
      console.log('Creating job application...');
      return await this.applicationsService.create(data, resumeUrl, coverUrl);
    } catch (error) {
      console.error('Error in create application handler:', error.message);
      throw new BadRequestException(
        error.message || 'An unexpected error occurred during job application creation.',
      );
    }
  }
  
  private async uploadBase64ToCloudinary(base64: string, folder: string): Promise<string> {
    try {
      if (!base64.startsWith('data:')) {
        base64 = `data:application/pdf;base64,${base64}`;
      }
  
      const uploadResponse = await cloudinary.uploader.upload(base64, {
        folder: `job-applications/${folder}`,
      });
  
      console.log('Cloudinary upload successful:', uploadResponse.secure_url);
      return uploadResponse.secure_url; 
    } catch (error) {
      console.error('Cloudinary upload error:', error.message, error);
      throw new BadRequestException('Failed to upload file to Cloudinary.');
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
