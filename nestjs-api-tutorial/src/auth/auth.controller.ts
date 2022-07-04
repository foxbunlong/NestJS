import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
    authService.init();
  }

  @Post('helloJson')
  helloJson() {
    return { msg: 'Hello World' };
  }

  // @Post('signup')
  // signup(@Req() req: Request) {
  //   console.log(req.body);
  //   return this.authService.signup();
  // }

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    console.log({ dto });
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin() {
    return this.authService.signin();
  }
}
