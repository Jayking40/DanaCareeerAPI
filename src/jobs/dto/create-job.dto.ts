import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class CreateJobDto {
  @ApiProperty({ description: 'The title of the job', example: 'Senior Backend Developer' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'The name of the company offering the job', example: 'Dana Group of Companies' })
  @IsNotEmpty()
  @IsString()
  company: string;

  @ApiProperty({ description: 'The location of the job', example: 'Lagos' })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({ description: 'Application deadline', example: '2024-12-31' })
  @IsNotEmpty()
  @IsString()
  applicationDeadline: string;

  @ApiProperty({ description: 'Job summary', example: 'Develop and maintain backend APIs' })
  @IsNotEmpty()
  @IsString()
  jobSummary: string;

  @ApiProperty({ description: 'Responsibilities of the job', example: ['Write clean code', 'Design APIs'] })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  responsibilities: string[];

  @ApiProperty({ description: 'Required skills', example: ['Node.js', 'NestJS', 'TypeScript'] })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  requiredSkills: string[];
}

export class UpdateJobDto extends PartialType(CreateJobDto) {}
