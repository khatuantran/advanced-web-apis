/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server, Socket } from "socket.io";
import { GroupPresentationData, PersonalPresentationData } from "../type";
import { getGroupChat } from "./get-group-chat";
import { getPersonalChat } from "./get-personal-chat";
import { chatGroupPresent } from "./group-chat";
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

  socket.on("personal:get-chat", async (data: PersonalPresentationData, callBack: any) => {
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
    await getPersonalChat(socket, data, callBack);
  });

  socket.on("group:chat", async (data: GroupPresentationData, callBack: any) => {
    if (!io.sockets.adapter.rooms.has(data?.groupId)) {
      return typeof callBack === "function"
        ? callBack({
            error: {
              code: "group_room_not_found",
              message: "Personal room not found",
            },
          })
        : null;
    }
    await chatGroupPresent(socket, data, callBack);
  });

  socket.on("group:get-chat", async (data: GroupPresentationData, callBack: any) => {
    if (!io.sockets.adapter.rooms.has(data?.groupId)) {
      return typeof callBack === "function"
        ? callBack({
            error: {
              code: "group_room_not_found",
              message: "Personal room not found",
            },
          })
        : null;
    }
    await getGroupChat(socket, data, callBack);
  });
};
