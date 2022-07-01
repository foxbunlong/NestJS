import { PrismaService } from 'src/prisma/prisma.service';

import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  init() {
    console.log('Auth Service is successfully initialized');
  }

  signup() {
    return { msg: 'I have signed up' };
  }

  signin() {
    return { msg: 'I have signed in' };
  }
}
