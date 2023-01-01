import { Presentation } from "../../models";
import { IError, ISlide, PersonalPresentationData } from "../type";

export const endPresentation = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any,
  data: PersonalPresentationData,
  sendResponseToClient: (response: ISlide[] | IError) => void,
) => {
  try {
    console.log("End present socket");
    if (!socket.userId) {
      return typeof sendResponseToClient === "function"
        ? sendResponseToClient({
            error: {
              code: "user_not_found",
              message: "User not found",
            },
          })
        : null;
    }

    const presentation = await Presentation.findOne({
      where: {
        id: data.presentationId,
        // isPresent: true,
        ownerId: socket.userId,
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
    await socket.to(`${data.presentationId}`).emit("personal:end-present");
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
