import { Chat, Presentation } from "../../models";
import { IChat, IError, PersonalPresentationData } from "../type";

export const getPersonalChat = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any,
  data: PersonalPresentationData,
  sendResponseToClient: (response: IError | IChat[]) => void,
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

    let newChatData = [] as IChat[];
    let isHaveNew = false;
    if (data.createdAt) {
      console.log(data.createdAt);
      let limit = 0;
      const date = new Date(data.createdAt);
      chatData.forEach((chat) => {
        if (chat.createdAt >= date) {
          newChatData.push(chat);
        }
        if (chat.createdAt < date && limit < 10) {
          console.log(chat.createdAt);
          console.log(date);
          console.log("aaaaaaaa");
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
    // newChatData = isHaveNew ? newChatData : [];
    console.log(newChatData);
    // await socket.to(`${data.presentationId}`).emit("personal:get-chat", chatData);
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
