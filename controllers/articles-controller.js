const {
  fetchArticles,
  fetchArticleById,
} = require("../models/articles-models");

// getArticles()
exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
};

// getArticlesByID()
exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

// // getArticlesByID()
// exports.getArticleById = (req, res, next) => {
//   const { article_id } = req.params;

//   fetchArticleById(article_id)
//     .then((article) => {
//       if (!article) {
//         // Explicitly create an error for article not found
//         const err = new Error("Article not found");
//         err.status = 404;
//         err.msg = "Article not found"; // Set message for error handler
//         next(err); // Pass to the next error handler
//       } else {
//         res.status(200).send({ article });
//       }
//     })
//     .catch(next); // Pass any other errors to the error handler
// };
