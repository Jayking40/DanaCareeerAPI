/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from '@prisma/client';
import { IsNotEmpty, IsEmail, IsString, IsOptional, MinLength, MaxLength, IsEnum } from 'class-validator';

export class CreateJobApplicationDto {
  @ApiProperty({ description: 'First name of the applicant', example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name of the applicant', example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Email address of the applicant', example: 'john.doe@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Phone number of the applicant', example: '+1234567890' })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(15)
  phoneNumber: string;

  @ApiProperty({ description: 'Address of the applicant', example: '123 Main St, City' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ description: 'Source of the applicant', example: 'Google, Linkedin, Indeed' })
  @IsNotEmpty()
  @IsString()
  source?: string;

  @ApiProperty({ description: 'Educational qualification', example: 'BSc in Computer Science' })
  @IsNotEmpty()
  @IsString()
  educationalQualification: string;

  @ApiProperty({ description: 'Previous industry experience', example: '5 years in development' })
  @IsOptional()
  @IsString()
  previousIndustryExperience?: string;

  @ApiProperty({ description: 'How the applicant knew about the job', example: 'LinkedIn' })
  @IsNotEmpty()
  @IsString()
  howDidYouKnow: string;

  @ApiProperty({ description: 'Preferred location', example: 'Remote' })
  @IsNotEmpty()
  @IsString()
  preferredLocation: string;

  @ApiProperty({ description: 'Notice period in days', example: 30 })
  @IsNotEmpty()
  @IsString()
  noticePeriodDays: string;

  @ApiProperty({ description: 'Years of professional experience in the relevant industry', example: 5 })
  @IsNotEmpty()
  @IsString()
  yearsOfExperience: string;

  @ApiProperty({ description: 'Salary expectation', example: 70000 })
  @IsNotEmpty()
  @IsString()
  salaryExpectation: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  resumeCv?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  coverLetter?: string;

  @ApiProperty({ description: 'ID of the associated job', example: '675f1b4ee5c31b78dd29d4ed' })
  @IsNotEmpty()
  @IsString()
  jobId: string;
}

export class UpdateJobApplicationStatusDto {
  @IsNotEmpty()
  @IsEnum(ApplicationStatus, { message: 'Invalid status value provided' })
  status: ApplicationStatus;
}