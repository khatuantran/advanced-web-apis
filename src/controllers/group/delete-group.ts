import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { Group } from "../../models";
import { GroupRole, UserGroup } from "../../models/user-group.model";
// import 'express-async-errors';
export const deleteGroup = async (req: express.Request, res: express.Response) => {
  try {
    if (!req.body.groupId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "invalid_group_id",
          message: "Invalid group Id",
        },
      });
    }

    const userGroup = await UserGroup.findOne({
      where: {
        userId: req.user.id,
        groupId: req.body.groupId as string,
        role: GroupRole.OWNER,
      },
    });

    if (!userGroup) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "permission_denied",
          message: "Permission denied",
        },
      });
    }

    await Group.destroy({
      where: {
        id: userGroup.groupId,
      },
    });

    return res.status(StatusCodes.CREATED).json({
      message: "Delete successfully",
    });
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      error: {
        message: err.message,
      },
    });
  }
};
