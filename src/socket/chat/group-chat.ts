/* eslint-disable @typescript-eslint/no-explicit-any */
import { Op, WhereOptions } from "sequelize";
import { Chat, ChatType, Group } from "../../models";
import { isHavePermission } from "../../utils";
import { GroupPresentationData, IChat, IError } from "../type";

export const chatGroupPresent = async (
  socket: any,
  data: GroupPresentationData,
  sendResponseToClient: (response: IError | IChat) => void,
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

    if (!data?.message) {
      return typeof sendResponseToClient === "function"
        ? sendResponseToClient({
            error: {
              code: "message_required",
              message: "Message is required",
            },
          })
        : null;
    }

    await Chat.create({
      presentationId: data.presentationId,
      content: data.message,
      type: ChatType.MESSAGE,
    });

    const whereOption: WhereOptions = {
      presentationId: data.presentationId,
    };

    if (data.createdAt) {
      whereOption.createdAt = {
        [Op.gte]: data.createdAt,
      };
    }
    const chatData = (
      await Chat.findAll({
        where: whereOption,
        order: [["createdAt", "DESC"]],
      })
    ).map((chat) => {
      return {
        content: chat.content,
        createdAt: chat.createdAt,
      } as IChat;
    });

    console.log(`Client ${socket.id} push a chat to ${data.presentationId}`);
    await socket.to(`${data.groupId}`).emit("group:chat", chatData);
    sendResponseToClient(chatData[0]);
    // sendResponseToClient(chatData);
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
