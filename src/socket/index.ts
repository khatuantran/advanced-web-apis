import { Server, Socket } from "socket.io";
import { presentationHandlers } from "./presentation";
export const onConnection = (io: Server, socket: Socket) => {
  presentationHandlers(io, socket);
};
