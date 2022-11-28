import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { GroupRole, User, UserGroup } from "../../models";
import { Group } from "../../models/group.model";

// /group/:groupId/detail
export const groupDetail = async (req: express.Request, res: express.Response) => {
  try {
    const group = await Group.findOne({
      where: {
        id: req.params.groupId,
      },
      include: [
        {
          model: User,
          as: "owner",
        },
        {
          model: UserGroup,
          as: "users",
          include: [{ model: User, as: "user" }],
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
    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      data: {
        information: {
          id: group.id,
          name: group.name,
          memberNumber: group.users.length,
        },
        owner: {
          id: group.owner.id,
          fullName: group.owner.fullName,
          email: group.owner.email,
        },
        members: group.users
          .filter((user) => user.role !== GroupRole.OWNER)
          .map((userGroup) => {
            return {
              id: userGroup.user.id,
              fullName: userGroup.user.fullName,
              email: userGroup.user.email,
              role: userGroup.role,
            };
          }),
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
