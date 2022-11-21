import express from "express";
import { registerUser } from "../controllers/auth/register";
import { signIn } from "../controllers/auth/signIn";
const authRouter = express.Router();
authRouter.post("/register", registerUser);
authRouter.post("/sign-in", signIn);
export default authRouter;
