const express = require("express");
const router = express.Router();
//document start with user
const main = require("../api/routes/routes");

router.use(main); //doc auto generated

module.exports = router;
