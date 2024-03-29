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
      console.log("===============", group?.presentationId);
      console.log("===============", data?.presentationId);
      // return typeof sendResponseToClient === "function"
      //   ? sendResponseToClient({
      //       error: {
      //         code: "presentation_not_found",
      //         message: "Presentation not found",
      //       },
      //     })
      //   : null;
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
        id: chat.id,
        content: chat.content,
        createdAt: chat.createdAt,
      } as IChat;
    });

    let newChatData = [] as IChat[];
    let isHaveNew = false;
    if (data.createdAt) {
      let limit = 0;
      const date = new Date(data.createdAt);
      chatData.forEach((chat) => {
        if (chat.createdAt >= date) {
          newChatData.push(chat);
        }
        if (chat.createdAt < date && limit < 10) {
          isHaveNew = true;
          newChatData.push(chat);
          limit += 1;
        }
      });
    } else {
      isHaveNew = true;
      if (chatData.length <= 10) {
        newChatData = chatData.slice();
      } else {
        newChatData = chatData.slice(0, 10);
      }
    }
    console.log(`Client ${socket.id} get all chat of present ${data.presentationId}`);
    newChatData = isHaveNew ? newChatData : [];
    console.log(newChatData);
    // await socket.to(`${data.groupId}`).emit("group:get-chat", chatData);
    sendResponseToClient(newChatData);
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
