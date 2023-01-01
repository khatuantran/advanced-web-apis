/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server, Socket } from "socket.io";
import { PersonalPresentationData } from "../type";
import { getPersonalQuestionList } from "./get-personal-question";
export const questionPresentationHandlers = (io: Server, socket: Socket) => {
  socket.on("personal:get-question", async (data: PersonalPresentationData, callBack: any) => {
    await getPersonalQuestionList(socket, data, callBack);
  });
  //   socket.on("personal:chat", async (data: PersonalPresentationData, callBack: any) => {
  //     if (!io.sockets.adapter.rooms.has(data?.presentationId)) {
  //       return typeof callBack === "function"
  //         ? callBack({
  //             error: {
  //               code: "personal_room_not_found",
  //               message: "Personal room not found",
  //             },
  //           })
  //         : null;
  //     }
  //     await chatPersonalPresent(socket, data, callBack);
  //   });

  //   socket.on("group:chat", async (data: GroupPresentationData, callBack: any) => {
  //     if (!io.sockets.adapter.rooms.has(data?.groupId)) {
  //       return typeof callBack === "function"
  //         ? callBack({
  //             error: {
  //               code: "group_room_not_found",
  //               message: "Personal room not found",
  //             },
  //           })
  //         : null;
  //     }
  //     await chatGroupPresent(socket, data, callBack);
  //   });

  //   socket.on("group:get-chat", async (data: GroupPresentationData, callBack: any) => {
  //     await getGroupChat(socket, data, callBack);
  //   });
};
