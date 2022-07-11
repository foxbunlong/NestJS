import * as argon from 'argon2';

import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  init() {
    console.log('Auth Service is successfully initialized');
  }

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    try {
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

      user['token'] = await this.signToken(user.id, user.email);

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Dublicated field
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Credentails incorrect');
    }

    console.log('findUnique result:', user);

    const pwMatched = await argon.verify(user.hash, dto.password);
    if (!pwMatched) {
      throw new ForbiddenException('Credentails incorrect');
    }

    delete user.hash;

    user['token'] = await this.signToken(user.id, user.email);

    return user;
  }

  signToken = (userId: number, email: string): Promise<string> => {
    // sub: jwt convention
    const payload = {
      sub: userId,
      email,
    };

    return this.jwt.signAsync(payload, {
      expiresIn: '1m',
      secret: this.config.get('JWT_SECRET'),
    });
  };
}
