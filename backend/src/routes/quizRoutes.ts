import {
  createQuiz,
  deleteQuiz,
  getAllQuizes,
  getMyQuizes,
  getQuizById,
  updateQuiz,
} from "@/controller/quizController.js";
import { authenticate } from "@/middleware/authentication.js";
import { Router } from "express";
import questionsRoutes from "./questionRoutes.js";

const quizRoutes = Router({ mergeParams: true });
quizRoutes
  .get("/", getAllQuizes)
  .use(authenticate)
  .get("/my-quizzes", getMyQuizes)
  .get("/:id", getQuizById)
  .post("/", createQuiz)
  .put("/:id", updateQuiz)
  .delete("/:id", deleteQuiz);

quizRoutes.use("/:quizID/questions", questionsRoutes);
export default quizRoutes;
