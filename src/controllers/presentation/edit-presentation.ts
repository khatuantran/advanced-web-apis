import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { Sequelize } from "sequelize-typescript";
import { Presentation } from "../../models";
import { CreatePresentationSchema } from "../../validators/createPresentation";
// import 'express-async-errors';
export const editPresentation = async (req: express.Request, res: express.Response) => {
  try {
    await CreatePresentationSchema.validateAsync({ ...req.body });
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
    await presentation.update({ name: req.body.name, updatedAt: Sequelize.literal(`now()`) });
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
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
