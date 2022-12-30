import { Op } from "sequelize";
import { Presentation, Slide } from "../../models";
import { IError, ISlide, PersonalPresentationData } from "../type";

export const joinPresentation = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any,
  data: PersonalPresentationData,
  sendResponseToClient: (response: ISlide[] | IError) => void,
) => {
  try {
    console.log("Join present socket");
    if (!data.presentationId) {
      return sendResponseToClient({
        error: {
          code: "room_not_found",
          message: "Room not found",
        },
      });
    }

    const slides = (
      await Slide.findAll({
        where: {
          presentationId: data.presentationId,
          createdBy: {
            [Op.ne]: null,
          },
        },
        include: [
          {
            model: Presentation,
            as: "presentation",
            where: {
              isPresent: true,
            },
          },
        ],
        order: [["createdAt", "ASC"]],
      })
    ).map((slide) => {
      return {
        id: slide.id,
        title: slide.title,
        options: slide.options,
        type: slide.type,
        isSelected: slide.isSelected,
        presentationId: slide.presentationId,
      } as ISlide;
    });

    if (!slides || slides.length === 0) {
      return sendResponseToClient({
        error: {
          code: "slide_not_found",
          message: "Slide not found",
        },
      });
    }
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
