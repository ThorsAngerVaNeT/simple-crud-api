require('dotenv').config();
const http = require('http');
var myApp = require('../app.js');
var request = require('supertest')(`http://localhost:3000/person`);

const createData = { name: 'Vadzim', age: 34, hobbies: [] };
const updateData = { name: 'Vadzim', age: 34, hobbies: ['programming'] };

describe('Hacker scope - E2E API Tests', function () {
  describe('First scenario', function () {
    let personId;
    it('should return empty array of persons', function (done) {
      request.get('/').expect(200, [], done);
    });

    it('should return created object of person with id', function (done) {
      request
        .post('/')
        .send(createData)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).toEqual(
            expect.objectContaining({ id: expect.any(String), ...createData })
          );
          personId = res.body.id;
          done();
        });
    });

    it('should return object of person created in prev test', function (done) {
      request
        .get('/' + personId)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).toEqual(
            expect.objectContaining({ id: personId, ...createData })
          );
          done();
        });
    });

    it('should return updated object of person', function (done) {
      request
        .put('/' + personId)
        .send(updateData)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).toEqual(
            expect.objectContaining({ id: personId, ...updateData })
          );
          done();
        });
    });

    it('should delete object of person by id and return 204', function (done) {
      request
        .delete('/' + personId)
        .expect(204)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).toEqual('');
          done();
        });
    });

    it('should return 404 and msg person is not found', function (done) {
      request
        .get('/' + personId)
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          console.log(res.body);
          expect(res.body).toEqual(
            expect.objectContaining({ id: personId, ...createData })
          );
          done();
        });
    });
  });
});
