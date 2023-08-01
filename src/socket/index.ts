import { Server, Socket } from "socket.io";
import { chatPresentationHandlers } from "./chat";
import { groupPresentationHandlers } from "./group-presentation";
import { personalPresentationHandlers } from "./personal-presentation";
import { questionPresentationHandlers } from "./question";
export const onConnection = (io: Server, socket: Socket) => {
  personalPresentationHandlers(io, socket);
  groupPresentationHandlers(io, socket);
  chatPresentationHandlers(io, socket);
  questionPresentationHandlers(io, socket);
};
