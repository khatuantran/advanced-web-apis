import { Op } from "sequelize";
import { ISlideOption, Slide, SlideType } from "../../models";
import { IChooseOption, IError, ISlide } from "../type";

export const chooseOptionForSlide = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any,
  data: IChooseOption,
  sendResponseToClient: (response: ISlide[] | IError) => void,
) => {
  try {
    console.log(`Client ${socket.id} choose ${data.index} for slide ${data.slideId}`);

    let slideIndex = -1;
    const slides = (
      await Slide.findAll({
        where: {
          presentationId: data.presentationId,
          createdBy: {
            [Op.ne]: null,
          },
        },
        order: [["createdAt", "ASC"]],
      })
    ).map((slide, index) => {
      if (data.slideId === slide.id) {
        slideIndex = index;
      }
      return {
        id: slide.id,
        title: slide.title,
        options: slide.options,
        type: slide.type,
        isSelected: slide.isSelected,
        presentationId: slide.presentationId,
      } as ISlide;
    });

    if (slideIndex === -1 || slides[slideIndex].type !== SlideType.MultipleChoice) {
      return sendResponseToClient({
        error: {
          code: "slide_not_found",
          message: "Slide not found",
        },
      });
    }
    const slide = slides[slideIndex];

    const newOption = (slide.options as ISlideOption[]).map((option) => {
      return option.index == data.index
        ? {
            index: option.index,
            content: option.content,
            chooseNumber: option.chooseNumber + 1,
          }
        : option;
    });
    await Slide.update(
      {
        options: newOption,
      },
      {
        where: { id: slide.id },
      },
    );

    slides[slideIndex].options = newOption;
    sendResponseToClient(slides);
    socket.to(`${data.presentationId}`).emit("personal:choose-option", slides);
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
