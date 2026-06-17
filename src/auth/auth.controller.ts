import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: { username: string; password: string }) {
    console.log('========================')
    console.log(body)
    console.log('========================')
    return this.authService.login(body.username, body.password);
  }
}
