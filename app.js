const express = require("express");
const app = express();

// controller imports here
const { getTopics } = require("./controllers/topics-controller");
const { getApiEndpoints } = require("./controllers/api-controller");

// routing
app.get("/api/topics", getTopics);
app.get("/api", getApiEndpoints);

// error-handling middleware
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

// catch-all route handler for invalid routes
app.use((req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

module.exports = app;