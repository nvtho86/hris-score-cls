import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {

  @Get('me')
  getProfile(@Req() req) {
    console.log('HIT /users/me');
    console.log(req.headers);
    console.log(req.user);
    return {
      message: 'OK',
      user: req.user, // lấy từ JwtStrategy.validate()
    };
  }
}
