import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Presentation } from "../models";

export const presentationOfSlide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.params.presentationId) {
      return res.status(StatusCodes.BAD_GATEWAY).json({
        status: StatusCodes.BAD_GATEWAY,
        error: {
          code: "presentation_required",
          name: "Presentation required",
        },
      });
    }
    const presentation = await Presentation.findOne({
      where: {
        id: req.params.presentationId,
        ownerId: req.user.id,
      },
    });
    if (!presentation) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        error: {
          code: "presentation_not_found",
          name: "Presentation not found",
        },
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      error: {
        code: "bad_request",
        message: error.message,
      },
    });
  }
};
