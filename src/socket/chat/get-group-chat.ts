import { Chat, Group } from "../../models";
import { isHavePermission } from "../../utils";
import { GroupPresentationData, IChat, IError } from "../type";

export const getGroupChat = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any,
  data: GroupPresentationData,
  sendResponseToClient: (response: IError | IChat[]) => void,
) => {
  try {
    console.log("Start group chat socket");

    if (!socket?.userId) {
      return typeof sendResponseToClient === "function"
        ? sendResponseToClient({
            error: {
              code: "user_not_found",
              message: "User not found",
            },
          })
        : null;
    }

    if (!(await isHavePermission(socket.userId, data.groupId))) {
      return sendResponseToClient({
        error: {
          code: "permission_denied",
          message: "Permission denied",
        },
      });
    }

    const group = await Group.findOne({
      where: {
        id: data?.groupId,
      },
    });

    if (!group || !group.presentationId || group?.presentationId !== data.presentationId) {
      console.log("group not present");
      return typeof sendResponseToClient === "function"
        ? sendResponseToClient({
            error: {
              code: "presentation_not_found",
              message: "Presentation not found",
            },
          })
        : null;
    }

    const chatData = (
      await Chat.findAll({
        where: {
          presentationId: data.presentationId,
        },
        order: [["createdAt", "DESC"]],
      })
    ).map((chat) => {
      return {
        content: chat.content,
        createdAt: chat.createdAt,
      } as IChat;
    });

    console.log(`Client ${socket.id} push a chat to ${data.presentationId}`);
    await socket.to(`${data.groupId}`).emit("group:get-chat", chatData);
    sendResponseToClient(chatData);
  } catch (error) {
    console.log(error);
    return typeof sendResponseToClient === "function"
      ? sendResponseToClient({
          error: {
            code: "unknown_error",
            message: error.message,
          },
        })
      : null;
  }
};
