import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { PrismaService } from '../../../src/prisma/prisma.service';

// This class clarify Authorization field in header request to validate token
// 2nd params should be the same as defined in controller. Otherwise, error can be 'Unknown authentication strategy ...'
@Injectable()
export class JwtStategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  // This function will append to request object
  async validate(payload: { sub: number; email: string }) {
    console.log(payload);

    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    delete user.hash;

    return user;
  }
}
