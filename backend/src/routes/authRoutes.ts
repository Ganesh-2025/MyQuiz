import { signin, signOut, signup } from "@/controller/authController.js";
import { Router } from "express";

const authRouter = Router();
authRouter
  .post("/signup", signup)
  .post("/signin", signin)
  .get("/signout", signOut);

export default authRouter;
