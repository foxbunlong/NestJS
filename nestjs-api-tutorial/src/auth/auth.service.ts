import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';

import { Injectable } from '@nestjs/common';

import { AuthDto } from './dto';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  init() {
    console.log('Auth Service is successfully initialized');
  }

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
      },
      // select: {
      //   id: true,
      //   email: true,
      //   createdAt: true,
      // },
    });

    delete user.hash;

    return user;
  }

  signin() {
    return { msg: 'I have signed in' };
  }
}
