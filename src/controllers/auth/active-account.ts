import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import Randomstring from "randomstring";
import { User, UserStatus } from "../../models/user.model";
import { generateToken } from "../../utils";
export const activateAccount = async (req: express.Request, res: express.Response) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(StatusCodes.BAD_GATEWAY).json({
        status: StatusCodes.BAD_GATEWAY,
        error: {
          code: "user_not_found",
          message: "User not found",
        },
      });
    }
    if (user.status === UserStatus.ACTIVE) {
      return res.status(StatusCodes.FORBIDDEN).json({
        status: StatusCodes.FORBIDDEN,
        error: {
          code: "user_activated",
          message: "User activated",
        },
      });
    }
    if (req.body.code !== user.activateString) {
      return res.status(StatusCodes.FORBIDDEN).json({
        status: StatusCodes.FORBIDDEN,
        error: {
          code: "invalid_code",
          message: "Invalid code",
        },
      });
    }

    const activateString = Randomstring.generate(6);

    await user.update({
      status: UserStatus.ACTIVE,
      activateString: activateString,
    });

    const token = generateToken(user.id, user.tokenCounter);

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      data: {
        code: "success",
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          status: user.status,
          accessToken: token,
        },
        message: "Activate account success",
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
