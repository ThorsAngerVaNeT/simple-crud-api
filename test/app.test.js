require('dotenv').config();
const http = require('http');
const startServer = require('../src/server.js');
const supertest = require('supertest');

const createData = { name: 'Vadzim', age: 34, hobbies: ['computers'] };
const updateData = {
  name: 'Vadzim',
  age: 34,
  hobbies: ['computers', 'programming'],
};
const badData = { name: 'Vadzim', age: 34, hobbies: 'programming' };

// beforeAll(function () {
server = startServer();
request = supertest(server);
// });

// afterAll(function (done) {
//   httpServ.close(done);
// });

// afterAll((done) => {
//   server.close(done);
// });

afterAll(() => {
  server.close();
});

describe('Hacker scope - E2E API Tests', function () {
  describe('First scenario - Read All => Create => Read Create => Update Created => Delete Updated => Read Deleted', function () {
    let personId;

    it('should return empty array of persons', async () => {
      await request.get('/person').expect(200, []);
    });

    it('should return created object of person with id', async () => {
      const res = await request.post('/person').send(createData);
      console.log(res.body);
      expect(res.status).toEqual(201);
      expect(res.body).toEqual(
        expect.objectContaining({ id: expect.any(String), ...createData })
      );
      personId = res.body.id;
    });

    it('should return object of person created in prev test', async () => {
      const res = await request.get('/person/' + personId);
      expect(res.status).toEqual(200);
      expect(res.body).toEqual(
        expect.objectContaining({ id: personId, ...createData })
      );
    });

    it('should return updated object of person', async () => {
      const res = await request.put('/person/' + personId).send(updateData);
      expect(res.status).toEqual(200);
      expect(res.body).toEqual(
        expect.objectContaining({ id: personId, ...updateData })
      );
    });

    it('should delete object of person by id and return 204', async () => {
      const res = await request.delete('/person/' + personId);
      expect(res.status).toEqual(204);
      expect(res.body).toEqual('');
    });

    it('should return 404 and msg person is not found', async () => {
      const res = await request.get('/person/' + personId);
      expect(res.status).toEqual(404);
      expect(res.body).toEqual({
        error: `Person with id ${personId} not found!`,
      });
    });
  });

  describe('Second scenario - POST Bad JSON Data => Create Three New Persons => Read All (3 persons) => Delete Second => Read All (2 persons)', function () {
    let personIds = [];

    it('should return internal error msg', async () => {
      const res = await request.post('/person').send(badData);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        error: `Hobbies must be an array of strings or empty array!`,
      });
    });

    it('should create three new persons', async () => {
      for (let i = 0; i < 3; i++) {
        const tmpCreateData = createData;
        tmpCreateData.hobbies.push(String(i + 1));
        const res = await request.post('/person').send(tmpCreateData);
        expect(res.status).toEqual(201);
        expect(res.body).toEqual(
          expect.objectContaining({ id: expect.any(String), ...tmpCreateData })
        );
        personIds.push(res.body.id);
      }
    });

    it('should return array of three persons', async () => {
      const res = await request.get('/person');
      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(3);
      // console.log(res.body);
    });

    it('should delete second person by id and return 204', async () => {
      const res = await request.delete('/person/' + personIds[1]);
      personIds.splice(1, 1);
      expect(res.status).toEqual(204);
      expect(res.body).toEqual('');
    });

    it('should return array of two persons', async () => {
      const res = await request.get('/person');
      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(2);
      expect(res.body[1].hobbies).not.toEqual(['computers', '1', '2']);
    });

    it('should delete two last persons', async () => {
      for (let i = 0; i < personIds.length; i++) {
        const res = await request.delete('/person/' + personIds[i]);
        expect(res.status).toEqual(204);
        expect(res.body).toEqual('');
      }
    });
  });

  describe('Third scenario - Create New Persons => Update with empty body => Duplicate person => Read All (2 persons)', function () {
    let duplicateData;

    it('should create new persons', async () => {
      const res = await request.post('/person').send(createData);
      expect(res.status).toEqual(201);
      expect(res.body).toEqual(
        expect.objectContaining({ id: expect.any(String), ...createData })
      );
      duplicateData = res.body;
      console.log(duplicateData);
    });

    it('should return error msg', async () => {
      const res = await request.put('/person/' + duplicateData.id).send('');
      console.log(res.body);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({ error: `Request body is missing!` });
    });

    it('should duplicate person with another id', async () => {
      const res = await request.post('/person').send(duplicateData);
      expect(res.status).toEqual(201);
      expect(res.body.id).not.toEqual(duplicateData.id);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: duplicateData.name,
          age: duplicateData.age,
          hobbies: duplicateData.hobbies,
        })
      );
    });

    it('should return array of two same persons with different ids', async () => {
      const res = await request.get('/person');
      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(2);
      expect(res.body[0].id).not.toEqual(res.body[1].id);
      expect(res.body[0]).toEqual(
        expect.objectContaining({
          name: res.body[1].name,
          age: res.body[1].age,
          hobbies: res.body[1].hobbies,
        })
      );
    });
  });
});
