import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { Presentation, Slide, User } from "../../models";
// import 'express-async-errors';
export const listUserPresentation = async (req: express.Request, res: express.Response) => {
  try {
    const presentations = (
      await Presentation.findAll({
        where: {
          ownerId: req.user.id,
        },
        include: [
          {
            model: User,
            as: "owner",
          },
          {
            model: Slide,
            as: "slides",
          },
        ],
      })
    ).map((presentation) => {
      return {
        ownerId: presentation.owner.id,
        ownerName: presentation.owner.fullName,
        ownerEmail: presentation.owner.email,
        presentationId: presentation.id,
        presentationName: presentation.name,
        slideQuantity: presentation.slides?.length || 0,
        createdAt: presentation.createdAt,
        updatedAt: presentation.updatedAt,
      };
    });
    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      data: {
        presentations: presentations,
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
