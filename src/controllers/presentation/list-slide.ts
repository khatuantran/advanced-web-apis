import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { Presentation, Slide, User } from "../../models";
// import 'express-async-errors';
export const listPresentationSlide = async (req, res: express.Response) => {
  try {
    const presentation = req.presentation as Presentation;
    const slides = (
      await Slide.findAll({
        where: {
          presentationId: req.params.presentationId,
        },
        include: [
          {
            model: User,
            as: "createdUser",
          },
        ],
        order: [["createdAt", "ASC"]],
      })
    ).map((slide) => {
      return {
        id: slide.id,
        title: slide.title,
        options: slide.options,
        createdUser: {
          id: slide.createdUser.id,
          fullName: slide.createdUser.fullName,
          email: slide.createdUser.email,
        },
        createdAt: slide.createdAt,
        updatedAt: slide.updatedAt,
        presentation: {
          presentationId: presentation.id,
          presentationName: presentation.name,
          ownerId: presentation.ownerId,
          ownerName: presentation.owner.fullName,
          createdAt: presentation.createdAt,
          updatedAt: presentation.updatedAt,
        },
      };
    });
    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      data: {
        presentationId: presentation.id,
        presentationName: presentation.name,
        presentationOwnerName: presentation.owner.fullName,
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
