import { Server, Socket } from "socket.io";
import { personalPresentationHandlers } from "./presentation";
export const onConnection = (io: Server, socket: Socket) => {
  personalPresentationHandlers(io, socket);
};
