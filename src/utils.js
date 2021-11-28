const uuid = require('uuid');
const HttpCodes = {
  OK: 200,
  CREATED: 201,
  DELETED: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

getReqData = (req) => {
  return new Promise((resolve, reject) => {
    try {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        if ('' != body) {
          resolve(body);
        } else {
          reject({
            code: HttpCodes.BAD_REQUEST,
            msg: 'Request body is missing!',
          });
        }
      });
    } catch (error) {
      reject({ code: HttpCodes.INTERNAL_ERROR, msg: error.message });
    }
  });
};

formatResponse = (code, msg) => {
  new Promise((resolve, reject) => {
    try {
      resolve([code, JSON.stringify(msg)]);
    } catch (error) {
      reject(error);
    }
  });
};

validateData = (person) => {
  return new Promise((resolve, reject) => {
    delete person.id;
    if (!person.name || !person.age || !person.hobbies) {
      reject({
        code: HttpCodes.BAD_REQUEST,
        msg: `Name, age and hobbies are required!`,
      });
    }
    if ('string' !== typeof person.name) {
      reject({
        code: HttpCodes.BAD_REQUEST,
        msg: `Name must be a string!`,
      });
    }
    if ('number' !== typeof person.age) {
      reject({
        code: HttpCodes.BAD_REQUEST,
        msg: `Age must be a number!`,
      });
    }
    if (
      !Array.isArray(person.hobbies) ||
      !person.hobbies.every((i) => typeof i === 'string')
    ) {
      reject({
        code: HttpCodes.BAD_REQUEST,
        msg: `Hobbies must be an array of strings or empty array!`,
      });
    }
    resolve(person);
  });
};

validateId = (id) => {
  return new Promise((resolve, reject) => {
    if (!uuid.validate(id)) {
      reject({
        code: HttpCodes.BAD_REQUEST,
        msg: `Person's UUID is not correct!`,
      });
    }
    resolve(true);
  });
};

module.exports = { getReqData, formatResponse, validateData, validateId };
