import { create, update } from "@/controller/questionController.js";
import { Router } from "express";

const questionsRoutes = Router({ mergeParams: true });
questionsRoutes.post("/", create).put("/:questionID", update);
export default questionsRoutes;
