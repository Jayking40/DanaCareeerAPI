import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsNumber, IsString } from 'class-validator';

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
  phoneNumber: string;

  @ApiProperty({ description: 'Address of the applicant', example: '123 Main St, City' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ description: 'Educational qualification', example: 'BSc in Computer Science' })
  @IsNotEmpty()
  @IsString()
  educationalQualification: string;

  @ApiProperty({ description: 'Previous industry experience', example: '5 years in development' })
  @IsNotEmpty()
  @IsString()
  previousIndustryExperience: string;

  @ApiProperty({ description: 'How the applicant knew about the job', example: 'LinkedIn' })
  @IsNotEmpty()
  @IsString()
  howDidYouKnow: string;

  @ApiProperty({ description: 'Preferred location', example: 'Remote' })
  @IsNotEmpty()
  @IsString()
  preferredLocation: string;

  @ApiProperty({ description: 'Notice period in days', example: '30' })
  @IsNotEmpty()
  @IsString()
  noticePeriodDays: string;

  @ApiProperty({ description: 'Years of experience', example: 5 })
  @IsNotEmpty()
  @IsNumber()
  yearsOfExperience: number;

  @ApiProperty({ description: 'Salary expectation', example: 70000 })
  @IsNotEmpty()
  @IsNumber()
  salaryExpectation: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Resume file (PDF, DOC, or DOCX)',
  })
  resumeCv: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Cover letter file (PDF, DOC, or DOCX)',
  })
  coverLetter: any;

  @ApiProperty({ description: 'ID of the associated job', example: '675f1b4ee5c31b78dd29d4ed' })
  @IsNotEmpty()
  @IsString()
  jobId: string;
}
