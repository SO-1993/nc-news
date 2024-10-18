const db = require("../db/connection");

// fetchArticles() //
exports.fetchArticles = (sort_by = "created_at", order = "desc") => {
  const validSortColumns = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
  ];
  if (!validSortColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort column" });
  }
  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  const queryStr = `
    SELECT 
      articles.author, 
      articles.title, 
      articles.article_id, 
      articles.topic, 
      articles.created_at, 
      articles.votes, 
      articles.article_img_url, 
      COUNT(comments.comment_id) AS comment_count 
    FROM articles
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id 
    GROUP BY articles.article_id 
    ORDER BY ${sort_by} ${order}`;

  return db.query(queryStr).then(({ rows }) => rows);
};

// fetchArticleById()
exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT
        author,
        title,
        article_id,
        body,
        topic,
        created_at,
        votes,
        article_img_url
      FROM articles
      WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          msg: "Article not found",
          status: 404,
        });
      }
      return rows[0]; // success response
    });
};
exports.updateArticleById = (article_id, inc_votes) => {
  return db
    .query(
      `
      UPDATE articles
      SET votes = GREATEST(votes + $1, 0)
      WHERE article_id = $2
      RETURNING *;
    `,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0]; // return the updated article
    });
};
