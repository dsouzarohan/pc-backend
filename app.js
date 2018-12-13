const express = require("express");
const path = require("path");

const allowCORS = require("./middleware/allowCORS");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const userIDAuth = require("./middleware/userIDAuth");

// routers
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const classroomsRouter = require("./routes/classrooms");
const discussionsRouter = require("./routes/discussions");

//express app
const app = express();

const { Sequelize, sequelize } = require("./models");

//custom middleware

app.use(allowCORS);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//REST API routes
app.use("/api/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/classrooms", classroomsRouter);
app.use("/api/discussions", discussionsRouter);

module.exports = app;
