/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async create(createJobDto: CreateJobDto) {
    return await this.prisma.job.create({
      data: {
        title: createJobDto.title,
        company: createJobDto.company,
        location: createJobDto.location,
        applicationDeadline: createJobDto.applicationDeadline,
        jobSummary: createJobDto.jobSummary,
        responsibilities: createJobDto.responsibilities,
        requiredSkills: createJobDto.requiredSkills,
      },
    });
  }

  async findAll() {
    return await this.prisma.job.findMany({
      include: { applications: true },
    });
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: { applications: true },
    });
    if (!job) throw new NotFoundException(`Job with ID ${id} not found`);
    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    return await this.prisma.job.update({
      where: { id },
      data: updateJobDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.job.delete({
      where: { id },
    });
  }

  async toggleIsOpen(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
    });
  
    if (!job) throw new NotFoundException(`Job with ID ${id} not found`);
  
    return await this.prisma.job.update({
      where: { id },
      data: { isOpen: !job.isOpen },
    });
  }
}
