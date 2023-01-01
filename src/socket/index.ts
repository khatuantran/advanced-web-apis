import { Server, Socket } from "socket.io";
import { chatPresentationHandlers } from "./chat";
import { groupPresentationHandlers } from "./group-presentation";
import { personalPresentationHandlers } from "./personal-presentation";
export const onConnection = (io: Server, socket: Socket) => {
  personalPresentationHandlers(io, socket);
  groupPresentationHandlers(io, socket);
  chatPresentationHandlers(io, socket);
};
