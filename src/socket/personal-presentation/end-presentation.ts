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
      return sendResponseToClient({
        error: {
          code: "user_not_found",
          message: "User not found",
        },
      });
    }

    const presentation = await Presentation.findOne({
      where: {
        id: data.presentationId,
        // isPresent: true,
        ownerId: socket.userId,
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
    // await Slide.update(
    //   {
    //     isSelected: false,
    //   },
    //   {
    //     where: {
    //       presentationId: data.presentationId,
    //       isSelected: true,
    //     },
    //   },
    // );
    // await Presentation.update(
    //   {
    //     isPresent: false,
    //   },
    //   {
    //     where: {
    //       id: data.presentationId,
    //     },
    //   },
    // );
    console.log(`Client ${socket.id} end present ${data.presentationId}`);
    await socket.to(`${data.presentationId}`).emit("personal:end-present");
  } catch (error) {
    return sendResponseToClient({
      error: {
        code: "unknown_error",
        message: error.message,
      },
    });
  }
};
