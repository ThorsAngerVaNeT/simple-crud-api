const uuid = require('uuid');

let data = [];

class Controller {
  // getting all Persons
  async getPersons() {
    return new Promise((resolve, _) => resolve(data));
  }

  // getting a single person
  async getPerson(id) {
    return new Promise((resolve, reject) => {
      let person = data.find((person) => person.id === id);
      if (person) {
        resolve(person);
      } else {
        reject(`Person with id ${id} not found!`);
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
      resolve(newPerson);
    });
  }

  // updating person
  async updatePerson(id) {
    return new Promise((resolve, reject) => {
      let person = data.find((person) => person.id === id);
      if (!person) {
        reject(`No Person with id ${id} found`);
      }
      // person['completed'] = true;
      resolve(person);
    });
  }

  // deleting Person
  async deletePerson(id) {
    return new Promise((resolve, reject) => {
      let person = data.find((person) => person.id === id);
      if (!person) {
        reject(`No Person with id ${id} found`);
      }
      resolve(`Person deleted successfully`);
    });
  }
}
module.exports = Controller;
