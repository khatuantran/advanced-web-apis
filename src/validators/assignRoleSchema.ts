import joi from "joi";
import { GroupRole } from "../models";
export const AssignRoleSchema = joi.object({
  userId: joi.string().uuid().required(),
  newRole: joi.string().valid(GroupRole.OWNER, GroupRole.CO_OWNER, GroupRole.MEMBER).required(),
});
