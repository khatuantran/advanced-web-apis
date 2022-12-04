import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { Slide } from "../../models";
// import 'express-async-errors';
export const deleteSlide = async (req: express.Request, res: express.Response) => {
  try {
    if (!req.params.slideId) {
      return res.status(StatusCodes.BAD_GATEWAY).json({
        status: StatusCodes.BAD_GATEWAY,
        error: {
          code: "slide_required",
          name: "Slide required",
        },
      });
    }
    const slide = await Slide.findOne({
      where: {
        id: req.params.slideId,
      },
    });
    if (!slide) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        error: {
          code: "slide_not_found",
          name: "Slide not found",
        },
      });
    }
    await slide.destroy();
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      data: {
        message: "Delete slide success",
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
