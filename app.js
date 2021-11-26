require('dotenv').config();
const process = require('process');
const http = require('http');
const uuid = require('uuid');
// const router = require('./src/router.js');
const Person = require('./src/controller.js');
const { getReqData, validateData } = require('./src/utils.js');

const port = process.env.PORT || 3000;
const HttpCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

try {
  const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      if (req.url === '/person' && req.method === 'GET') {
        const Persons = await new Person().getPersons();
        res.writeHead(HttpCodes.OK);
        res.end(JSON.stringify(Persons));
      } else if (req.url.match(/\/person\/.+/i) && req.method === 'GET') {
        try {
          reqSplitedPath = req.url.split('/').filter((x) => x);
          if (2 < reqSplitedPath.length) {
            res.writeHead(HttpCodes.BAD_REQUEST);
            res.end(JSON.stringify({ message: `Bad request!` }));
          }
          const id = req.url.split('/')[2];
          if (!uuid.validate(id)) {
            res.writeHead(HttpCodes.BAD_REQUEST);
            res.end(
              JSON.stringify({ message: `Person's UUID is not correct!` })
            );
          }
          const person = await new Person().getPerson(id);
          res.writeHead(HttpCodes.OK);
          res.end(JSON.stringify(person));
        } catch (error) {
          res.writeHead(HttpCodes.NOT_FOUND);
          res.end(JSON.stringify({ message: error }));
        }
      } else if (req.url === '/person' && req.method === 'POST') {
        let personData = await getReqData(req);
        if ('' == personData) {
          res.writeHead(HttpCodes.BAD_REQUEST);
          res.end(JSON.stringify({ error: 'Request body is missing!' }));
        } else {
          try {
            const validatedData = await validateData(JSON.parse(personData));
            let person = await new Person().createPerson(validatedData);
            res.writeHead(HttpCodes.OK);
            res.end(JSON.stringify(person));
          } catch (validationErr) {
            res.writeHead(HttpCodes.BAD_REQUEST);
            res.end(JSON.stringify(validationErr));
          }
        }
      } else {
        res.writeHead(HttpCodes.NOT_FOUND);
        res.end(JSON.stringify({ error: 'API path not found.' }));
      }
    } catch (e) {
      res.writeHead(HttpCodes.INTERNAL_ERROR);
      res.end(JSON.stringify(`Internal server error - ${e}`));
    }
    // res.setHeader('Content-Type', 'application/json');
    // let response = {};
    // try {
    //   [response.code, response.msg] = router.validateUrl(req);
    // } catch (e) {
    //   [response.code, response.msg] = router.formatResponse(
    //     internalError,
    //     `Internal server error - ${e}`
    //   );
    // }
    // // console.log(response);
    // res.writeHead(response.code);
    // res.end(response.msg);
  });

  server.listen(port, () => {
    console.log(`Server running at port ${port}`);
  });
} catch (e) {
  process.stderr.write(`Error appears - ${e.message}`);
  process.exit(1);
}
