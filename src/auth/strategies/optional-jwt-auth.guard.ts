import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('auth') {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      return null;
    }
    return user;
  }
}
