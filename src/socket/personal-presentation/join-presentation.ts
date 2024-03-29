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
      return typeof sendResponseToClient === "function"
        ? sendResponseToClient({
            error: {
              code: "room_not_found",
              message: "Room not found",
            },
          })
        : null;
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
      return typeof sendResponseToClient === "function"
        ? sendResponseToClient({
            error: {
              code: "presentation_not_found",
              message: "Presentation not found",
            },
          })
        : null;
    }
    await socket.join(`${data.presentationId}`);
    console.log(`Client ${socket.id} joint presentation ${data.presentationId}`);
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
