import { Module } from '@nestjs/common';
import { HRDataService } from './hr-data.service';
import { HRDataController } from './hr-data.controller';

@Module({
  controllers: [HRDataController],
  providers: [HRDataService],
})
export class HrDataModule {}
