getReqData = (req) => {
  return new Promise((resolve, reject) => {
    try {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        resolve(body);
      });
    } catch (error) {
      reject(error);
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
    if (!person.name || !person.age || !person.hobbies) {
      reject({ error: `Name, age and hobbies are required!` });
    }
    // console.log(Array.isArray(person.hobbies));
    if ('string' !== typeof person.name) {
      reject({ error: `Name must be a string!` });
    }
    if ('number' !== typeof person.age) {
      reject({ error: `Age must be a number!` });
    }
    if (!Array.isArray(person.hobbies)) {
      reject({ error: `Hobbies must be an array!` });
    }
    // person['completed'] = true;
    resolve(person);
  });
};

module.exports = { getReqData, formatResponse, validateData };
