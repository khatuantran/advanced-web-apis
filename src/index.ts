import cookieParser from "cookie-parser";
import express, { Express, NextFunction, Request, Response } from "express";
import path from "path";
import { configSequelize } from "./models/sequelize";
const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", (req: Request, res: Response) => {
  console.log(req.cookies);
  res.send("Hello world");
});

app.use((req, res) => {
  console.log("not found");
  res.status(404).json({ message: "not found error" });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: err.message });
});

const conectDBAndStartServer = async () => {
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
conectDBAndStartServer();
