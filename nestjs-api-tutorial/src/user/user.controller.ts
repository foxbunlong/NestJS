import { GetUserDecorator } from 'src/auth/decorator';
import { JwtGaurd } from 'src/auth/gaurd';

import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

@UseGuards(JwtGaurd) // Every request requires token
@Controller('users')
export class UserController {
  //   @UseGuards(AuthGuard('jwt')) // Block unauthorized access without valid token
  @Get('me') // Leave blank will use pattern of controller
  // getMe(@Req() req: Request) {
  getMe(@GetUserDecorator() user: User) {
    return user;
  }
}
