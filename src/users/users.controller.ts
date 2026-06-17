import { Controller, Get, Req, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserQueryDto } from './user-query.dto';
import { UsersService } from './users.service';


@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
   constructor(
    private readonly userService: UsersService,
  ) {}

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


  @Get('all-user') // get all user
  findAll(
    @Query() query: UserQueryDto,
  ) {
    return this.userService.findAll(query);
  }
}
