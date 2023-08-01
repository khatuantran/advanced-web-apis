/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server, Socket } from "socket.io";
import { GroupPresentationData, PersonalPresentationData } from "../type";
import { getGroupQuestion } from "./get-group-question";
import { getPersonalQuestionList } from "./get-personal-question";
import { markAsReadGroupQuestion } from "./mark-read-group-question";
import { markAsReadPersonalQuestion } from "./mark-read-personal-question";
import { postGroupQuestion } from "./post-group-question";
import { postQuestion } from "./post-personal-question";
import { voteGroupQuestion } from "./vote-group-presentation";
import { voteQuestion } from "./vote-personal-question";
export const questionPresentationHandlers = (io: Server, socket: Socket) => {
  socket.on("personal:get-question", async (data: PersonalPresentationData, callBack: any) => {
    await getPersonalQuestionList(socket, data, callBack);
  });
  socket.on("personal:post-question", async (data: PersonalPresentationData, callBack: any) => {
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
    await postQuestion(socket, data, callBack);
  });

  socket.on("personal:vote-question", async (data: PersonalPresentationData, callBack: any) => {
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
    await voteQuestion(socket, data, callBack);
  });

  socket.on("personal:mark-as-read", async (data: PersonalPresentationData, callBack: any) => {
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
    await markAsReadPersonalQuestion(socket, data, callBack);
  });

  // group
  socket.on("group:get-question", async (data: GroupPresentationData, callBack: any) => {
    await getGroupQuestion(socket, data, callBack);
  });

  socket.on("group:post-question", async (data: GroupPresentationData, callBack: any) => {
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
    await postGroupQuestion(socket, data, callBack);
  });

  socket.on("group:vote-question", async (data: GroupPresentationData, callBack: any) => {
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
    await voteGroupQuestion(socket, data, callBack);
  });

  socket.on("group:mark-as-read", async (data: GroupPresentationData, callBack: any) => {
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
    await markAsReadGroupQuestion(socket, data, callBack);
  });
};
