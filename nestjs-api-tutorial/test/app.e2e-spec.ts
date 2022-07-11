import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';
import { EditUserDto } from 'src/user/dto';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

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
    await app.listen(3333);

    // Assign prisma
    prisma = app.get(PrismaService);
    prisma.cleanDb();

    // Setup pactum
    pactum.request.setBaseUrl('http://127.0.0.1:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@example.com.vn',
      password: '123456',
    };
    describe('Signup', () => {
      it('Should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
        // .inspect();
      });
    });
    describe('Signin', () => {
      it('Should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}', // S for Stores
          })
          .expectStatus(200);
      });
    });
    describe('Edit user', () => {
      it('should update current user', () => {
        const dto: EditUserDto = {
          firstName: 'Long',
          email: 'emailupdate@example.com',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}', // S for Stores
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.email)
          .expectBodyContains(dto.firstName);
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Get empty bookmark', () => {
      it('should get empty bookmark', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}', // S for Stores
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });
    describe('Create bookmark', () => {
      it('should create new bookmark', () => {
        const dto: CreateBookmarkDto = {
          title: 'First bookmark',
          description: 'Description for bookmark',
          link: 'https://google.com.vn',
        };
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}', // S for Stores
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });
    });
    describe('Get bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}', // S for Stores
          })
          .expectStatus(200)
          .expectJsonLength(1); // At least 1 element
      });
    });
    describe('Get bookmark by id', () => {
      it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}', // S for Stores
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}'); // At least has the value
      });
    });
    describe('Edit bookmark by id', () => {
      it('should edit bookmark by id', () => {
        const dto: EditBookmarkDto = {
          title: 'Updated title',
        };
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}', // S for Stores
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title); // At least has the value
      });
    });
    describe('Delete bookmark by id', () => {
      it('should delete bookmark by id', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}', // S for Stores
          })
          .expectStatus(204);
      });

      it('should get empty bookmarks again', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}', // S for Stores
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });
  });
});
