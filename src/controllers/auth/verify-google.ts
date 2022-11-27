import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { User, UserProvider, UserStatus } from "../../models/user.model";
import { generateToken } from "../../utils";
import { VerifyGoogleSchema } from "../../validators/verifyGoogleSchema";
// import 'express-async-errors';
export const verifyGoogle = async (req: express.Request, res: express.Response) => {
  try {
    await VerifyGoogleSchema.validateAsync({ ...req.body });
    const [user, created] = await User.findOrCreate({
      where: {
        email: req.body.email,
      },
      defaults: {
        email: req.body.email,
        fullName: req.body.fullName,
        status: UserStatus.ACTIVE,
        provider: UserProvider.GOOGLE,
      },
    });
    if (!created && user && user.provider === UserProvider.MANUAL) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "account_exist",
          message: "account exist",
        },
      });
    }
    const token = generateToken(user.id, user.tokenCounter);

    return res.status(StatusCodes.OK).json({
      status: 200,
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        status: user.status,
        accessToken: token,
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
