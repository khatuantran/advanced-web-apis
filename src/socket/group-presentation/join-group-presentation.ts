import { Op } from "sequelize";
import { Group, Presentation, Slide } from "../../models";
import { isHavePermission } from "../../utils";
import { GroupPresentationData, IError, ISlide } from "../type";

export const joinGroupPresentation = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any,
  data: GroupPresentationData,
  sendResponseToClient: (response: ISlide[] | IError) => void,
) => {
  try {
    console.log("Group");

    console.log("Join group present socket");
    if (!data.presentationId) {
      return sendResponseToClient({
        error: {
          code: "room_not_found",
          message: "Room not found",
        },
      });
    }

    if (await isHavePermission(socket.userId, data.groupId)) {
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
      },
    });

    if (group.presentationId || group?.presentationId != data.presentationId) {
      console.log("Group not have presentation or presentationId different");
      return sendResponseToClient({
        error: {
          code: "not_present",
          message: "No one have present",
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
            // where: {
            //   isPresent: true,
            // },
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
    await socket.join(`${data.groupId}`);
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
