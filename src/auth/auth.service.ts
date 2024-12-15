import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { httpErrorException } from 'src/utility.service';
import { LoginDTO, RegisterDTO } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {

    jwtService: any;
    private readonly naiyaTestEmail = 'test@softcode.ng';
    constructor(
      private prisma: PrismaService,
      private jwt: JwtService,
      private config: ConfigService,
      private eventEmitter: EventEmitter2
    ) {}

    async register(userData: RegisterDTO): Promise<any> {
        const passwordHash = await hash(userData.password);
    
        const findUser = await this.prisma.user.findUnique({
          where: { email: userData.email },
        });
    
        if (findUser) {
          throw new ForbiddenException('Email already registered, try login in.');
        }
    
        if (userData.name.length > 20) {
          throw new ForbiddenException('Name can not be more than 20 characters');
        }
    
        try {
          let user = await this.prisma.user.create({
            data: {
              name: userData.name,
              email: userData.email,
              password: passwordHash,
              phone: userData.phoneNumber,
            },
          });
    
          return user;
        } catch (error) {
          httpErrorException(error);
        }
      }

      generateRandomPassword(length: number) {
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const numberChars = '0123456789';
        const specialChars = '!@#$%^&*()-=_+[]{}|;:,.<>?';
    
        const allChars =
          uppercaseChars + lowercaseChars + numberChars + specialChars;
    
        let password = '';
    
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * allChars.length);
          password += allChars.charAt(randomIndex);
        }
    
        return password;
      }


      async generateTokens(user: any): Promise<any> {
        delete user.password;
        delete user.isAdmin;
        delete user.updatedAt;
        delete user.refreshToken;
        const signToken = await this.jwt.signAsync(user, {
          expiresIn: '30days',
          secret: this.config.get('JWT_SECRET'),
        });
        const refreshToken = await this.jwt.signAsync(user, {
          expiresIn: '90days',
          secret: this.config.get('JWT_RefreshSecret'),
        });
        return {
          access_token: signToken,
          refresh_token: refreshToken,
        };
      }

      async login(loginData: LoginDTO, passwordlessLogin?: boolean) {
        let user: any;
        try {
          user = await this.prisma.user.findUnique({
            where: { email: loginData.email },
          });
        } catch (error) {
          throw new UnauthorizedException('User not found');
        }
    
        if (user?.isAdmin === true) {
          throw new ForbiddenException('You are not allowed to login here');
        }
    
        if (user) {
          const password = await verify(user?.password, loginData.password);
    
          if (password || passwordlessLogin) {
    
            const tokens = await this.generateTokens(user);
            await this.updateRefreshToken(user?.id, tokens.refresh_token);
    
            // Emit the UseginEvent when the user successfully logs in
            this.eventEmitter.emit('user?.login', user?.email);
    
            // Return the isFavorite status along with tokensrLo
            return {
              ...tokens,
              userName: user?.name,
              userId: user?.id,
            };
          } else {
            throw new ForbiddenException('Incorrect Password');
          }
        } else {
          throw new ForbiddenException('User Not found');
        }
      }


      async updateRefreshToken(userId: string, refreshToken: string) {
        const refreshTokenHash = await hash(refreshToken);
    
        await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            refreshToken: refreshTokenHash,
          },
        });
      }
    
      async refreshToken(refreshToken: string): Promise<any> {
        let userDetails: any;
        try {
          userDetails = await this.jwt.verifyAsync<any>(refreshToken, {
            secret: process.env.JWT_RefreshSecret,
          });
        } catch {
          httpErrorException('Your login session has timed out. Login again');
        }
        const user: any = await this.prisma.user.findUnique({
          where: {
            id: userDetails.id,
          },
        });
    
        if (!user.refreshToken) throw new ForbiddenException('Access Denied');
    
        const tokens = await this.generateTokens(user);
        await this.updateRefreshToken(user.id, tokens.refresh_token);
        return tokens;
      }
}
