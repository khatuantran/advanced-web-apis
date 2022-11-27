import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { Op, WhereOptions } from "sequelize";
import { Group } from "../../models/group.model";
import { GroupRole, UserGroup } from "../../models/user-group.model";
// import 'express-async-errors';
export const enum IListOption {
  USER_CREATED = "user_created",
  USER_JOINED = "user_joined",
}
export const listUserGroup = async (req: express.Request, res: express.Response) => {
  try {
    const listOption = req.query.listOption;
    const whereOption: WhereOptions = {
      userId: req.user.id,
    };

    if (listOption && [IListOption.USER_CREATED, IListOption.USER_JOINED].includes(listOption as IListOption)) {
      listOption === IListOption.USER_CREATED
        ? (whereOption.role = GroupRole.OWNER)
        : (whereOption.role = {
            [Op.in]: [GroupRole.CO_OWNER, GroupRole.MEMBER],
          });
    }

    const groups = (
      await UserGroup.findAll({
        where: whereOption,
        include: [
          {
            model: Group,
            as: "group",
          },
        ],
      })
    ).map((userGroup) => {
      return {
        groupId: userGroup.group.id,
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
        code: "bad_request",
        message: err.message,
      },
    });
  }
};
