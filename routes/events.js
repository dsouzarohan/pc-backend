const router = require("express").Router();
const eventsControllers = require("../controllers/events");
const userAuth = require("../middleware/userIDAuth");

router.get("/", userAuth(), (req, res) => {
  const classroomId = req.query.classroomId;
  eventsControllers
    .getEvents(classroomId)
    .then(result => res.json(result))
    .catch(error => res.status(422).send(error));
});

router.post(
  "/new",
  userAuth({ authorizationOnlyTo: "Teacher" }),
  (req, res) => {
    const { eventDetails, classroomId } = req.body;
    const userId = req.userData.userID;
    eventsControllers
      .createEvent(eventDetails, userId, classroomId)
      .then(result => res.json(result))
      .catch(error => res.send(422).send(error));
  }
);

router.put(
  "/:eventId",
  userAuth({
    authorizationOnlyTo: "Teacher"
  }),
  (req, res) => {
    const { eventDetails } = req.body;
    const eventId = req.params.eventId;
    eventsControllers
      .updateEvent(eventId, eventDetails)
      .then(result => res.json(result))
      .catch(error => res.status(422).send(error));
  }
);

router.delete(
  "/:eventId",
  userAuth({
    authorizationOnlyTo: "Teacher"
  }),
  (req, res) => {
    const eventId = req.params.eventId;
    eventsControllers
      .deleteEvent(eventId)
      .then(result => res.json(result))
      .catch(error => res.status(422).send(error));
  }
);

module.exports = router;
