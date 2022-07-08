import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../src/app.module';

describe('AppController e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication(); // Simulate an app
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // prevent other fields to be passed
      }),
    );
    await app.init();
  });

  afterAll(() => {
    app.close();
  });
  it.todo('OK passed');
});
