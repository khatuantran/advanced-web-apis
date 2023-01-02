import { Group, Slide } from "../../models";
import { isHavePermissionOwner } from "../../utils";
import { GroupPresentationData, IError, ISlide } from "../type";

export const startGroupPresentation = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any,
  data: GroupPresentationData,
  sendResponseToClient: (response: ISlide[] | IError) => void,
) => {
  try {
    console.log("Group");
    console.log("Start group present socket");
    if (!socket.userId) {
      return sendResponseToClient({
        error: {
          code: "user_not_found",
          message: "User not found",
        },
      });
    }

    if (!(await isHavePermissionOwner(socket.userId, data.groupId))) {
      return sendResponseToClient({
        error: {
          code: "permission_denied",
          message: "Permission denied",
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

    const group = await Group.findOne({
      where: {
        id: data.groupId,
      },
    });

    // if (group.presentationId) {
    //   return sendResponseToClient({
    //     error: {
    //       code: "group_have_another_present",
    //       message: "One presentation are present in group",
    //     },
    //   });
    // }

    await group.update({
      presentationId: data.presentationId,
    });
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
    console.log(`Client ${socket.id} start present ${data.presentationId}`);
    await socket.join(`${data.groupId}`);
    socket.to(`${data.groupId}`).emit("group:start-present", {
      groupId: data.groupId,
      groupName: group.name,
      presentationId: data.presentationId,
    });
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
