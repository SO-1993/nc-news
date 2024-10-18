const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");

beforeEach(() => seed(data));

afterAll(() => {
  return db.end();
});

// helper function //
const checkTopicProperties = (topic) => {
  expect(topic).toHaveProperty("slug", expect.any(String));
  expect(topic).toHaveProperty("description", expect.any(String));
};

test("should respond with a 200 status code and an array of topics with 'slug' and 'description'", () => {
  return request(app)
    .get("/api/topics")
    .expect(200)
    .then((response) => {
      const topicsArray = response.body.topics;

      // check that the response is an array
      expect(Array.isArray(topicsArray)).toBe(true);

      // check the length of the array based on the test data
      expect(topicsArray.length).toBe(data.topicData.length);

      // check that each topic object has 'slug' and 'description'
      topicsArray.forEach(checkTopicProperties);
    });
});

describe("GET /api/topics", () => {
  test("should respond with a 404 status for invalid routes", () => {
    return request(app)
      .get("/api/doesnotexist")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Route not found");
      });
  });
});
