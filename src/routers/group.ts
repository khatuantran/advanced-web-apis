import express from "express";
import {
  assignRole,
  createGroup,
  generateInviteLink,
  getInviteLink,
  groupDetail,
  joinGroupByEmail,
  joinGroupByLink,
  kickOut,
  leaveGroup,
  listUserGroup,
  sendInvitationEmail,
  transferGroup,
} from "../controllers/group";
const groupRouter = express.Router();
groupRouter.post("/create", createGroup);
groupRouter.get("/list-group", listUserGroup);
groupRouter.get("/:groupId/detail", groupDetail);
groupRouter.get("/:groupId/get-invite-link", getInviteLink);
groupRouter.get("/:groupId/generate-invite-link", generateInviteLink);
groupRouter.post("/:groupId/assign-role", assignRole);
groupRouter.post("/:groupId/transfer-group", transferGroup);
groupRouter.post("/:groupId/kick-out", kickOut);
groupRouter.post("/:groupId/leave-group", leaveGroup);
groupRouter.post("/:groupId/send-invite-email", sendInvitationEmail);
groupRouter.get("/join-by-link", joinGroupByLink);
groupRouter.get("/join-by-email", joinGroupByEmail);

export { groupRouter };
