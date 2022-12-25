import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { Sequelize } from "sequelize-typescript";
import { ISlideOption, Slide, SlideType, User } from "../../models";
// import 'express-async-errors';
export const editSlide = async (req: express.Request, res: express.Response) => {
  try {
    // await CreateSlideSchema.validateAsync({ ...req.body });
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
    const contents = req.body.contents ? req.body.contents : [];
    const type = req.body.type ? req.body.type : SlideType.MultipleChoice;

    if (![SlideType.Heading, SlideType.MultipleChoice, SlideType.Paragraph].includes(type)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "type_not_found",
          message: "Type not found",
        },
      });
    }
    const option =
      type === SlideType.MultipleChoice
        ? contents.map((content, index) => {
            return {
              index: index + 1,
              content,
              chooseNumber: 0,
            } as ISlideOption;
          })
        : typeof contents == "string"
        ? contents
        : "";
    await slide.update({
      title: req.body.title,
      options: option,
      type: type,
      updatedAt: Sequelize.literal(`now()`),
      updatedBy: req.user.id,
    });
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      data: {
        title: req.body.title,
        options: option,
        type: type,
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
