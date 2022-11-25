import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import Randomstring from "randomstring";
import { User, UserStatus } from "../../models/user.model";
import { sendActiveAccountEmail } from "../../utils/active-account-email";
export const sendActiveCode = async (req: express.Request, res: express.Response) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "user_not_found",
          message: "User not found",
        },
      });
    }
    if (user.status === UserStatus.ACTIVE) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "user_activated",
          message: "User activated",
        },
      });
    }

    const activateString = Randomstring.generate(6);
    await user.update({
      activateString: activateString,
    });

    await sendActiveAccountEmail(user.email, activateString);
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      data: {
        code: "success",
        message: "Email sent",
      },
    });
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      error: {
        code: "bad_request",
        message: err.message,
      },
    });
  }
};
