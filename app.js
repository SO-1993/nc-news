const express = require("express");
const app = express();

app.use(express.json());

// controller imports
const { getTopics } = require("./controllers/topics-controller");
const { getApiEndpoints } = require("./controllers/api-controller");
const {
  getArticles,
  getArticleById,
} = require("./controllers/articles-controller");
const {
  getCommentsByArticleId,
  postCommentsByArticleId,
} = require("./controllers/comments-controller");

// routing
app.get("/api/topics", getTopics);
app.get("/api", getApiEndpoints);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentsByArticleId);

// error-handling middleware

// catch-all for undefined routes (404)
app.use((req, res, next) => {
  res.status(404).send({ msg: "Route not found" });
});

// catches all 404s for defined routes that exist
app.use((err, req, res, next) => {
  if (err.statusCode === 404) {
    res.status(404).send({ msg: "Route not found" });
  } else next(err);
});

// handles errors with specific status codes (e.g., 400, 404)
app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

// PostgreSQL-specific error handling
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else next(err);
});

// generic error handler for internal server errors (500)
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
