const router = require("express").Router();
const questionsController = require("../controllers/questions");
const userAuth = require("../middleware/userIDAuth");

router.get("/", userAuth(), (req, res) => {
  const classroomId = req.query.classroomId;

  questionsController
    .getQuestions(classroomId)
    .then(result => res.json(result))
    .catch(error => res.status(422).send(error));
});

router.post("/new", userAuth(), (req, res) => {
  const { questionName, questionBody, classroomId } = req.body;
  const authorId = req.userData.userID;

  questionsController
    .createQuestion(questionName, questionBody, classroomId, authorId)
    .then(result => res.json(result))
    .catch(error => res.status(422).send(error));
});

router.post("/questionComment/new", userAuth(), (req, res) => {
  const { questionComment, questionId } = req.body;
  const questionCommenterId = req.userData.userID;

  questionsController
    .createQuestionComment(questionComment, questionId, questionCommenterId)
    .then(result => res.json(result))
    .catch(error => res.status(422).send(error));
});

module.exports = router;
