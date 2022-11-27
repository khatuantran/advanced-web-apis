import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { Group } from "../../models";
import { GroupRole, UserGroup } from "../../models/user-group.model";
//group/join-by-link?link=groupid-random-string(12)
export const joinGroupByEmail = async (req: express.Request, res: express.Response) => {
  try {
    if (!req.query.userId || !req.query.groupId || !req.query.inviteString) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "invalid_query",
          message: "Link not found",
        },
      });
    }
    const group = await Group.findOne({
      where: {
        id: req.query.groupId as string,
      },
      include: [
        {
          model: UserGroup,
          as: "users",
          where: {
            userId: req.query.userId as string,
          },
          required: false,
        },
      ],
    });

    if (group.users.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "user_joined",
          message: "User has joined this group",
        },
      });
    }
    if (!group) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "group_not_found",
          message: "Group not found",
        },
      });
    }

    if (group.invitationLink !== req.query.inviteString) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "invalid_link",
          message: "Invalid link",
        },
      });
    }
    await UserGroup.create({
      userId: req.query.userId as string,
      groupId: req.query.groupId as string,
      role: GroupRole.MEMBER,
    });
    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      data: {
        message: "success",
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
