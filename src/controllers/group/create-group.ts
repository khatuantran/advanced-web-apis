import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { Group } from "../../models/group.model";
import { GroupRole, UserGroup } from "../../models/user-group.model";
import { CreateGroupSchema } from "../../validators/createGroupSchema";
// import 'express-async-errors';
export const createGroup = async (req: express.Request, res: express.Response) => {
  try {
    await CreateGroupSchema.validateAsync({ ...req.body });
    const group = await Group.create({
      name: req.body.name,
      ownerId: req.user.id,
    });
    await UserGroup.create({
      userId: req.user.id,
      groupId: group.id,
      role: GroupRole.OWNER,
    });
    return res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      data: {
        groupId: group.id,
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
