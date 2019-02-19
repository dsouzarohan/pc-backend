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

router.post("/questionAnswer/new", userAuth(), (req, res) => {
  const { answerBody, questionId } = req.body;
  const answererId = req.userData.userID;

  questionsController
    .createQuestionAnswer(answerBody, questionId, answererId)
    .then(result => res.json(result))
    .catch(error => res.status(422).send(error));
});

router.post("/answerComment/new", userAuth(), (req, res) => {
  const { comment, questionAnswerId } = req.body;
  const commenterId = req.userData.userID;

  questionsController
    .createAnswerComment(comment, questionAnswerId, commenterId)
    .then(result => res.json(result))
    .catch(error => res.status(422).send(error));
});

router.post("/questionVote", userAuth(), (req, res) => {
  const { questionId, voteType } = req.body;
  const voterId = req.userData.userID;

  questionsController
    .addQuestionVote(questionId, voterId, voteType)
    .then(result => res.json(result))
    .catch(error => res.status(422).send(error));
});

router.post("/questionCommentVote", userAuth(), (req, res) => {
  const { questionCommentId, voteType } = req.body;
  const voterId = req.userData.userID;

  questionsController
    .addQuestionCommentVote(questionCommentId, voterId, voteType)
    .then(result => res.json(result))
    .catch(error => res.status(422).send(error));
});

router.post("/answerVote", userAuth(), (req, res) => {
  const { questionAnswerId, voteType } = req.body;
  const voterId = req.userData.userID;

  questionsController
    .addQuestionAnswerVote(questionAnswerId, voterId, voteType)
    .then(result => res.json(result))
    .catch(error => res.status(422).send(error));
});

router.post("/answerCommentVote", userAuth(), (req, res) => {
  const { answerCommentId, voteType } = req.body;
  const voterId = req.userData.userID;

  questionsController
    .addAnswerCommentVote(answerCommentId, voterId, voteType)
    .then(result => res.json(result))
    .catch(error => res.status(422).send(error));
});

router.post("/selectAnswer", userAuth(), (req, res) => {
  const { questionId, answerId } = req.body;
  const userID = req.userData.userID;

  questionsController
    .selectAnswer(questionId, answerId)
    .then(result => res.json(result))
    .catch(error => res.status(422).send(error));
});

module.exports = router;
