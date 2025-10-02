import app from "@/server.js";
import Express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import authRouter from "./routes/authRoutes.js";

app.use(Express.json());

app.use("/api/auth", authRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.log(err);
  return res.status(500).json({
    status: "error",
    message: "something went wrong",
    data: err,
  });
});
