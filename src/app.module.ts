import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JobsModule } from './jobs/jobs.module';
import { JobApplicationsModule } from './job-applications/job-applications.module';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({ isGlobal: true }), AuthModule, EventEmitterModule.forRoot(), JobsModule, JobApplicationsModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
