import express from "express";
import { activateAccount } from "../controllers/user/active-account";
import { sendActiveCode } from "../controllers/user/send-code";
const userRouter = express.Router();
userRouter.get("/send-code", sendActiveCode);
userRouter.post("/active-account", activateAccount);
export default userRouter;
