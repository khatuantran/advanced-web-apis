import express from "express";
import {
  activateAccount,
  registerUser,
  resetPassword,
  sendActiveCode,
  sendResetPasswordLink,
  signIn,
  verifyGoogle,
} from "../controllers";
const authRouter = express.Router();
authRouter.post("/register", registerUser);
authRouter.post("/sign-in", signIn);
authRouter.post("/send-code", sendActiveCode);
authRouter.post("/active-account", activateAccount);
authRouter.post("/verify-google", verifyGoogle);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/send-reset-password", sendResetPasswordLink);
export { authRouter };
