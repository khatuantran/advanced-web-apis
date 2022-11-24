import bcrypt from "bcrypt";
import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.model";
import { SignInSchema } from "../../validators/signInSchema";
export const signIn = async (req: express.Request, res: express.Response) => {
  try {
    await SignInSchema.validateAsync({ ...req.body });
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: {
          code: "invalid_username",
          message: "invalid username",
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
        username: user.username,
        email: user.email,
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
