import { Presentation, Question } from "../../models";
import { IQuestion, PersonalPresentationData } from "../type";

export const voteQuestion = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any,
  data: PersonalPresentationData,
  sendResponseToClient: (response) => void,
) => {
  try {
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

    console.log(`Client ${socket.id} vote question ${data.questionId}`);
    console.log(answeredQuestion);
    console.log(unAnsweredQuestion);
    socket.to(`${data.presentationId}`).emit("personal:vote-question", {
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
