import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { Group } from "../../models";
import { GroupRole, UserGroup } from "../../models/user-group.model";
import { TransferGroupSchema } from "../../validators";
//group/join-by-link?link=groupid-random-string(12)
export const transferGroup = async (req: express.Request, res: express.Response) => {
  try {
    await TransferGroupSchema.validateAsync({ ...req.body });
    const [userAssignedRole, userGroup] = await Promise.all([
      UserGroup.findOne({
        where: {
          userId: req.body.userId,
          groupId: req.params.groupId,
        },
      }),
      UserGroup.findOne({
        where: {
          userId: req.user.id,
          groupId: req.params.groupId,
        },
      }),
    ]);

    if (!userAssignedRole || !userGroup) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "user_not_found",
          message: "User not found",
        },
      });
    }

    if (userGroup.role !== GroupRole.OWNER) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "permission_denied",
          message: "Permission denied",
        },
      });
    }

    await Promise.all([
      userAssignedRole.update({
        role: GroupRole.OWNER,
      }),
      userGroup.update({
        role: GroupRole.MEMBER,
      }),
      Group.update(
        { ownerId: req.body.userId },
        {
          where: {
            id: req.params.groupId,
          },
        },
      ),
    ]);
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      data: {
        newOwnerId: req.body.userId,
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
