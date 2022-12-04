import express from "express";
import { activateAccount, registerUser, sendActiveCode, signIn, verifyGoogle } from "../controllers";
const authRouter = express.Router();
authRouter.post("/register", registerUser);
authRouter.post("/sign-in", signIn);
authRouter.post("/send-code", sendActiveCode);
authRouter.post("/active-account", activateAccount);
authRouter.post("/verify-google", verifyGoogle);
export { authRouter };
