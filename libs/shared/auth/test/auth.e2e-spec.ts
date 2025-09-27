import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as request from 'supertest';
import { isJWT } from 'class-validator';

import { CreateUserIdentityDto, LoginInputModel } from '@app/auth/dto/input';
import { AuthModule } from '../src/auth.module';
import { TypeOrmConfigService } from './db/typeorm.config';
import { AuthService } from '../src/auth.service';
import { UserIdentityEntity } from '../src/db';
import { AUTH_TOKEN_NAME } from '../src/const';
import { AuthDataSource } from './db/data-source';
import { randomUUID } from 'crypto';

describe.skip('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeAll(async () => {
    await AuthDataSource.initialize();
    await AuthDataSource.createQueryRunner().query('delete from user_identity_entity cascade');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `.env.${process.env.NODE_ENV}`,
          isGlobal: true,
        }),
        TypeOrmModule.forRootAsync(TypeOrmConfigService()),
        AuthModule,
      ],
      providers: [JwtService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, disableErrorMessages: false }));
    await app.init();
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    authService = moduleFixture.get<AuthService>(AuthService);
    jwtService = moduleFixture.get<JwtService>(JwtService);

    const mockCreateUserDTO: CreateUserIdentityDto = { email: 'test@email.com', password: 'my-strong-password' };
    const mockUser: UserIdentityEntity = await authService.signup(mockCreateUserDTO);
    const userIdentityRepository = AuthDataSource.getRepository(UserIdentityEntity);
    await userIdentityRepository.save(mockUser);
  });

  afterAll(async () => {
    await app.close();
    await AuthDataSource.destroy();
  });

  describe('/auth/login (POST)', () => {
    it('should successfully login and return a refresh token for valid credentials', async () => {
      const mockCreateUserDTO: CreateUserIdentityDto = { email: 'test@email.com', password: 'my-strong-password' };
      const userIdentityRepository = AuthDataSource.getRepository(UserIdentityEntity);
      const savedUser = await userIdentityRepository.findOne({ where: { email: mockCreateUserDTO.email } });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(mockCreateUserDTO as LoginInputModel)
        .expect(201);

      expect(isJWT(response.body.refresh_token)).toBeTruthy();
      const refreshTokenPayload = jwtService.decode(response.body.refresh_token);
      expect(refreshTokenPayload.email).toEqual(savedUser.email);
      expect(refreshTokenPayload.sub).toEqual(savedUser.id);
      expect(response.get('Set-Cookie')).toBeDefined();
      expect(response.get('Set-Cookie')[0]).toContain(AUTH_TOKEN_NAME);
    });

    it('should return 401 Unauthorized when the request body is missing', async () => {
      const response = await request(app.getHttpServer()).post('/auth/login').send({}).expect(401);
      expect(response.body.message).toEqual('Unauthorized');
    });

    it('should return 401 Unauthorized when the email is missing from the request body', async () => {
      const invalidLoginData = { password: 'somepassword' };
      const response = await request(app.getHttpServer()).post('/auth/login').send(invalidLoginData).expect(401);
      expect(response.body.message).toEqual('Unauthorized');
    });

    it('should return 401 Unauthorized when the password is missing from the request body', async () => {
      const invalidLoginData = { email: 'test@email.com' };
      const response = await request(app.getHttpServer()).post('/auth/login').send(invalidLoginData).expect(401);
      expect(response.body.message).toEqual('Unauthorized');
    });

    it('should return 401 Unauthorized when the email format is invalid', async () => {
      const invalidLoginData = { email: 'invalid-email', password: 'password123' };
      const response = await request(app.getHttpServer()).post('/auth/login').send(invalidLoginData).expect(401);
      expect(response.body.message).toEqual('Unauthorized');
    });
  });

  describe('/auth/refresh (POST)', () => {
    it('should successfully refresh and return a new refresh token for a valid refresh token', async () => {
      const mockCreateUserDTO: CreateUserIdentityDto = { email: 'test@email.com', password: 'my-strong-password' };
      const userIdentityRepository = AuthDataSource.getRepository(UserIdentityEntity);
      const savedUser = await userIdentityRepository.findOne({ where: { email: mockCreateUserDTO.email } });

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send(mockCreateUserDTO as LoginInputModel)
        .expect(201);

      const refreshToken = loginResponse.body.refresh_token;

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refresh_token: refreshToken })
        .expect(201);

      expect(isJWT(response.body.refresh_token)).toBeTruthy();
      const refreshTokenPayload = jwtService.decode(response.body.refresh_token);
      expect(refreshTokenPayload.email).toEqual(savedUser.email);
      expect(refreshTokenPayload.sub).toEqual(savedUser.id);
      expect(response.get('Set-Cookie')).toBeDefined();
      expect(response.get('Set-Cookie')[0]).toContain(AUTH_TOKEN_NAME);
      expect(response.get('Set-Cookie')[0]).not.toEqual(loginResponse.get('Set-Cookie')[0]);
    }, 2000);

    it('should return 400 Bad Request when the refresh token is missing from the request body', async () => {
      const response = await request(app.getHttpServer()).post('/auth/refresh').send({}).expect(400);
      expect(response.body.message).toEqual([
        'refresh_token should not be null or undefined',
        'refresh_token must be a jwt string',
      ]);
    });

    it('should return 400 Bad Request when the refresh token is an empty string', async () => {
      const response = await request(app.getHttpServer()).post('/auth/refresh').send({ refresh_token: '' }).expect(400);
      expect(response.body.message).toEqual(['refresh_token must be a jwt string']);
    });

    it('should return 400 Bad Request when the refresh token is not a valid JWT format', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refresh_token: 'invalid-token' })
        .expect(400);
      expect(response.body.message).toEqual(['refresh_token must be a jwt string']);
    });
    it('should return 401 Unauthorized when the refresh token is expired', async () => {
      const expiredToken = jwtService.sign({ email: 'test@email.com', sub: 1 }, { expiresIn: '-1s' });
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refresh_token: expiredToken })
        .expect(401);
      expect(response.body.message).toEqual('Unauthorized');
    });

    it('should return 401 Unauthorized when the refresh token does not match any user', async () => {
      const invalidRefreshToken = jwtService.sign({ email: 'nonexistent@email.com', sub: randomUUID() });
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refresh_token: invalidRefreshToken })
        .expect(401);
      expect(response.body.message).toEqual('Unauthorized');
    });

    it('should return 401 Unauthorized when the sub in refresh token payload is not a uuid', async () => {
      const invalidRefreshToken = jwtService.sign({ email: 'test@email.com', sub: 999 });
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refresh_token: invalidRefreshToken })
        .expect(401);
      expect(response.body.message).toEqual('Unauthorized');
    });
  });

  describe('/auth (POST)', () => {
    it('should successfully log out a user and clear cookies when a valid JWT is provided', async () => {
      const mockCreateUserDTO: CreateUserIdentityDto = { email: 'test@email.com', password: 'my-strong-password' };
      const userIdentityRepository = AuthDataSource.getRepository(UserIdentityEntity);
      await userIdentityRepository.findOne({ where: { email: mockCreateUserDTO.email } });

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send(mockCreateUserDTO as LoginInputModel)
        .expect(201);

      const accessToken = loginResponse.get('Set-Cookie')[0].split(';')[0].split('%20')[1];

      const response = await request(app.getHttpServer())
        .patch('/auth')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.get('Set-Cookie')).toBeDefined();
      expect(response.get('Set-Cookie')[0]).toContain(`${AUTH_TOKEN_NAME}=;`);
    });

    it('should return 401 Unauthorized when no Authorization header is provided for logout', async () => {
      const response = await request(app.getHttpServer()).patch('/auth').expect(401);
      expect(response.body.message).toEqual('Unauthorized');
    });

    it('should return 401 Unauthorized when an invalid JWT is provided in the Authorization header for logout', async () => {
      const invalidAccessToken = 'Bearer invalid.jwt.token';

      const response = await request(app.getHttpServer()).patch('/auth').set('Authorization', invalidAccessToken).expect(401);

      expect(response.body.message).toEqual('Unauthorized');
    });

    it('should return 401 Unauthorized when the JWT token is expired in the Authorization header for logout', async () => {
      const expiredAccessToken = jwtService.sign({ email: 'test@email.com', sub: 1 }, { expiresIn: '-1s' });

      const response = await request(app.getHttpServer())
        .patch('/auth')
        .set('Authorization', `Bearer ${expiredAccessToken}`)
        .expect(401);

      expect(response.body.message).toEqual('Unauthorized');
    });

    it('should return 401 Unauthorized when the JWT token has an invalid signature in the Authorization header for logout', async () => {
      const invalidSignatureToken = jwtService.sign({ email: 'test@email.com', sub: 1 }, { secret: 'wrong-secret' });

      const response = await request(app.getHttpServer())
        .patch('/auth')
        .set('Authorization', `Bearer ${invalidSignatureToken}`)
        .expect(401);

      expect(response.body.message).toEqual('Unauthorized');
    });

    it('should handle the case where the user is already logged out and attempts to logout again', async () => {
      const mockCreateUserDTO: CreateUserIdentityDto = { email: 'test@email.com', password: 'my-strong-password' };
      const userIdentityRepository = AuthDataSource.getRepository(UserIdentityEntity);
      await userIdentityRepository.findOne({ where: { email: mockCreateUserDTO.email } });

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send(mockCreateUserDTO as LoginInputModel)
        .expect(201);

      const accessToken = loginResponse.get('Set-Cookie')[0].split(';')[0].split('%20')[1];

      // First logout attempt
      await request(app.getHttpServer()).patch('/auth').set('Authorization', `Bearer ${accessToken}`).expect(200);

      // Second logout attempt, should handle gracefully
      const response = await request(app.getHttpServer())
        .patch('/auth')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401);

      expect(response.body.message).toEqual('Unauthorized');
    });

    it('should return 401 Unauthorized when the Authorization header is present but empty for logout', async () => {
      const response = await request(app.getHttpServer()).patch('/auth').set('Authorization', '').expect(401);

      expect(response.body.message).toEqual('Unauthorized');
    });

    it('should handle the case where the user identity is deleted from the database before logout', async () => {
      const mockCreateUserDTO: CreateUserIdentityDto = { email: 'test@email.com', password: 'my-strong-password' };
      const userIdentityRepository = AuthDataSource.getRepository(UserIdentityEntity);
      const savedUser = await userIdentityRepository.findOne({ where: { email: mockCreateUserDTO.email } });

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send(mockCreateUserDTO as LoginInputModel)
        .expect(201);

      const accessToken = loginResponse.get('Set-Cookie')[0].split(';')[0].split('%20')[1];

      await userIdentityRepository.delete(savedUser.id);

      const response = await request(app.getHttpServer())
        .patch('/auth')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401);

      expect(response.body.message).toEqual('Unauthorized');
    });
  });

  describe('/auth (DELETE)', () => {
    it('should successfully delete a user when a valid JWT is provided in the Authorization header', async () => {
      const mockCreateUserDTO: CreateUserIdentityDto = { email: 'test-delete@email.com', password: 'my-strong-password' };
      const userIdentityRepository = AuthDataSource.getRepository(UserIdentityEntity);
      const mockUser: UserIdentityEntity = await authService.signup(mockCreateUserDTO);
      await userIdentityRepository.save(mockUser);

      const savedUser = await userIdentityRepository.findOne({ where: { email: mockCreateUserDTO.email } });

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send(mockCreateUserDTO as LoginInputModel)
        .expect(201);

      const accessToken = loginResponse.get('Set-Cookie')[0].split(';')[0].split('%20')[1];

      await request(app.getHttpServer()).delete('/auth').set('Authorization', `Bearer ${accessToken}`).expect(200);

      const deletedUser = await userIdentityRepository.findOne({ where: { id: savedUser.id } });
      expect(deletedUser).toBeNull();
    });

    it('should handle the case where the user identity is deleted from the database before attempting to delete user', async () => {
      const mockCreateUserDTO: CreateUserIdentityDto = { email: 'test-delete@email.com', password: 'my-strong-password' };
      const userIdentityRepository = AuthDataSource.getRepository(UserIdentityEntity);
      const mockUser: UserIdentityEntity = await authService.signup(mockCreateUserDTO);
      await userIdentityRepository.save(mockUser);

      const savedUser = await userIdentityRepository.findOne({ where: { email: mockCreateUserDTO.email } });

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send(mockCreateUserDTO as LoginInputModel)
        .expect(201);

      const accessToken = loginResponse.get('Set-Cookie')[0].split(';')[0].split('%20')[1];

      await userIdentityRepository.delete(savedUser.id);

      const response = await request(app.getHttpServer())
        .delete('/auth')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401);

      expect(response.body.message).toEqual('User is not exists');
    });
  });
});
