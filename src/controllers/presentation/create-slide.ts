import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { ISlideOption, Slide } from "../../models";
// import { CreateSlideSchema } from "../../validators";
// import 'express-async-errors';
export const createSlide = async (req: express.Request, res: express.Response) => {
  try {
    // await CreateSlideSchema.validateAsync({ ...req.body });
    const contents = req.body.contents ? req.body.contents : null;
    const slide = await Slide.create({
      title: req.body.title ? req.body.title : null,
      presentationId: req.params.presentationId,
      createdBy: req.user.id,
      options: contents
        ? contents.map((content, index) => {
            return {
              index: index + 1,
              content,
              chooseNumber: 0,
            } as ISlideOption;
          })
        : null,
    });
    return res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      data: {
        id: slide.id,
        title: slide.title,
        options: slide.options,
        createdUser: {
          id: req.user.id,
          fullName: req.user.fullName,
          email: req.user.email,
        },
        createdAt: slide.createdAt,
        updatedAt: slide.updatedAt,
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
