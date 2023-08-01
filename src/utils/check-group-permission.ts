import { Op } from "sequelize";
import { GroupRole, UserGroup } from "../models";

export const isHavePermissionOwner = async (userId: string, groupId: string) => {
  try {
    const userGroup = await UserGroup.findOne({
      where: {
        userId: userId,
        groupId: groupId,
        role: {
          [Op.in]: [GroupRole.CO_OWNER, GroupRole.OWNER],
        },
      },
    });
    if (!userGroup) {
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const isHavePermission = async (userId: string, groupId: string) => {
  try {
    const userGroup = await UserGroup.findOne({
      where: {
        userId: userId,
        groupId: groupId,
      },
    });
    if (!userGroup) {
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
