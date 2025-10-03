import Express, {
  type Express as Ex,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import authRouter from "./routes/authRoutes.js";
import z, { ZodError } from "zod";
import userRoutes from "./routes/userRoutes.js";

const app = Express() as Ex;

app.use(Express.json());
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log("cookies received : ", req.cookies);
  next();
});
app.get("/", (_, res) => {
  res.status(200).json({ message: "i am alive!" });
});

app.use("/api/auth", authRouter);
app.use("/api/me", userRoutes);
app.use((req: Request, res: Response): Response => {
  return res.status(404).json({
    status: "error",
    message: `Not Found : method ${req.method} path ${req.path}`,
  });
});
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.log(err);
  let zoderr;
  if (err instanceof ZodError) {
    console.log(err.issues);
    console.log(err.message);
    console.log(err.stack);
    zoderr = z.flattenError(err);

    return res.status(400).json({
      status: "error",
      message: "validation error",
      data: err.issues,
      errors: zoderr,
    });
  }

  return res.status(500).json({
    status: "error",
    message: err.message,
    data: zoderr || err,
  });
});

export default app;
