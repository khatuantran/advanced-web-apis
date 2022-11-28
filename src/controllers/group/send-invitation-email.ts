import "dotenv/config";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { Group, User } from "../../models";
import { GroupRole, UserGroup } from "../../models/user-group.model";
import { sendInvitationGroupEmail } from "../../utils";
import { SendInvitationSchema } from "../../validators";
//group/join-by-link?link=groupid-random-string(12)
export interface IInvitationJoinGroup {
  email: string;
  link: string;
}
export const sendInvitationEmail = async (req: express.Request, res: express.Response) => {
  try {
    await SendInvitationSchema.validateAsync({ ...req.body });
    const userEmails = req.body.emails as string[];
    const userGroup = await UserGroup.findOne({
      where: {
        userId: req.user.id,
        groupId: req.params.groupId,
      },
      include: [
        { model: User, as: "user" },
        { model: Group, as: "group" },
      ],
    });
    if (!userGroup) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "group_not_found",
          message: "Group not found",
        },
      });
    }
    if (userGroup.role === GroupRole.MEMBER) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "permission_denied",
          message: "Permission denied",
        },
      });
    }

    let inviteObjects: IInvitationJoinGroup[];
    if (process.env.PORT) {
      inviteObjects = userEmails.map((userEmail) => {
        return {
          email: userEmail,
          link: `https://midterm-ptudwnc.vercel.app/join-group-by-link/${userGroup.group.invitationLink}`,
        } as IInvitationJoinGroup;
      });
    } else {
      inviteObjects = userEmails.map((userEmail) => {
        return {
          email: userEmail,
          link: `https://midterm-ptudwnc.vercel.app/join-group-by-link/${userGroup.group.invitationLink}`,
        } as IInvitationJoinGroup;
      });
    }

    if (inviteObjects.length > 0) {
      inviteObjects.forEach(async (inviteObject) => {
        await sendInvitationGroupEmail(
          inviteObject.email,
          inviteObject.link,
          userGroup.user.fullName,
          userGroup.group.name,
        );
      });
    }
    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      data: {
        message: "email send",
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
