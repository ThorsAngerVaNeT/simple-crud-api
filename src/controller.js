const uuid = require('uuid');
const HttpCodes = {
  OK: 200,
  CREATED: 201,
  DELETED: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

let data = [];

class Controller {
  // getting all Persons
  async getPersons() {
    return new Promise((resolve, _) =>
      resolve({
        code: HttpCodes.OK,
        msg: data,
      })
    );
  }

  // getting a single person
  async getPerson(id) {
    return new Promise((resolve, reject) => {
      let person = data.find((person) => person.id === id);
      if (person) {
        resolve({
          code: HttpCodes.OK,
          msg: person,
        });
      } else {
        reject({
          code: HttpCodes.NOT_FOUND,
          msg: `Person with id ${id} not found!`,
        });
      }
    });
  }

  // creating a person
  async createPerson(person) {
    return new Promise((resolve, _) => {
      let newPerson = {
        id: uuid.v4(),
        ...person,
      };
      data.push(newPerson);
      resolve({
        code: HttpCodes.CREATED,
        msg: newPerson,
      });
    });
  }

  // updating person
  async updatePerson(id, updateData) {
    return new Promise((resolve, reject) => {
      const personIndex = data.findIndex((person) => person.id === id);
      if (0 > personIndex) {
        reject({
          code: HttpCodes.NOT_FOUND,
          msg: `No Person with id ${id} found!`,
        });
      }
      data[personIndex] = { id: id, ...updateData };
      resolve({
        code: HttpCodes.OK,
        msg: data[personIndex],
      });
    });
  }

  // deleting Person
  async deletePerson(id) {
    return new Promise((resolve, reject) => {
      let person = data.find((person) => person.id === id);
      if (!person) {
        reject({
          code: HttpCodes.NOT_FOUND,
          msg: `No Person with id ${id} found!`,
        });
      }
      resolve({
        code: HttpCodes.DELETED,
      });
    });
  }
}
module.exports = Controller;
