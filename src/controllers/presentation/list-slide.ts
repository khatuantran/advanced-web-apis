import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { Presentation, Slide } from "../../models";
// import 'express-async-errors';
export const listPresentationSlide = async (req, res: express.Response) => {
  try {
    const presentation = req.presentation as Presentation;
    const slides = (
      await Slide.findAll({
        where: {
          presentationId: req.params.presentationId,
        },
        order: [["createdAt", "ASC"]],
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
        presentationId: presentation.id,
        presentationName: presentation.name,
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
