import bcrypt from "bcrypt";
import "dotenv/config";
import express, { NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { User } from "../../models/user.model";
import { RegisterSchema } from "../../validators/registerSchema";
// import 'express-async-errors';
export const salt = 10;
export const registerUser = async (req: express.Request, res: express.Response, next: NextFunction) => {
  try {
    await RegisterSchema.validateAsync({ ...req.body });
    const user = await User.findOne({
      where: {
        [Op.or]: [
          {
            username: req.body.username,
          },
        ],
      },
    });
    if (user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          message: "account exist",
        },
      });
    }

    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const userCreated = await User.create({
      username: req.body.username,
      password: hashPassword,
      email: req.body.email ? req.body.email : null,
      fullName: req.body.fullName,
    });

    const token = jwt.sign(
      {
        id: userCreated.id,
        tokenCounter: 0,
      },
      process.env.AUTH_SECRET,
      { expiresIn: "360 days" },
    );

    return res.status(StatusCodes.ACCEPTED).json({
      status: 200,
      data: {
        id: userCreated.id,
        fullName: userCreated.fullName,
        username: userCreated.username,
        email: userCreated.email,
        accessToken: token,
      },
    });
  } catch (err) {
    return next(err);
  }
};
