import { Chat, ChatType, Presentation } from "../../models";
import { IChat, IError, ISlide, PersonalPresentationData } from "../type";

export const chatPresentation = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any,
  data: PersonalPresentationData,
  sendResponseToClient: (response: ISlide[] | IError | IChat[]) => void,
) => {
  try {
    console.log("Start chat socket");

    const presentation = await Presentation.findOne({
      where: {
        id: data?.presentationId,
        isPresent: true,
      },
    });

    if (!presentation) {
      return sendResponseToClient({
        error: {
          code: "presentation_not_found",
          message: "Presentation not found",
        },
      });
    }

    if (!data?.message) {
      return sendResponseToClient({
        error: {
          code: "message_required",
          message: "Message is required",
        },
      });
    }

    await Chat.create({
      presentationId: presentation.id,
      content: data.message,
      type: ChatType.MESSAGE,
    });

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

    console.log(`Client ${socket.id} start present ${data.presentationId}`);
    await socket.to(`${data.presentationId}`).emit("personal:chat", chatData);
    sendResponseToClient(chatData);
  } catch (error) {
    return sendResponseToClient({
      error: {
        code: "unknown_error",
        message: error.message,
      },
    });
  }
};
