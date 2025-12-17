import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard) // 🔥 PHẢI LOGIN
export class UsersController {
  // constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return "Users API OK";
  }

  @Get('me')
  getProfile(@Req() req) {
    return req.user;
  }
}
