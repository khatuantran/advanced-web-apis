import express from "express";
import { changePassword, updateInformation } from "../controllers/user";
// import { activateAccount } from "../controllers/user/active-account";
// import { sendActiveCode } from "../controllers/auth/send-code";
const userRouter = express.Router();
userRouter.post("/change-password", changePassword);
userRouter.post("/update-information", updateInformation);
// userRouter.post("/active-account", activateAccount);
export { userRouter };
