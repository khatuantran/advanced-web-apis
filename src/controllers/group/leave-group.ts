import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { GroupRole, UserGroup } from "../../models/user-group.model";
export const leaveGroup = async (req: express.Request, res: express.Response) => {
  try {
    const userGroup = await UserGroup.findOne({
      where: {
        userId: req.user.id,
        groupId: req.params.groupId,
      },
    });

    if (!userGroup) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "group_not_found",
          message: "Group not found",
        },
      });
    }

    if (userGroup.role === GroupRole.OWNER) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "permission_denied",
          message: "Owner can not leave group, please transfer group to order user",
        },
      });
    }

    await userGroup.destroy();
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      data: {
        message: "Action successfully",
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
