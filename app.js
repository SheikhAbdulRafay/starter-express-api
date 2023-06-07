var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cron = require('node-cron');
var cookieParser = require("cookie-parser");
var mainRouter = require("./routes/router.js");
const { incrementParent } = require("./utils/incrementProfit/index.js");
const { perdayProfit } = require("./utils/incrementProfit/incrementPerDay.js");
const { ApplyOnAll } = require("./utils/incrementProfit/allMembers.js");


var app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/images", express.static("uploads"));
app.use("/", express.static("build"));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(function (req, res, next) {
  console.log(req.body)
  res.header("Access-Control-Allow-Origin", "*");
  // res.header(
  //   "Access-Control-Allow-Headers",
  //   // "Origin, X-Requested-With, Content-Type, Accept"
  //   "*"
  // );
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"))
})
// cron.schedule('* * * * *', () => {
cron.schedule('0 0 * * *', () => {
  // incrementParent()
  console.log('Running every minute');
  // perdayProfit('1')
  //   .then((customerData) => {
  //     console.log(customerData, "customerData"); // Handle the returned data here
  //   })
  //   .catch((error) => {
  //     console.error(error); // Handle any errors that occurred
  //   });

  ApplyOnAll()
    .then((customerData) => {
      // console.log(customerData, "Apply on all members"); // Handle the returned data here
      console.log("Apply on all members"); // Handle the returned data here
    })
    .catch((error) => {
      console.error(error, "Apply on all members Failed"); // Handle any errors that occurred
    });
  // Call your function here
  // myFunction();
});
app.use(function (req, res, next) {
  console.info("----------------- " + req.method + "->" + req.url)
  next();
});
app.use(mainRouter);
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // console.log(req, "middelware")
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  logger.error(
    ` we found an issue on ${req.originalUrl
    } with follow json body ${JSON.stringify(req.body)} from ip ${req.ip
    } and error was ${JSON.stringify(err)}`
  );
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
