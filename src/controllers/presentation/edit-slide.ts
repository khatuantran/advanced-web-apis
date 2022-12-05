import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { Sequelize } from "sequelize-typescript";
import { ISlideOption, Slide, User } from "../../models";
import { CreateSlideSchema } from "../../validators";
// import 'express-async-errors';
export const editSlide = async (req: express.Request, res: express.Response) => {
  try {
    await CreateSlideSchema.validateAsync({ ...req.body });
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
      include: [
        {
          model: User,
          as: "createdUser",
        },
      ],
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
    const contents = req.body.contents as string[];

    await slide.update({
      title: req.body.title,
      options: contents.map((content, index) => {
        return {
          index: index + 1,
          content,
          chooseNumber: 0,
        } as ISlideOption;
      }),
      updatedAt: Sequelize.literal(`now()`),
      updatedBy: req.user.id,
    });
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      data: {
        title: req.body.title,
        options: contents.map((content, index) => {
          return {
            index: index + 1,
            content,
          } as ISlideOption;
        }),
        createdUser: {
          id: slide.createdUser.id,
          fullName: slide.createdUser.fullName,
          email: slide.createdUser.email,
        },
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
