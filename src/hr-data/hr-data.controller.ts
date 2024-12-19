/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HRDataService } from './hr-data.service';
import * as path from 'path';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';

@ApiTags('HR Data')
@Controller('hr-data')
export class HRDataController {
  constructor(private readonly hrDataService: HRDataService) {}

  @ApiOperation({ summary: 'Get all subsidiaries' })
  @ApiResponse({
    status: 200,
    description: 'List of subsidiaries retrieved successfully.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Get('subsidiaries')
  getSubsidiaries() {
    return this.hrDataService.getAllSubsidiaries();
  }

  @ApiOperation({ summary: 'Get data for a specific subsidiary' })
  @ApiQuery({
    name: 'subsidiary',
    type: String,
    description: 'The name of the subsidiary to fetch data for.',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Subsidiary data retrieved successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Subsidiary name is required.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Get('subsidiary-data')
  getSubsidiaryData(@Query('subsidiary') subsidiary: string) {
    if (!subsidiary) {
      throw new BadRequestException('Subsidiary name is required');
    }
    return this.hrDataService.getSubsidiaryData(subsidiary);
  }

  @ApiOperation({ summary: 'Download the Excel file' })
  @ApiResponse({
    status: 200,
    description: 'Excel file downloaded successfully.',
  })
  @ApiResponse({ status: 500, description: 'Error downloading the file.' })
  @Get('download')
  downloadExcel(@Res() res) {
    try {
      const filePath = path.resolve(__dirname, '../../data/DanaGroupHRData.xlsx');
      res.download(filePath);
    } catch (error) {
      throw new HttpException(
        'Error downloading the file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Upload and replace the Excel file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'File uploaded and updated successfully!',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid file format or missing file.',
  })
  @ApiResponse({ status: 500, description: 'Error saving the uploaded file.' })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadExcel(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
      }
      this.hrDataService.replaceExcelFile(file);
      return { message: 'File uploaded and updated successfully!' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  @ApiOperation({ summary: 'Get data for all subsidiaries' })
  @ApiResponse({
    status: 200,
    description: 'All subsidiary data retrieved successfully.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  @Get('all-subsidiary-data')
  getAllSubsidiaryData() {
    try {
      return this.hrDataService.getAllSubsidiaryData(); 
    } catch (error) {
      throw new HttpException(
        'Error fetching subsidiary data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
