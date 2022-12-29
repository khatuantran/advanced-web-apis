import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import Randomstring from "randomstring";
import { User } from "../../models/user.model";
import { sendResetPasswordEmail } from "../../utils";
export const sendResetPasswordLink = async (req: express.Request, res: express.Response) => {
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

    const activateString = Randomstring.generate(6);
    await user.update({
      activateString: activateString,
    });

    await sendResetPasswordEmail(user.email, `https://final-term.vercel.app/reset-password/${activateString}`);
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
