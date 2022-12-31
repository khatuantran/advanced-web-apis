import { Group, Presentation, Slide } from "../../models";
import { isHavePermissionOwner } from "../../utils";
import { GroupPresentationData, IError, ISlide } from "../type";

export const endGroupPresentation = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any,
  data: GroupPresentationData,
  sendResponseToClient: (response: ISlide[] | IError) => void,
) => {
  try {
    console.log("Group");
    console.log("End present socket");
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

    await Group.update(
      {
        presentationId: null,
      },
      { where: { id: data.groupId } },
    );
    const presentation = await Presentation.findOne({
      where: {
        id: data.presentationId,
        isPresent: true,
      },
    });

    if (!presentation) {
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
    await Presentation.update(
      {
        isPresent: false,
      },
      {
        where: {
          id: data.presentationId,
        },
      },
    );
    console.log(`Client ${socket.id} end present ${data.presentationId}`);
    await socket.to(`${data.presentationId}`).emit("personal:end-present", { message: "end present" });
  } catch (error) {
    return sendResponseToClient({
      error: {
        code: "unknown_error",
        message: error.message,
      },
    });
  }
};
