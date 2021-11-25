const { parse } = require('path');
const uuid = require('uuid');
const url = require('url');

const allowedRoutes = ['person'];

const validateUrl = (req) => {
  const parsedApiPath = parseUrl(req.url);
  const ApiDepth = parsedApiPath.length;
  // console.log(ApiDepth);
  // console.log(uuid.validate(parsedApiPath[1]));
  if (2 < ApiDepth || 0 === ApiDepth) {
    return formatResponse(400, `Bad request!`);
  }
  if (!allowedRoutes.includes(parsedApiPath[0])) {
    return formatResponse(404, `API path not found!`);
  }
  if (2 === ApiDepth && !uuid.validate(parsedApiPath[1])) {
    return formatResponse(400, `Person's UUID is not correct!`);
  }
  return routeRequest(req, ApiDepth);
};

const parseUrl = (ReqUrl) => {
  const parsedUrl = url.parse(ReqUrl, true);
  return parsedUrl.pathname.split('/').filter((x) => x);
};

routeRequest = (req, ApiDepth) => {
  // switch (req.url) {
  //   case '/books':
  //     res.writeHead(200);
  //     res.end(books);
  //     break;
  //   case '/authors':
  //     res.writeHead(200);
  //     res.end(authors);
  //     break;
  //   default:
  //     res.writeHead(404);
  //     res.end(JSON.stringify({ error: 'Resource not found' }));
  // }
  switch (req.method) {
    case 'GET':
      break;

    case 'POST':
      if (1 < ApiDepth) {
        return formatResponse(400, `Bad request!`);
      }
      let body = '';
      let res;
      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', () => {
        try {
          console.log(JSON.parse(body));
          // const { name, age, hobbies } = JSON.parse(body);
          // const person = { name, age, hobbies };
          // validatePerson(person);
          // console.log(person);
          res = formatResponse(200, `ok!`);
        } catch (e) {
          // throw e;
          res = formatResponse(400, `Bad JSON data!`);
        }
      });
      // console.log(res);
      return res;
      // return formatResponse(200, `Bad request!`);
      // console.log(req);
      break;

    case 'PUT':
      break;

    case 'DELETE':
      break;

    default:
      return formatResponse(404, 'Method not found!');
      break;
  }
};

formatResponse = (code, msg) => {
  return [code, JSON.stringify({ msg: msg })];
};

module.exports = { validateUrl, parseUrl, formatResponse };
