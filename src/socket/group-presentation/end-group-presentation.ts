import { Group } from "../../models";
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
    console.log(`Client ${socket.id} end present ${data.presentationId}`);
    await socket.to(`${data.groupId}`).emit("group:end-present");
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
