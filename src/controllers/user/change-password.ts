import bcrypt from "bcrypt";
import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { Sequelize } from "sequelize-typescript";
import { User } from "../../models";
import { generateToken } from "../../utils";
import { ChangePasswordSchema } from "../../validators";
import { salt } from "../auth";
// import 'express-async-errors';
export const changePassword = async (req: express.Request, res: express.Response) => {
  try {
    await ChangePasswordSchema.validateAsync({ ...req.body });
    const isValidPassword = await bcrypt.compare(req.body.oldPassword, req.user.password);
    if (!isValidPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "invalid_password",
          message: "Invalid password",
        },
      });
    }

    const newPassHash = await bcrypt.hash(req.body.newPassword, salt);
    await User.update(
      {
        password: newPassHash,
        tokenCounter: Sequelize.literal('"tokenCounter" + 1'),
      },
      {
        where: {
          id: req.user.id,
        },
      },
    );

    const token = generateToken(req.user.id, req.user.tokenCounter + 1);
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      data: {
        id: req.user.id,
        fullName: req.user.fullName,
        email: req.user.email,
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
