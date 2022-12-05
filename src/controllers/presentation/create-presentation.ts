import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { Presentation, Slide } from "../../models";
import { CreatePresentationSchema } from "../../validators/createPresentation";
// import 'express-async-errors';
export const createPresentation = async (req: express.Request, res: express.Response) => {
  try {
    await CreatePresentationSchema.validateAsync({ ...req.body });
    const presentation = await Presentation.create({
      name: req.body.name,
      ownerId: req.user.id,
    });
    await Slide.create({
      title: "",
      presentationId: presentation.id,
      createdBy: req.user.id,
      options: [],
    });
    return res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      data: {
        id: presentation.id,
        name: presentation.name,
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
