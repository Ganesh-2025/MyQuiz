import {
  createQuiz,
  deleteQuiz,
  getAllQuizes,
  getMyQuizes,
  getQuizById,
  sendReport,
  startQuiz,
  submitQuiz,
  updateQuiz,
} from "@/controller/quizController.js";
import { authenticate } from "@/middleware/authentication.js";
import { Router } from "express";
import questionsRoutes from "./questionRoutes.js";
import validateSession from "@/middleware/validateSession.js";

const quizRoutes = Router({ mergeParams: true });
quizRoutes
  .get("/", getAllQuizes)
  .use(authenticate)
  .get("/my-quizzes", getMyQuizes)
  .get("/:id", getQuizById)
  .post("/", createQuiz)
  .put("/:id", updateQuiz)
  .delete("/:id", deleteQuiz)
  .post("/:quizID/start-quiz", startQuiz)
  .post("/submit", validateSession, submitQuiz)
  .get("/:submissionID/report", sendReport);

quizRoutes.use("/:quizID/questions", questionsRoutes);
export default quizRoutes;
