import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { Group } from "../../models";
import { GroupRole, UserGroup } from "../../models/user-group.model";
import { AssignRoleSchema } from "../../validators/assignRoleSchema";
//group/join-by-link?link=groupid-random-string(12)
export const assignRole = async (req: express.Request, res: express.Response) => {
  try {
    await AssignRoleSchema.validateAsync({ ...req.body });
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

    if (
      userGroup.role === GroupRole.MEMBER ||
      (req.body.newRole === GroupRole.OWNER && userGroup.role !== GroupRole.OWNER) ||
      (userAssignedRole.role === GroupRole.OWNER && userGroup.role === GroupRole.CO_OWNER)
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "permission_denied",
          message: "Permission denied",
        },
      });
    }
    if (
      userGroup.userId === userAssignedRole.userId &&
      req.body.newRole !== GroupRole.OWNER &&
      userGroup.role === GroupRole.OWNER
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "method_not_allow",
          message: "Please choose other user to assign to owner",
        },
      });
    }
    if (req.body.newRole === GroupRole.OWNER && userGroup.role === GroupRole.OWNER) {
      const userAssignedRoleGroup = userAssignedRole.role;
      await Promise.all([
        userGroup.update({ role: userAssignedRoleGroup }),
        userAssignedRole.update({ role: GroupRole.OWNER }),
        Group.update({ ownerId: userAssignedRole.userId }, { where: { id: userAssignedRole.groupId } }),
      ]);
      return res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        data: {
          userId: req.body.userId,
          groupId: userGroup.id,
          newRole: req.body.newRole,
        },
      });
    }

    await userAssignedRole.update({
      role: req.body.newRole,
    });
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      data: {
        userId: req.body.userId,
        groupId: userGroup.id,
        newRole: req.body.newRole,
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
