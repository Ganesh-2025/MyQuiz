import { getMe } from "@/controller/userController.js";
import { authenticate } from "@/middleware/authentication.js";
import { Router } from "express";

const userRoutes = Router();
userRoutes.use(authenticate);
userRoutes.get("", getMe);
export default userRoutes;
