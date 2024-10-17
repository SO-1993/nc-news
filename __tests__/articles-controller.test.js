const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");

beforeEach(() => seed(data));

afterAll(() => {
  return db.end();
});

/////////////////////// GET /api/articles TESTS  ///////////////////////

describe("GET /api/articles", () => {
  test("should respond with a 200 status code, have the specified properties, and return the correct number of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBe(true);

        expect(response.body[0]).toHaveProperty("author");
        expect(response.body[0]).toHaveProperty("title");
        expect(response.body[0]).toHaveProperty("article_id");
        expect(response.body[0]).toHaveProperty("topic");
        expect(response.body[0]).toHaveProperty("created_at");
        expect(response.body[0]).toHaveProperty("votes");
        expect(response.body[0]).toHaveProperty("article_img_url");
        expect(response.body[0]).toHaveProperty("comment_count");

        expect(response.body.length).toBe(13);
      });
  });
});

/////////////////////// GET /api/articles/:article_id TESTS  ///////////////////////

describe("GET /api/articles/:article_id", () => {
  test("should respond with a 200 status code and with the correct article_id", () => {
    const validArticleId = 1;

    return request(app)
      .get(`/api/articles/${validArticleId}`)
      .expect(200)
      .then((response) => {
        expect(response.body.article.article_id).toBe(validArticleId);
      });
  });

  test("should respond with a 200 status code when an article exists and has all required properties", () => {
    const validArticleId = 2;
    return request(app)
      .get(`/api/articles/${validArticleId}`)
      .expect(200)
      .then((response) => {
        expect(response.body.article).toHaveProperty(
          "article_id",
          validArticleId
        );
        expect(response.body.article).toHaveProperty(
          "author",
          expect.any(String)
        );
        expect(response.body.article).toHaveProperty(
          "title",
          expect.any(String)
        );
        expect(response.body.article).toHaveProperty(
          "body",
          expect.any(String)
        );
        expect(response.body.article).toHaveProperty(
          "created_at",
          expect.any(String)
        );
        expect(response.body.article).toHaveProperty(
          "votes",
          expect.any(Number)
        );
      });
  });

  test("should respond with a 400 status for invalid article ids", () => {
    return request(app)
      .get("/api/articles/one-hundred")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid input");
      });
  });

  test("should respond with a 404 status when the article ID does not exist", () => {
    const invalidArticleId = 111;
    return request(app)
      .get(`/api/articles/${invalidArticleId}`)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });

  test("should respond with a 404 status for invalid routes", () => {
    return request(app)
      .get("/api/doesnotexist")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Route not found");
      });
  });
});

/////////////////////// PATCH /api/articles/:article_id TESTS  ///////////////////////

describe("PATCH /api/articles/:article_id", () => {
  test("should respond with a 200 status status code and the updated article when inc_votes is valid", () => {
    const validArticleId = 1;
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch(`/api/articles/${validArticleId}`)
      .send(newVote)
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article).toHaveProperty("votes");
        expect(article.votes).toBeGreaterThan(0);
      });
  });

  test("should respond with a 200 status code and increment the article's votes", () => {
    const validArticleId = 1;
    const incVote = { inc_votes: 5 };

    return request(app)
      .patch(`/api/articles/${validArticleId}`)
      .send(incVote)
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article).toHaveProperty("votes");
        expect(article.votes).toBe(105);
      });
  });

  test("should respond with a 200 status code and decrement the article's votes", () => {
    const validArticleId = 1;
    const incVote = { inc_votes: -10 };

    return request(app)
      .patch(`/api/articles/${validArticleId}`)
      .send(incVote)
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article).toHaveProperty("votes");
        expect(article.votes).toBe(90);
      });
  });

  test("should not go below zero, regardless of number of negative votes", () => {
    const validArticleId = 2;
    const incVote = { inc_votes: -100 };

    return request(app)
      .patch(`/api/articles/${validArticleId}`)
      .send(incVote)
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article).toHaveProperty("votes");
        expect(article.votes).toBe(0);
      });
  });

  test("should respond with a 400 status code when inc_votes is not a number", () => {
    const validArticleId = 1;
    const invalidIncVote = { inc_votes: "invalid" };

    return request(app)
      .patch(`/api/articles/${validArticleId}`)
      .send(invalidIncVote)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid input");
      });
  });
});
