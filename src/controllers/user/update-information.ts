import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { User } from "../../models";
import { UpdateInformationSchema } from "../../validators";
// import 'express-async-errors';
export const updateInformation = async (req: express.Request, res: express.Response) => {
  try {
    await UpdateInformationSchema.validateAsync({ ...req.body });
    await User.update(
      {
        ...req.body,
      },
      {
        where: {
          id: req.user.id,
        },
      },
    );

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      data: {
        id: req.user.id,
        ...req.body,
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
