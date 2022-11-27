import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { Group } from "../../models";
import { GroupRole, UserGroup } from "../../models/user-group.model";
//group/join-by-link?link=groupid-random-string(12)
export const joinGroupByLink = async (req: express.Request, res: express.Response) => {
  try {
    if (!req.query.link) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "link_not_found",
          message: "Link not found",
        },
      });
    }
    const link = req.query.link as string;
    const [groupId, _] = link.split("-random-");
    if (link.length < 2) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "invalid_link",
          message: "Invalid link",
        },
      });
    }
    const group = await Group.findOne({
      where: {
        id: groupId,
      },
      include: [
        {
          model: UserGroup,
          as: "users",
          where: {
            userId: req.user.id,
          },
          required: false,
        },
      ],
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

    if (group.users.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "user_joined",
          message: "User has joined this group",
        },
      });
    }

    if (group.invitationLink !== req.query.link) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "invalid_link",
          message: "Invalid link",
        },
      });
    }
    await UserGroup.create({
      userId: req.user.id,
      groupId: groupId,
      role: GroupRole.MEMBER,
    });
    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      data: {
        groupId: link[0],
        userId: req.user.id,
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
