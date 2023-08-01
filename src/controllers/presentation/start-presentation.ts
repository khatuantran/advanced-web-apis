import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { Presentation } from "../../models";
// import 'express-async-errors';
export const startPresentation = async (req: express.Request, res: express.Response) => {
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
