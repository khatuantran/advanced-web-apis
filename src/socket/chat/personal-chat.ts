import { Op, WhereOptions } from "sequelize";
import { Chat, ChatType, Presentation } from "../../models";
import { IChat, IError, PersonalPresentationData } from "../type";

export const chatPersonalPresent = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any,
  data: PersonalPresentationData,
  sendResponseToClient: (response: IError | IChat) => void,
) => {
  try {
    console.log("Start chat socket");

    const presentation = await Presentation.findOne({
      where: {
        id: data?.presentationId,
      },
    });

    if (!presentation) {
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
      presentationId: presentation.id,
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

    console.log(whereOption);
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
    console.log(chatData);
    await socket.to(`${data.presentationId}`).emit("personal:chat");
    sendResponseToClient(chatData[0]);
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
