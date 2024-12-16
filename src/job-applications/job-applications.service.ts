import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';

@Injectable()
export class JobApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createJobApplicationDto: CreateJobApplicationDto,
    resumeUrl?: string,
    coverUrl?: string,
  ) {
    try {
      const { jobId, ...data } = createJobApplicationDto;
  
      // Check if the job exists
      const job = await this.prisma.job.findUnique({ where: { id: jobId } });
      if (!job) throw new NotFoundException(`Job with ID ${jobId} not found`);
  
      // Create the job application
      return await this.prisma.jobApplication.create({
        data: {
          ...data,
          resumeCv: resumeUrl,
          coverLetter: coverUrl,
          job: { connect: { id: jobId } },
          previousIndustryExperience: data.previousIndustryExperience || 'Not specified',
        },
      });
    } catch (error) {
      console.error('Error during job application creation:', error);
  
      if (error instanceof NotFoundException) {
        throw error;
      }
  
      throw new BadRequestException(
        error.message || 'An unexpected error occurred while creating the job application.',
      );
    }
  }
  
  

  async findAll() {
    return await this.prisma.jobApplication.findMany({
      include: { job: true },
    });
  }

  async findOne(id: string) {
    const application = await this.prisma.jobApplication.findUnique({
      where: { id },
      include: { job: true },
    });
    if (!application) throw new NotFoundException(`Application with ID ${id} not found`);
    return application;
  }
}
