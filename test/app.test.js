require('dotenv').config();
const http = require('http');
const process = require('process');
const myApp = require('../app.js');
const request = require('supertest')(`http://localhost:3000/person`);

const createData = { name: 'Vadzim', age: 34, hobbies: ['computers'] };
const updateData = {
  name: 'Vadzim',
  age: 34,
  hobbies: ['computers', 'programming'],
};
const badData = { name: 'Vadzim', age: 34, hobbies: 'programming' };

describe('Hacker scope - E2E API Tests', function () {
  describe('First scenario - Read All => Create => Read Create => Update Created => Delete Updated => Read Deleted', function () {
    let personId;

    it('should return empty array of persons', async () => {
      await request.get('/').expect(200, []);
    });

    it('should return created object of person with id', async () => {
      const res = await request.post('/').send(createData);
      expect(res.status).toEqual(201);
      expect(res.body).toEqual(
        expect.objectContaining({ id: expect.any(String), ...createData })
      );
      personId = res.body.id;
    });

    it('should return object of person created in prev test', async () => {
      const res = await request.get('/' + personId);
      expect(res.status).toEqual(200);
      expect(res.body).toEqual(
        expect.objectContaining({ id: personId, ...createData })
      );
    });

    it('should return updated object of person', async () => {
      const res = await request.put('/' + personId).send(updateData);
      expect(res.status).toEqual(200);
      expect(res.body).toEqual(
        expect.objectContaining({ id: personId, ...updateData })
      );
    });

    it('should delete object of person by id and return 204', async () => {
      const res = await request.delete('/' + personId);
      expect(res.status).toEqual(204);
      expect(res.body).toEqual('');
    });

    it('should return 404 and msg person is not found', async () => {
      const res = await request.get('/' + personId);
      expect(res.status).toEqual(404);
      expect(res.body).toEqual({
        error: `Person with id ${personId} not found!`,
      });
    });
  });

  describe('Second scenario - POST Bad JSON Data => Create Three New Persons => Read All (3 persons) => Delete Second => Read All (2 persons)', function () {
    let personIds = [];

    it('should return internal error msg', async () => {
      const res = await request.post('/').send(badData);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        error: `Hobbies must be an array of strings or empty array!`,
      });
    });

    it('should create three new persons', async () => {
      for (let i = 0; i < 3; i++) {
        const tmpCreateData = createData;
        tmpCreateData.hobbies.push(String(i + 1));
        const res = await request.post('/').send(tmpCreateData);
        expect(res.status).toEqual(201);
        expect(res.body).toEqual(
          expect.objectContaining({ id: expect.any(String), ...tmpCreateData })
        );
        personIds.push(res.body.id);
      }
    });

    it('should return array of three persons', async () => {
      const res = await request.get('/');
      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(3);
      // console.log(res.body);
    });

    it('should delete second person by id and return 204', async () => {
      const res = await request.delete('/' + personIds[1]);
      expect(res.status).toEqual(204);
      expect(res.body).toEqual('');
    });

    it('should return array of two persons', async () => {
      const res = await request.get('/');
      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(2);
      expect(res.body[1].hobbies).not.toEqual(['computers', '1', '2']);
    });
  });
});
