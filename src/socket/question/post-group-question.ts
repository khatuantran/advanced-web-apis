import { Presentation, Question } from "../../models";
import { isHavePermission } from "../../utils";
import { GroupPresentationData, IQuestion } from "../type";

export const postGroupQuestion = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any,
  data: GroupPresentationData,
  sendResponseToClient: (response) => void,
) => {
  try {
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
    // const group = await Group.findOne({
    //   where: {
    //     id: data.groupId,
    //     presentationId: data.presentationId,
    //   },
    // });

    // if (!group || !group.presentationId || group?.presentationId !== data.presentationId) {
    //   console.log("group not present");
    //   return typeof sendResponseToClient === "function"
    //     ? sendResponseToClient({
    //         error: {
    //           code: "presentation_not_found",
    //           message: "Presentation not found",
    //         },
    //       })
    //     : null;
    // }

    const presentation = await Presentation.findOne({
      where: {
        id: data?.presentationId,
      },
    });

    if (!presentation) {
      return typeof sendResponseToClient === "function"
        ? sendResponseToClient({
            error: {
              code: "presentation_not_found",
              message: "Presentation not found",
            },
          })
        : null;
    }
    await Question.create({
      presentationId: data?.presentationId,
      content: data.message,
      isAnswer: false,
      voteQuantity: 0,
    });

    const answeredQuestion = [] as IQuestion[];
    const unAnsweredQuestion = [] as IQuestion[];
    (
      await Question.findAll({
        where: {
          presentationId: data.presentationId,
        },
        order: [["createdAt", "DESC"]],
      })
    ).forEach((question) => {
      question.isAnswer
        ? answeredQuestion.push({
            id: question.id,
            content: question.content,
            voteQuantity: question.voteQuantity,
            isAnswer: question.isAnswer,
            createdAt: question.createdAt,
          } as IQuestion)
        : unAnsweredQuestion.push({
            id: question.id,
            content: question.content,
            voteQuantity: question.voteQuantity,
            isAnswer: question.isAnswer,
            createdAt: question.createdAt,
          } as IQuestion);
    });

    console.log("Group");
    console.log(`Client ${socket.id} post question ${data.message} of present ${data.presentationId}`);
    // await socket.to(`${data.groupId}`).emit("group:get-chat", chatData);
    sendResponseToClient({
      answeredQuestionList: answeredQuestion.length > 0 ? answeredQuestion : [],
      unAnsweredQuestionList: unAnsweredQuestion.length > 0 ? unAnsweredQuestion : [],
    });
    socket.to(`${data.groupId}`).emit("group:post-question", {
      answeredQuestionList: answeredQuestion.length > 0 ? answeredQuestion : [],
      unAnsweredQuestionList: unAnsweredQuestion.length > 0 ? unAnsweredQuestion : [],
    });
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
