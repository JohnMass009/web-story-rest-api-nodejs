const supertest = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');

const app = require('../../../src/app');
const { UserFixture, insertUsers } = require('../../fixtures/user-fixture');
const setTestDB = require('../../configTestDB');

setTestDB();

describe('Register routes', () => {
  const request = supertest.agent(app.listen());

  describe('POST /api/v1/register', () => {
    const endpoint = '/api/v1/register';
    const userFixture = new UserFixture();
    let testUser;

    beforeEach(() => {
      testUser = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1'
      };
    });

    it('Should return success response with register user', async () => {
      const response = await request.post(endpoint)
        .send(testUser)
        .expect(httpStatus.CREATED);

      expect(response.body.user).toHaveProperty('_id');
      expect(response.body.user).toHaveProperty('name');
      expect(response.body.user).toHaveProperty('role');
      expect(response.body.user).not.toHaveProperty('password');
      expect(response.body.user).toEqual({
        _id: expect.anything(),
        name: testUser.name,
        email: testUser.email,
        role: 'reader'
      });

      const dbUser = await UserModel.findById(response.body.user._id);
      expect(dbUser).toBeDefined();
      expect(dbUser).toMatchObject({
        name: testUser.name,
        email: testUser.email,
        role: 'reader'
      });

      expect(response.body.tokens).toBeDefined();
      expect(response.body.tokens).toHaveProperty('accessToken');
      expect(response.body.tokens).toHaveProperty('refreshToken');
      expect(response.body.tokens).toEqual({
        accessToken: expect.anything(),
        refreshToken: expect.anything(),
      });
    });

    it('Should return error when email is not valid format', async () => {
      testUser.email = 'invalid';

      const response = await request.post(endpoint).send(testUser).expect(httpStatus.BAD_REQUEST);

      expect(response.text).toMatch(/valid email/);
    });

    it('Should return error when email is not send', async () => {
      delete testUser.email;

      const response = await request.post(endpoint)
        .send(testUser)
        .expect(httpStatus.BAD_REQUEST);

      expect(response.text).toMatch(/email/);
      expect(response.text).toMatch(/required/);
    });

    it('Should return 400 error if email is already used', async () => {
      await insertUsers([ userFixture ]);
      testUser.email = userFixture.email;

      const response = await request.post(endpoint)
        .send(testUser)
        .expect(httpStatus.BAD_REQUEST);

      expect(response.text).toMatch(/already used/);
    });

    it('Should return error when password length is less than 6 characters', async () => {
      testUser.password = 'pass';

      const response = await request.post(endpoint)
        .send(testUser)
        .expect(httpStatus.BAD_REQUEST);

      expect(response.text).toMatch(/password length/);
      expect(response.text).toMatch(/6 char/);
    });

    it('Should return error when password is not send', async () => {
      delete testUser.password;

      const response = await request.post(endpoint)
        .send(testUser)
        .expect(httpStatus.BAD_REQUEST);

      expect(response.text).toMatch(/password/);
      expect(response.text).toMatch(/required/);
    });
  });
});

describe('Login route', () => {
  const request = supertest.agent(app.listen());
  describe('POST /v1/auth/login', () => {
    const endpoint = '/api/v1/login';

    const user = new UserFixture();

    it('Should return success response with login user if email and password match', async () => {

      await insertUsers([ user ]);

      const loginData = {
        email: user.email,
        password: user.password,
      };

      const response = await request.post(endpoint).send(loginData).expect(httpStatus.OK);

      expect(response.body.user).toEqual({
        _id: expect.anything(),
        name: user.name,
        email: user.email,
        role: user.role,
      });

      expect(response.body.tokens).toEqual({
        accessToken: expect.anything(),
        refreshToken: expect.anything(),
      });
    });

    it('Should return error if there are no users with that email', async () => {
      const loginData = {
        email: faker.internet.email().toLowerCase(),
        password: user.password,
      };

      const response = await request.post(endpoint).send(loginData).expect(httpStatus.UNAUTHORIZED);

      expect(response.body).toMatchObject({
        statusCode: httpStatus.UNAUTHORIZED,
        message: 'Incorrect email or password'
      });
    });

    it('Should return error if password is not send', async () => {
      const loginData = {
        email: user.email,
      };

      const response = await request.post(endpoint).send(loginData).expect(httpStatus.BAD_REQUEST);

      expect(response.body).toMatchObject({ statusCode: httpStatus.BAD_REQUEST, message: 'password is required' });
    });

    it('Should return error if password is wrong', async () => {
      const loginData = {
        email: user.email,
        password: 'wrongPassword',
      };

      const response = await request.post(endpoint).send(loginData).expect(httpStatus.UNAUTHORIZED);

      expect(response.body).toMatchObject({
        statusCode: httpStatus.UNAUTHORIZED,
        message: 'Incorrect email or password'
      });
    });
  });
});