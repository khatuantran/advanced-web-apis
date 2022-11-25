import bcrypt from "bcrypt";
import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import Randomstring from "randomstring";
import { Op } from "sequelize";
import { User } from "../../models/user.model";
import { sendActiveAccountEmail } from "../../utils/active-account-email";
import { RegisterSchema } from "../../validators/registerSchema";
// import 'express-async-errors';
export const salt = 10;
export const registerUser = async (req: express.Request, res: express.Response) => {
  try {
    await RegisterSchema.validateAsync({ ...req.body });
    const user = await User.findOne({
      where: {
        [Op.or]: [
          {
            email: req.body.email,
          },
        ],
      },
    });
    if (user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "account_exist",
          message: "account exist",
        },
      });
    }
    const activateString = Randomstring.generate(6);

    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const userCreated = await User.create({
      password: hashPassword,
      email: req.body.email,
      fullName: req.body.fullName,
      activateString: activateString,
    });

    await sendActiveAccountEmail(req.body.email, activateString);

    return res.status(StatusCodes.CREATED).json({
      status: 201,
      data: {
        id: userCreated.id,
        fullName: userCreated.fullName,
        email: userCreated.email,
        status: userCreated.status,
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
