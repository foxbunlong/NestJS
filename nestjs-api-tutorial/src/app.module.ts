import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Same as @Global() in custom module
    }), // Allow to load .env file to application
    AuthModule,
    UserModule,
    PrismaModule,
    BookmarkModule,
  ],
})
export class AppModule {}
