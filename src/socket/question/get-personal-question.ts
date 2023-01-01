import { Question } from "../../models";
import { GroupPresentationData, IQuestion } from "../type";

export const getPersonalQuestionList = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any,
  data: GroupPresentationData,
  sendResponseToClient: (response) => void,
) => {
  try {
    console.log("Start group chat socket");

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

    console.log(`Client ${socket.id} push a chat to ${data.presentationId}`);
    // await socket.to(`${data.groupId}`).emit("group:get-chat", chatData);
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
