import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { User } from "../../models";
// import 'express-async-errors';
export const getUserProfile = async (req: express.Request, res: express.Response) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
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
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        status: user.status,
        provider: user.provider,
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
