import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import passport from "passport";
import path from "path";
import { applyPassportStrategy } from "./middlewares/passport";
import { configSequelize } from "./models/sequelize";
import authRouter from "./routers/auth";
import groupRouter from "./routers/group";
import userRouter from "./routers/user";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      id: string;
      fullName: string;
      email: string;
      password: string;
    }
  }
}
const app: Express = express();

app.use(cors());
applyPassportStrategy(passport);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRouter);

app.use("/user", passport.authenticate("jwt", { session: false }), userRouter);

app.use("/group", passport.authenticate("jwt", { session: false }), groupRouter);

app.use("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

app.use((req, res) => {
  return res.status(404).json({
    error: {
      status: 404,
      message: "Not found",
    },
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: err.message });
});

const connectDBAndStartServer = async () => {
  const sequelize = configSequelize();
  const port = process.env.PORT || 3000;
  try {
    await sequelize.authenticate();
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};
connectDBAndStartServer();
