import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { Group } from "../../models/group.model";
import { UserGroup } from "../../models/user-group.model";
// import 'express-async-errors';
export const listGroup = async (req: express.Request, res: express.Response) => {
  try {
    const groups = (
      await UserGroup.findAll({
        where: {
          userId: req.user.id,
        },
        include: [
          {
            model: Group,
            as: "group",
          },
        ],
      })
    ).map((userGroup) => {
      return {
        groupName: userGroup.group.name,
        role: userGroup.role,
      };
    });
    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      data: {
        groups: groups,
      },
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
