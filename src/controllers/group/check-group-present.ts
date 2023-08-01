import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { Group } from "../../models";
// import 'express-async-errors';
export const checkGroupPresent = async (req: express.Request, res: express.Response) => {
  try {
    if (!req.body.groupId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "invalid_group_id",
          message: "Invalid group id",
        },
      });
    }

    const group = await Group.findOne({
      where: {
        id: req.body.groupId,
      },
    });

    if (!group) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "group_not_found",
          message: "Group not found",
        },
      });
    }

    if (group.presentationId) {
      console.log(group.presentationId);
      return res.status(StatusCodes.OK).json({
        status: StatusCodes.CREATED,
        data: {
          isPresent: true,
          presentationId: group.presentationId,
        },
      });
    }
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.CREATED,
      data: {
        isPresent: false,
        presentationId: null,
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
