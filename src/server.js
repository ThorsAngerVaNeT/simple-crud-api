const http = require('http');
const Person = require('./controller.js');
const { getReqData, validateData, validateId } = require('./utils.js');

const HttpCodes = {
  OK: 200,
  CREATED: 201,
  DELETED: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

const startServer = () => {
  const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const reqSplitedPath = req.url.split('/').filter((x) => x);
      let personRawData;
      if (2 >= reqSplitedPath.length && 'person' === reqSplitedPath[0]) {
        switch (req.method) {
          case 'GET':
            try {
              if (1 === reqSplitedPath.length) {
                const Persons = await new Person().getPersons();
                res.writeHead(Persons.code);
                res.end(JSON.stringify(Persons.msg));
              } else {
                const id = req.url.split('/')[2];
                await validateId(id);
                const person = await new Person().getPerson(id);
                res.writeHead(person.code);
                res.end(JSON.stringify(person.msg));
              }
            } catch (getError) {
              if (getError.code) {
                res.writeHead(getError.code);
                res.end(JSON.stringify({ error: getError.msg }));
              } else {
                throw getError;
              }
            }
            break;

          case 'POST':
            try {
              personRawData = await getReqData(req);
              const validatedData = await validateData(
                JSON.parse(personRawData)
              );
              let person = await new Person().createPerson(validatedData);
              res.writeHead(person.code);
              res.end(JSON.stringify(person.msg));
            } catch (insertErr) {
              if (insertErr.code) {
                res.writeHead(insertErr.code);
                res.end(JSON.stringify({ error: insertErr.msg }));
              } else {
                throw insertErr;
              }
            }
            break;

          case 'PUT':
            try {
              personRawData = await getReqData(req);
              const id = req.url.split('/')[2];
              await validateId(id);
              const validatedData = await validateData(
                JSON.parse(personRawData)
              );
              let person = await new Person().updatePerson(id, validatedData);
              res.writeHead(person.code);
              res.end(JSON.stringify(person.msg));
            } catch (updateErr) {
              if (updateErr.code) {
                res.writeHead(updateErr.code);
                res.end(JSON.stringify({ error: updateErr.msg }));
              } else {
                throw updateErr;
              }
            }
            break;

          case 'DELETE':
            try {
              const id = req.url.split('/')[2];
              await validateId(id);
              let person = await new Person().deletePerson(id);
              res.writeHead(person.code);
              res.end();
            } catch (deleteErr) {
              if (deleteErr.code) {
                res.writeHead(deleteErr.code);
                res.end(JSON.stringify({ error: deleteErr.msg }));
              } else {
                throw deleteErr;
              }
            }
            break;

          default:
            res.writeHead(HttpCodes.BAD_REQUEST);
            res.end(JSON.stringify({ error: `Wrong methond!` }));
            break;
        }
      } else {
        res.writeHead(HttpCodes.NOT_FOUND);
        res.end(JSON.stringify({ error: `API path not found!` }));
      }
    } catch (e) {
      res.writeHead(HttpCodes.INTERNAL_ERROR);
      res.end(JSON.stringify({ error: `Internal server error - ${e}` }));
    }
  });
  return server;
};

module.exports = startServer;
