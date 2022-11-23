import "dotenv/config";
import express, { NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { User, UserStatus } from "../../models/user.model";
export const activateAccount = async (req: express.Request, res: express.Response, next: NextFunction) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
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
    await user.update({
      status: UserStatus.ACTIVE,
    });
    return res.status(StatusCodes.ACCEPTED).json({
      status: StatusCodes.ACCEPTED,
      data: {
        code: "success",
        message: "Activate account success",
      },
    });
  } catch (err) {
    return next(err);
  }
};
