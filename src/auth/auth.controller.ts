import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { AuthGuard } from '@nestjs/passport';
import { AuthGuard } from '../guards/auth.guard';
import { Public } from './auth.pub';
import { LoginDto } from 'src/users/dto/login.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: LoginDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Body() req) {
    const user = req.user;
    return { message: 'Logout successful' };
  }
}
