import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { ISlideOption, Slide } from "../../models";
import { CreateSlideSchema } from "../../validators";
// import 'express-async-errors';
export const createSlide = async (req: express.Request, res: express.Response) => {
  try {
    await CreateSlideSchema.validateAsync({ ...req.body });
    const contents = req.body.contents as string[];
    const slide = await Slide.create({
      title: req.body.title,
      presentationId: req.params.presentationId,
      options: contents.map((content, index) => {
        return {
          index: index + 1,
          content,
          chooseNumber: 0,
        } as ISlideOption;
      }),
    });
    return res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      data: {
        id: slide.id,
        title: slide.title,
        options: slide.options,
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