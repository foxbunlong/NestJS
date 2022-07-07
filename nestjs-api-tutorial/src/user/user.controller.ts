import { Request } from 'express';
import { JwtGaurd } from 'src/auth/gaurd';

import { Controller, Get, Req, UseGuards } from '@nestjs/common';

@Controller('users')
export class UserController {
  //   @UseGuards(AuthGuard('jwt')) // Block unauthorized access without valid token
  @UseGuards(JwtGaurd)
  @Get('me') // Leave blank will use pattern of controller
  getMe(@Req() req: Request) {
    return req.user;
  }
}
