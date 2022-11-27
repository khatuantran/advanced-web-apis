import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { GroupRole, UserGroup } from "../../models/user-group.model";
import { TransferGroupSchema } from "../../validators/transferGroupSchema";
//group/join-by-link?link=groupid-random-string(12)
export const kickOut = async (req: express.Request, res: express.Response) => {
  try {
    await TransferGroupSchema.validateAsync({ ...req.body });
    const [userKickOut, userGroup] = await Promise.all([
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

    if (!userKickOut || !userGroup) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "user_not_found",
          message: "User not found",
        },
      });
    }

    if (userKickOut.role === GroupRole.OWNER || userGroup.role === GroupRole.MEMBER) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "permission_denied",
          message: "Permission denied",
        },
      });
    }

    await userKickOut.destroy();
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
