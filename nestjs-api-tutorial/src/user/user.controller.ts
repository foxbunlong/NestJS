import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

import { GetUserDecorator } from '../auth/decorator';
import { JwtGaurd } from '../auth/gaurd';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGaurd) // Every request requires token
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  //   @UseGuards(AuthGuard('jwt')) // Block unauthorized access without valid token
  @Get('me') // Leave blank will use pattern of controller
  // getMe(@Req() req: Request) {
  getMe(@GetUserDecorator() user: User) {
    return user;
  }

  @Patch()
  editUser(@GetUserDecorator('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
