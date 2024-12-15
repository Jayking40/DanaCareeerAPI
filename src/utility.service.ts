import { HttpException, HttpStatus } from '@nestjs/common';

export function httpErrorException(error: any) {
    throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
  }