const fs = require("fs").promises;
const path = require("path");

exports.getApiEndpoints = (req, res, next) => {
  const filePath = path.join(__dirname, "../endpoints.json");

  fs.readFile(filePath, "utf-8")
    .then((data) => {
      const endpoints = JSON.parse(data);
      res.status(200).json(endpoints);
    })
    .catch((err) => {
      if (err.code === "ENOENT") {
        return next(new Error("File not found"));
      } else {
        return next(err);
      }
    });
};
//
