import express from "express";
import { activateAccount, registerUser, sendActiveCode, signIn } from "../controllers/auth";
const authRouter = express.Router();
authRouter.post("/register", registerUser);
authRouter.post("/sign-in", signIn);
authRouter.post("/send-code", sendActiveCode);
authRouter.post("/active-account", activateAccount);
export default authRouter;
