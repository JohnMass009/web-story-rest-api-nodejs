const supertest = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');

const app = require('../../../../src/app');
const { UserFixture, insertUsers } = require('../../../fixtures/user-fixture');
const { DocumentFixture, insertDocuments } = require('../../../fixtures/document-fixture');
const { tokenService } = require('../../../../src/services');
const setTestDB = require('../../../configTestDB');

setTestDB();

describe('Documents route', () => {
  const request = supertest.agent(app.listen());
  describe('GET /v1/documents', () => {
    const endpoint = '/api/v1/documents';

    const User = new UserFixture();
    const Document = new DocumentFixture();

    let tokenJWT;

    beforeAll(async () => {
      await insertUsers([ User ]);
      await insertDocuments([ Document ]);

      const tokensUser = await tokenService.create(User._id);
      tokenJWT = await tokensUser.accessToken;
    });

    it('Should return success response with list of documents', async () => {
      const response = await request.post(endpoint)
        .send({ headers: { Authorization: `Bearer ${ tokenJWT }` } })
        .expect(httpStatus.OK);

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
  });
});