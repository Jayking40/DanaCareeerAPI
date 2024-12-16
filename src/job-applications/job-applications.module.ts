import { Module } from '@nestjs/common';
import { JobApplicationsController } from './job-applications.controller';
import { JobApplicationsService } from './job-applications.service';
import { FileUploadService } from 'src/services/fileUpload.service';

@Module({
  controllers: [JobApplicationsController],
  providers: [JobApplicationsService, FileUploadService]
})
export class JobApplicationsModule {}
