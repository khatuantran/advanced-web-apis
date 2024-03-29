import { Presentation, Slide } from "../../models";
import { IError, ISlide, PersonalPresentationData } from "../type";

export const transferSlide = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any,
  data: PersonalPresentationData,
  sendResponseToClient: (response: ISlide[] | IError) => void,
) => {
  try {
    if (!socket.userId) {
      return sendResponseToClient({
        error: {
          code: "user_not_found",
          message: "User not found",
        },
      });
    }
    let isExist = false;
    const slides = (
      await Slide.findAll({
        where: {
          presentationId: data.presentationId,
          createdBy: socket.userId,
        },
        include: [
          {
            model: Presentation,
            as: "presentation",
          },
        ],
        order: [["createdAt", "ASC"]],
      })
    ).map((slide) => {
      if (slide.id === data.slideId) {
        isExist = true;
      }
      return {
        id: slide.id,
        title: slide.title,
        options: slide.options,
        type: slide.type,
        isSelected: slide.id === data.slideId,
        presentationId: slide.presentationId,
      } as ISlide;
    });

    if (!isExist) {
      return typeof sendResponseToClient === "function"
        ? sendResponseToClient({
            error: {
              code: "slide_not_found",
              message: "Slide not found",
            },
          })
        : null;
    }
    await Slide.update(
      {
        isSelected: false,
      },
      {
        where: {
          presentationId: data.presentationId,
          isSelected: true,
        },
      },
    );
    await Slide.update(
      {
        isSelected: true,
      },
      {
        where: {
          id: data.slideId,
        },
      },
    );
    console.log(`Client ${socket.id} transfer slide ${data.slideId}`);
    await socket.to(`${data.presentationId}`).emit("personal:transfer-slide", slides);
    sendResponseToClient(slides);
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
