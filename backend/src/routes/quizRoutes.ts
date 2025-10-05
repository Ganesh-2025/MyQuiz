import {
  create,
  deleteQuiz,
  getAllQuizes,
  getQuizById,
  update,
} from "@/controller/quizController.js";
import { authenticate } from "@/middleware/authentication.js";
import { Router } from "express";

const quizRoutes = Router();
quizRoutes
  .get("/", getAllQuizes)
  .use(authenticate)
  .get("/:id", getQuizById)
  .post("/", create)
  .put("/:id", update)
  .delete("/:id", deleteQuiz);

export default quizRoutes;
