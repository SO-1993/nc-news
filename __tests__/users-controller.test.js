const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");

beforeEach(() => seed(data));

afterAll(() => {
  return db.end();
});

// helper function
const checkUserProperties = (user) => {
  expect(user).toHaveProperty("username", expect.any(String));
  expect(user).toHaveProperty("name", expect.any(String));
  expect(user).toHaveProperty("avatar_url", expect.any(String));
};

/////////////////////// GET /api/users TESTS  ///////////////////////

describe.only("GET /api/users", () => {
  test("should respond with a 200 status code and return an array of objects, including the 'username', 'name' and 'avatar_url' properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const usersArray = response.body.users;

        // check that the response is an array
        expect(Array.isArray(usersArray)).toBe(true);

        // check the length of the array based on the test data
        expect(usersArray.length).toBe(data.userData.length);

        // check that each topic object has 'username', 'name' and 'avatar_url'
        usersArray.forEach(checkUserProperties);
      });
  });

  describe("GET /api/users", () => {
    test("should respond with a 404 status for ...", () => {
      return request(app)
        .get("/api/doesnotexist")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Route not found");
        });
    });
  });
});
