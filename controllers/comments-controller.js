const { fetchCommentsByArticleId } = require("../models/comments-models");
const { createCommentForArticle } = require("../models/comments-models");
const { fetchArticleById } = require("../models/articles-models");

// getCommentsByArticleId()
exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then(() => {
      return fetchCommentsByArticleId(article_id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

// postCommentsByArticleId()
exports.postCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (!username || !body) {
    return res
      .status(400)
      .send({ msg: "Bad request: Missing required fields" });
  }

  createCommentForArticle(article_id, username, body)
    .then((newComment) => {
      res.status(201).send({ comment: newComment });
    })
    .catch((err) => {
      next(err);
    });
};
