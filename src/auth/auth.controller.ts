import { Body, Controller, Post} from '@nestjs/common';
import { LoginDTO, RegisterDTO } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
      ) {}
    
      @Post('register')
      register(@Body() userData: RegisterDTO) {
        return this.authService.register(userData);
      }

      @Post('login')
      login(@Body() loginData: LoginDTO) {
        return this.authService.login(loginData);
      }

      @Post('refresh')
      async refreshToken(@Body() data: any) {
        return this.authService.refreshToken(data.refreshToken);
      }
     
}


