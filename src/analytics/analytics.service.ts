/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAnalytics() {
    // Fetch open jobs
    const jobs = await this.prisma.job.findMany({
      where: { isOpen: true },
      select: {
        id: true,
        title: true,
        isOpen: true,
        applications: {
          select: { status: true },
        },
      },
    });

    const openPositions = jobs.map((job) => ({
      title: job.title,
      applications: job.applications.length,
    }));

    const totalApplications = await this.prisma.jobApplication.count();
    const applicationStatuses = await this.prisma.jobApplication.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const statusSummary = applicationStatuses.reduce((acc, curr) => {
      acc[curr.status.toLowerCase()] = curr._count.status;
      return acc;
    }, {});

    // Referrals
    const referralSources = await this.prisma.jobApplication.groupBy({
      by: ['source'],
      _count: { source: true },
    });

    const referrals = referralSources.map((item) => ({
      name: item.source || 'Others',
      value: item._count.source,
    }));

    return {
      openPositions: {
        count: openPositions.length,
        jobs: openPositions,
      },
      applicationSummary: {
        totalApplications,
        ...statusSummary,
      },
      referrals,
    };
  }
}
