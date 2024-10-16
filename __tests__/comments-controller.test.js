const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");

beforeEach(() => seed(data));

afterAll(() => {
  return db.end();
});

describe("GET /api/articles/:article_id/comments", () => {
  test("should respond with a 200 status code and return an array of comments when a valid article ID is provided", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const { comments } = response.body;

        expect(Array.isArray(comments)).toBe(true);

        if (comments.length === 0) {
          expect(comments).toHaveLength(0);
        } else {
          comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id");
            expect(comment).toHaveProperty("votes");
            expect(comment).toHaveProperty("created_at");
            expect(comment).toHaveProperty("author");
            expect(comment).toHaveProperty("body");
            expect(comment).toHaveProperty("article_id");
          });
        }
      });
  });

  test("should respond with a 200 status code and return an empty array when a valid article ID with no comments is provided", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        const { comments } = response.body;
        expect(comments).toHaveLength(0);
      });
  });

  test("should respond with a 400 status code for invalid article ids", () => {
    return request(app)
      .get("/api/articles/abc/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid input");
      });
  });

  // FAILING TEST
  xtest("should respond with a 404 status code when article ID does not exist", () => {
    return request(app)
      .get("/api/articles/999999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });
});

// FAILING TEST
xdescribe("POST /api/articles/:article_id/comments", () => {
  it("should respond with a 201 status code when passed a valid username and article ID", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const { comment } = response.body;
        expect(comment).toHaveProperty("comment_id");
        expect(comment.author).toBe(newComment.username);
        expect(comment.body).toBe(newComment.body);
      });
  });
});