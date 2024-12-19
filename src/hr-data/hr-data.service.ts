/* eslint-disable prettier/prettier */
import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as xlsx from 'xlsx';

@Injectable()
export class HRDataService {
  private readonly filePath = path.resolve(
    __dirname,
    '../../data/DanaGroupHRData.xlsx',
  );

  private readExcelFile() {
    try {
      const fileBuffer = fs.readFileSync(this.filePath);
      const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      return xlsx.utils.sheet_to_json(worksheet);
    } catch (error) {
      throw new HttpException(
        'Error reading the Excel file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  validateExcelFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (path.extname(file.originalname) !== '.xlsx') {
      throw new BadRequestException(
        'Invalid file format. Only .xlsx files are allowed.',
      );
    }
  }

  replaceExcelFile(file: Express.Multer.File) {
    try {
      this.validateExcelFile(file);
      fs.writeFileSync(this.filePath, file.buffer);
    } catch (error) {
      throw new HttpException(
        'Error saving the uploaded file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getSubsidiaryData(subsidiary: string) {
    try {
      const data = this.readExcelFile();
      return data.filter((row: any) => row.Subsidiary === subsidiary);
    } catch (error) {
      throw new HttpException(
        'Error fetching subsidiary data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getAllSubsidiaries() {
    try {
      const data = this.readExcelFile();
      return Array.from(new Set(data.map((row: any) => row.Subsidiary)));
    } catch (error) {
      throw new HttpException(
        'Error fetching subsidiaries',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getAllSubsidiaryData() {
    try {
      const data = this.readExcelFile();
      // Just return all data without filtering for a specific subsidiary
      return data;
    } catch (error) {
      throw new HttpException(
        'Error fetching subsidiary data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}
