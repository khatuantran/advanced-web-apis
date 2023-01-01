import { Op } from "sequelize";
import { Group, ISlideOption, Slide, SlideType } from "../../models";
import { isHavePermission } from "../../utils";
import { IError, IGroupChooseOption, ISlide } from "../type";

export const chooseOptionForSlideGroup = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any,
  data: IGroupChooseOption,
  sendResponseToClient: (response: ISlide[] | IError) => void,
) => {
  try {
    console.log("Group");
    console.log(`Client ${socket.id} choose ${data.index} for slide ${data.slideId}`);
    if (!socket.userId) {
      return sendResponseToClient({
        error: {
          code: "user_not_found",
          message: "User not found",
        },
      });
    }

    if (!(await isHavePermission(socket.userId, data.groupId))) {
      return sendResponseToClient({
        error: {
          code: "permission_denied",
          message: "Permission denied",
        },
      });
    }
    const group = await Group.findOne({
      where: {
        id: data.groupId,
        presentationId: data.presentationId,
      },
    });

    if (!group) {
      return sendResponseToClient({
        error: {
          code: "not_present",
          message: "No one have present",
        },
      });
    }

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
    socket.to(`${data.groupId}`).emit("group:choose-option", slides);
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
