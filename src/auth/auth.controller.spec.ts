import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  describe('signIn', () => {
    it('should return a JWT token if credentials are correct', async () => {
      const userCredentials = { email: 'john@example.com', password: 'password123' };
      const token = 'mocked_jwt_token';

      jest.spyOn(authService, 'signIn').mockImplementation(() => Promise.resolve(token));

      expect(await authController.userSignIn(userCredentials)).toBe(token);
    });
  });

  describe('signUp', () => {
    it('should create a new user and return a JWT token', async () => {
      const newUser = { name: 'John', email: 'john@example.com', password: 'password123' };
      const token = 'mocked_jwt_token';

      jest.spyOn(authService, 'signUp').mockImplementation(() => Promise.resolve(token));

      expect(await authController.signUp(newUser)).toBe(token);
    });
  });
});

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('signIn', () => {
    it('should return a JWT token if credentials are correct', async () => {
      const email = 'john@example.com';
      const password = 'password123';
      const token = 'mocked_jwt_token';

      jest.spyOn(authService, 'validateUser').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(authService, 'createJwtToken').mockImplementation(() => token);

      expect(await authService.signIn(email, password)).toBe(token);
    });

    it('should throw an error if credentials are incorrect', async () => {
      const email = 'john@example.com';
      const password = 'password123';

      jest.spyOn(authService, 'validateUser').mockImplementation(() => Promise.resolve(false));

      await expect(authService.signIn(email, password)).rejects.toThrowError('Invalid email or password');
    });
  });

  describe('signUp', () => {
    it('should create a new user and return a JWT token', async () => {
      const name = 'John';
      const email = 'john@example.com';
      const password = 'password123';
      const token = 'mocked_jwt_token';

      jest.spyOn(authService, 'createUser').mockImplementation(() => Promise.resolve({ id: 1, name, email, password }));
      jest.spyOn(authService, 'createJwtToken').mockImplementation(() => token);

      expect(await authService.signUp(name, email, password)).toBe(token);
    });
  });
});
