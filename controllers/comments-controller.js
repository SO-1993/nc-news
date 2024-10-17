const {
  fetchCommentsByArticleId,
  createCommentForArticle,
  deleteCommentFromTable,
} = require("../models/comments-models");
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

  fetchArticleById(article_id)
    .then(() => {
      return createCommentForArticle(article_id, username, body);
    })

    .then((newComment) => {
      res.status(201).send({ comment: newComment });
    })
    .catch((err) => {
      next(err);
    });
};

// deleteCommentByCommentId()
exports.deleteCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;

  deleteCommentFromTable(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
