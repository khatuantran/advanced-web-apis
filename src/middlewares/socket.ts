import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { User } from "../models";
import { ITokenPayload } from "./passport";
export const verifyUserForSocket = async (socket: Socket, next: (err?: ExtendedError) => void) => {
  const token = socket.handshake?.auth?.token;
  if (token) {
    const secretKey = process.env.AUTH_SECRET;
    const decoded = jwt.verify(token, secretKey) as ITokenPayload;

    const user = await User.findOne({
      where: {
        id: decoded.id,
        tokenCounter: decoded.tokenCounter,
      },
    });

    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (socket as any).userId = decoded.id;
    }
  }
  next();
};
