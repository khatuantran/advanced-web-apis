import { ISlideOption, Slide, SlideType } from "../../models";
import { IChooseOption, IError, ISlide } from "./type";

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
          createdBy: socket.userId,
        },
        order: [["createdAt", "ASC"]],
      })
    ).map((slide, index) => {
      if (data.slideId === slide.id) {
        slideIndex = index;
      }
      return {
        title: slide.title,
        options: slide.options,
        type: slide.type,
        isSelected: slide.id === data.slideId,
        presentationId: slide.presentationId,
      } as ISlide;
    });

    const slide = slides.find((s) => s.id === data.slideId);

    if (!slide || slide.type != SlideType.MultipleChoice) {
      console.error("slide not found");
      return sendResponseToClient({
        error: {
          code: "slide_not_found",
          message: "Slide not found",
        },
      });
    }

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

    if (slideIndex === -1) {
      console.log("slide index = -1");
      return sendResponseToClient({
        error: {
          code: "slide_not_found",
          message: "Slide not found",
        },
      });
    }

    slides[slideIndex].options = newOption;
    sendResponseToClient(slides);

    // socket.to(`${presentationId} - ${slideId}`).emit("stat", {
    //   title: slide.title,
    //   options: slide.options,
    //   type: slide.type,
    // });
  } catch (error) {
    return sendResponseToClient({
      error: {
        code: "unknown_error",
        message: error.message,
      },
    });
  }
};
