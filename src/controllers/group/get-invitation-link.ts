import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import Randomstring from "randomstring";
import { Op } from "sequelize";
import { GroupRole, UserGroup } from "../../models";
import { Group } from "../../models/group.model";
export const getInviteLink = async (req: express.Request, res: express.Response) => {
  try {
    const group = await Group.findOne({
      where: {
        id: req.params.groupId,
      },
      include: [
        {
          model: UserGroup,
          as: "users",
          where: {
            userId: req.user.id,
            role: {
              [Op.in]: [GroupRole.CO_OWNER, GroupRole.OWNER, GroupRole.MEMBER],
            },
          },
        },
      ],
    });

    if (!group) {
      return res.status(StatusCodes.FORBIDDEN).json({
        status: StatusCodes.FORBIDDEN,
        error: {
          code: "permission_denied",
          message: "Permission denied",
        },
      });
    }

    let link: string;
    if (!group.invitationLink) {
      link = group.id + "-random-" + Randomstring.generate(12);
      await group.update({
        invitationLink: link,
      });
    } else {
      link = group.invitationLink;
    }

    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      data: {
        groupId: group.id,
        invitationLink: link,
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
