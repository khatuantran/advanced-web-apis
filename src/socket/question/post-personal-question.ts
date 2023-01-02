import { Presentation, Question } from "../../models";
import { IQuestion, PersonalPresentationData } from "../type";

export const postQuestion = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any,
  data: PersonalPresentationData,
  sendResponseToClient: (response) => void,
) => {
  try {
    console.log("Post a question");

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

    if (!data?.message) {
      return typeof sendResponseToClient === "function"
        ? sendResponseToClient({
            error: {
              code: "message_required",
              message: "Message is required",
            },
          })
        : null;
    }

    await Question.create({
      presentationId: presentation.id,
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

    console.log(`Client ${socket.id} post question ${data.message} of present ${data.presentationId}`);

    console.log(answeredQuestion);
    console.log(unAnsweredQuestion);
    socket.to(`${data.presentationId}`).emit("personal:post-question", {
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
