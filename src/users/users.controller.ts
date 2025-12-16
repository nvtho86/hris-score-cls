import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
    // constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
      return "Nguyễn Văn Thơ ";
    }
}
