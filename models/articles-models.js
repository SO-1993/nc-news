const db = require("../db/connection");

// fetchArticles()
exports.fetchArticles = (sort_by = "created_at", order = "desc", topic) => {
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

  let queryStr = `
    SELECT 
      articles.author, 
      articles.title, 
      articles.article_id, 
      articles.topic, 
      articles.created_at, 
      articles.votes, 
      articles.article_img_url, 
      COALESCE(COUNT(comments.comment_id), 0) AS comment_count 
    FROM articles
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id`;

  const queryValues = [];

  if (topic) {
    return db
      .query("SELECT * FROM topics WHERE slug = $1", [topic]) // Validate topic exists
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Topic not found" });
        }

        queryStr += ` WHERE articles.topic = $1`;
        queryValues.push(topic);

        queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;
        return db.query(queryStr, queryValues).then(({ rows }) => rows);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  } else {
    queryStr += `
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}`;

    return db.query(queryStr, queryValues).then(({ rows }) => rows);
  }
};

// fetchArticleById()
exports.fetchArticleById = (article_id) => {
  const queryStr = `
    SELECT 
      articles.author, 
      articles.title, 
      articles.article_id, 
      articles.topic,
      articles.body, 
      articles.created_at, 
      articles.votes, 
      articles.article_img_url, 
      COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`;

  return db.query(queryStr, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    }
    return rows[0];
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
      return rows[0];
    });
};
