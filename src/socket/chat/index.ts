/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server, Socket } from "socket.io";
import { PersonalPresentationData } from "../type";
import { chatPersonalPresent } from "./personal-chat";
export const chatPresentationHandlers = (io: Server, socket: Socket) => {
  socket.on("personal:chat", async (data: PersonalPresentationData, callBack: any) => {
    if (!io.sockets.adapter.rooms.has(data?.presentationId)) {
      return typeof callBack === "function"
        ? callBack({
            error: {
              code: "personal_room_not_found",
              message: "Personal room not found",
            },
          })
        : null;
    }
    await chatPersonalPresent(socket, data, callBack);
  });
  //   socket.on("group:join-present", async (data: GroupPresentationData, callBack: any) => {
  //     if (!io.sockets.adapter.rooms[data?.groupId]) {
  //       return typeof callBack === "function"
  //         ? callBack({
  //             error: {
  //               code: "group_room_not_found",
  //               message: "Personal room not found",
  //             },
  //           })
  //         : null;
  //     }
  //     await startPresentation(socket, data, callBack);
  //     await joinPresentation(socket, data, callBack);
  //   });
};
