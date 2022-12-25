import bcrypt from "bcrypt";
import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import Randomstring from "randomstring";
import { User } from "../../models";
import { salt } from "./register";

//group/join-by-link?link=groupid-random-string(12)
export const resetPassword = async (req: express.Request, res: express.Response) => {
  try {
    if (!req.body.newPassword || typeof req.body.newPassword != "string" || req.body.newPassword.length < 1) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "invalid_password",
          message: "Invalid password",
        },
      });
    }

    const code = req.body.code;
    const user = await User.findOne({
      where: {
        activateString: code ? code : "",
      },
    });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "invalid_code",
          message: "Invalid code",
        },
      });
    }

    const activateString = Randomstring.generate(6);
    const newPassHash = await bcrypt.hash(req.body.newPassword, salt);

    await user.update({
      activateString: activateString,
      tokenCounter: user.tokenCounter + 1,
      password: newPassHash,
    });

    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      data: {
        message: "Reset password successfully",
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
