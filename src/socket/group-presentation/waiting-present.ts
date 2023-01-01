import { Group, UserGroup } from "../../models";
import { IError, IGroupPresent } from "../type";

export const waitingGroupPresentation = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any,
  sendResponseToClient: (response: IGroupPresent[] | IError) => void,
) => {
  try {
    console.log("Group");
    console.log("Waiting group present socket");
    if (!socket.userId) {
      return sendResponseToClient({
        error: {
          code: "user_not_found",
          message: "User not found",
        },
      });
    }

    const groups = await UserGroup.findAll({
      where: {
        userId: socket.userId,
      },
      include: [
        {
          model: Group,
          as: "group",
        },
      ],
    });

    let groupPresent: IGroupPresent[];
    groups.forEach(async (group) => {
      if (group?.group?.presentationId) {
        groupPresent.push({
          presentationId: group.group.presentationId,
          groupId: group.groupId,
          groupName: group.group.name,
        });
      }
      await socket.join(`${group.groupId}}`);
    });
    console.log("Waiting group present", groupPresent);
    sendResponseToClient(groupPresent ? groupPresent : []);
  } catch (error) {
    return sendResponseToClient({
      error: {
        code: "unknown_error",
        message: error.message,
      },
    });
  }
};
