import { Presentation, Slide } from "../../models";
import { IError, ISlide, PersonalPresentationData } from "../type";

export const startPresentation = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any,
  data: PersonalPresentationData,
  sendResponseToClient: (response: ISlide[] | IError) => void,
) => {
  try {
    console.log("Start present socket");
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
        order: [["createdAt", "ASC"]],
      })
    ).map((slide) => {
      if (slide.id == data.slideId) {
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
      return sendResponseToClient({
        error: {
          code: "slide_not_found",
          message: "Slide not found",
        },
      });
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
    await Presentation.update(
      {
        isPresent: true,
      },
      {
        where: {
          id: data.presentationId,
        },
      },
    );
    console.log(`Client ${socket.id} start present ${data.presentationId}`);
    await socket.join(`${data.presentationId}`);
    sendResponseToClient(slides);
  } catch (error) {
    return sendResponseToClient({
      error: {
        code: "unknown_error",
        message: error.message,
      },
    });
  }
};
