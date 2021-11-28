# Node.JS-RS-School-2021Q4 Task 3 - Simple CRUD API

This is simple CRUD API, which is using in-memory database underneath. 

API path is `/person`:
  * **GET** `/person` or `/person/${personId}` returns all persons or person with corresponding `personId`
  * **POST** `/person` is used to create record about new person and store it in database
  * **PUT** `/person/${personId}` is used to update record about existing person
  * **DELETE** `/person/${personId}` is used to delete record about existing person from database.

---

## How to install

To run this API server, you must do the following steps:

1. Clone this repository and switch branch to task3-simple-crud-api.
2. Run the command line and go to the created folder.
3. Install dependepncies by entering the command "npm install" or "npm i" and wait command to complete.
4. Run command "npm run start:dev" to run API server in development mode or "npm run start:prod" to build and run in production mode.

---

## How to use

Send your requests to url http://localhost:3000/person (you can use Postman).

Body of POST and PUT object must have JSON body with:
  * `name` — person's name (`string`, **required**)
  * `age` — person's age (`number`, **required**)
  * `hobbies` — person's hobbies (`array` of `strings` or empty `array`, **required**)
