import { Injectable, NotFoundException } from '@nestjs/common';
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
    const { jobId, ...data } = createJobApplicationDto;

    // Check if the job exists
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException(`Job with ID ${jobId} not found`);

    return await this.prisma.jobApplication.create({
      data: {
        ...data,
        resumeCv: resumeUrl,
        coverLetter: coverUrl,
        job: { connect: { id: jobId } },
      },
    });
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
