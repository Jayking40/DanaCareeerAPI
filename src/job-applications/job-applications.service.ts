import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';

@Injectable()
export class JobApplicationsService {
  constructor(private prisma: PrismaService) {}

  // async create(
  //   createJobApplicationDto: CreateJobApplicationDto,
  //   resumeFile: Express.Multer.File,
  //   coverFile: Express.Multer.File,
  // ) {
  //   const { jobId, ...data } = createJobApplicationDto;
  
  //   // Check if job exists
  //   const job = await this.prisma.job.findUnique({ where: { id: jobId } });
  //   if (!job) throw new NotFoundException(`Job with ID ${jobId} not found`);
  
  //   // Ensure file paths are not undefined
  //   const resumePath = resumeFile ? resumeFile.filename : null;
  //   const coverPath = coverFile ? coverFile.filename : null;
  
  //   if (!resumePath) throw new Error('Resume file is required');
  //   if (!coverPath) throw new Error('Cover letter file is required');
  
  //   return await this.prisma.jobApplication.create({
  //     data: {
  //       ...data,
  //       resumeCv: resumePath,  // File path for resume
  //       coverLetter: coverPath, // File path for cover letter
  //       job: { connect: { id: jobId } },
  //     },
  //   });
  // }

  async create(
    createJobApplicationDto: CreateJobApplicationDto,
    resumeFile: Express.Multer.File,
    coverFile: Express.Multer.File,
  ) {
    try {
      const { jobId, ...data } = createJobApplicationDto;
  
      // Check if job exists
      const job = await this.prisma.job.findUnique({ where: { id: jobId } });
      if (!job) throw new NotFoundException(`Job with ID ${jobId} not found`);
  
      // Ensure file paths are not undefined
      const resumePath = resumeFile?.filename || null;
      const coverPath = coverFile?.filename || null;
  
      if (!resumePath) throw new Error('Resume file is required');
      if (!coverPath) throw new Error('Cover letter file is required');
  
      return await this.prisma.jobApplication.create({
        data: {
          ...data,
          resumeCv: resumePath, 
          coverLetter: coverPath, 
          job: { connect: { id: jobId } },
        },
      });
    } catch (error) {
      console.error('Error during job application creation:', error);
      throw error;
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
    if (!application)
      throw new NotFoundException(`Application with ID ${id} not found`);
    return application;
  }
}
