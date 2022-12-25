import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import http from "http";
import passport from "passport";
import path from "path";
import { Server } from "socket.io";
import { applyPassportStrategy } from "./middlewares";
import { authRouter, groupRouter, presentationRouter, userRouter } from "./routers";
import { onConnection } from "./socket";
import { configSequelize } from "./utils";
import { configAssociation } from "./utils/config-association";
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      id: string;
      fullName: string;
      email: string;
      password: string;
      tokenCounter: number;
      provider: string;
    }
  }
}
const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
app.use(cors());
applyPassportStrategy(passport);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRouter);

app.use("/user", passport.authenticate("jwt", { session: false }), userRouter);

app.use("/group", passport.authenticate("jwt", { session: false }), groupRouter);

app.use("/presentation", passport.authenticate("jwt", { session: false }), presentationRouter);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
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

io.on("connection", (socket) => onConnection(io, socket));

const connectDBAndStartServer = async () => {
  const port = process.env.PORT || 3000;
  try {
    const sequelize = configSequelize();
    configAssociation();
    await sequelize.authenticate();
    server.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};
connectDBAndStartServer();
