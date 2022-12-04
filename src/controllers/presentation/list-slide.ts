import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { Slide } from "../../models";
// import 'express-async-errors';
export const listPresentationSlide = async (req: express.Request, res: express.Response) => {
  try {
    const slides = (
      await Slide.findAll({
        where: {
          presentationId: req.params.presentationId,
        },
      })
    ).map((slide) => {
      return {
        id: slide.id,
        title: slide.title,
        options: slide.options,
      };
    });
    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      data: {
        slides: slides,
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
