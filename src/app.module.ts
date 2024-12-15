import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({ isGlobal: true }), AuthModule,],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
