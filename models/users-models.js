const db = require("../db/connection");

// fetchUsers() //
exports.fetchUsers = () => {
  return db
    .query(
      `SELECT
      username,
      name,
      avatar_url
      FROM users`
    )
    .then(({ rows }) => {
      return rows; // success response
    });
};
