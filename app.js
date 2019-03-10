const express = require("express");
const path = require("path");

const allowCORS = require("./middleware/allowCORS");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// routers
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const classroomsRouter = require("./routes/classrooms");
const discussionsRouter = require("./routes/discussions");
const announcementsRouter = require("./routes/announcements");
const questionsRouter = require("./routes/questions");
const eventsRouter = require("./routes/events");
const notesRouter =require("./routes/notes");

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
app.use("/api/announcements", announcementsRouter);
app.use("/api/questions", questionsRouter);
app.use("/api/events", eventsRouter);
app.use("/api/notes", notesRouter);

module.exports = app;
