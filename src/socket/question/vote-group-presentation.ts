import { Question } from "../../models";
import { isHavePermission } from "../../utils";
import { GroupPresentationData, IQuestion } from "../type";

export const voteGroupQuestion = async (
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

    const question = await Question.findOne({
      where: {
        id: data?.questionId,
        presentationId: data.presentationId,
      },
    });

    if (!question) {
      return typeof sendResponseToClient === "function"
        ? sendResponseToClient({
            error: {
              code: "question_not_found",
              message: "Question not found",
            },
          })
        : null;
    }

    await question.update({
      voteQuantity: question.voteQuantity + 1,
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
    console.log(`Client ${socket.id} vote question ${data.questionId}`);
    console.log(answeredQuestion);
    console.log(unAnsweredQuestion);
    socket.to(`${data.groupId}`).emit("group:vote-question", {
      answeredQuestionList: answeredQuestion.length > 0 ? answeredQuestion : [],
      unAnsweredQuestionList: unAnsweredQuestion.length > 0 ? unAnsweredQuestion : [],
    });
    sendResponseToClient({
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
