var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var allowCORS = require("./middleware/allowCORS");

// routes
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

//express app
var app = express();

//middleware
app.use(allowCORS);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//REST API routes
app.use("/api/", indexRouter);
app.use("/api/users", usersRouter);

module.exports = app;
