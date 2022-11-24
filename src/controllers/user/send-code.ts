import "dotenv/config";
import express, { NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import Randomstring from "randomstring";
import { User } from "../../models/user.model";
import { sendActiveAccountEmail } from "../../utils/active-account-email";
export const sendActiveCode = async (req: express.Request, res: express.Response, next: NextFunction) => {
  try {
    const activateString = Randomstring.generate(6);
    const effected = await User.update(
      {
        activateString,
      },
      {
        where: {
          id: req.user.id,
        },
      },
    );
    console.log(effected);
    sendActiveAccountEmail(req.user.email, activateString);
    return res.status(StatusCodes.OK).json({
      status: 200,
      data: {
        code: "success",
        message: "Email sent",
      },
    });
  } catch (err) {
    next(err);
  }
};
