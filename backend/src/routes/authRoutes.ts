import { signin, signout, signup } from "@/controller/authController.js";
import { Router } from "express";

const authRouter = Router();
authRouter
  .post("/signup", signup)
  .post("/signin", signin)
  .get("/signout", signout);

export default authRouter;
