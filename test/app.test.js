require('dotenv').config();
const http = require('http');
const myApp = require('../app.js');
const request = require('supertest')(`http://localhost:3000/person`);

const createData = { name: 'Vadzim', age: 34, hobbies: [] };
const updateData = { name: 'Vadzim', age: 34, hobbies: ['programming'] };

describe('Hacker scope - E2E API Tests', function () {
  describe('First scenario', function () {
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
      console.log(personId);
      console.log(res.body);
      expect(res.status).toEqual(204);
      expect(res.body).toEqual('');
    });

    it('should return 404 and msg person is not found', async () => {
      const res = await request.get('/' + personId);
      console.log(res.body);
      expect(res.status).toEqual(404);
      expect(res.body).toEqual({
        error: `Person with id ${personId} not found!`,
      });
    });
  });
});
