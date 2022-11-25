import bcrypt from "bcrypt";
import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { User, UserStatus } from "../../models/user.model";
import { SignInSchema } from "../../validators/signInSchema";
export const signIn = async (req: express.Request, res: express.Response) => {
  try {
    await SignInSchema.validateAsync({ ...req.body });
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: {
          code: "invalid_email",
          message: "invalid email",
        },
      });
    }

    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: {
          code: "invalid_password",
          message: "invalid password",
        },
      });
    }

    if (user.status === UserStatus.IN_ACTIVE) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: {
          code: "user_inactive",
          message: "User inactive",
        },
      });
    }
    const token = jwt.sign(
      {
        id: user.id,
        tokenCounter: user,
      },
      process.env.AUTH_SECRET,
      { expiresIn: "360 days" },
    );

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
      error: {
        code: "bad_request",
        message: err.message,
      },
    });
  }
};