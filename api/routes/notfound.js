const express = require("express");
const route = express.Router();
// Agents
route.all("*", (req, res, next) => {
  res.status(404).send({
    message: "Route Not Found",
    response: ""
  });
});

module.exports = route;
