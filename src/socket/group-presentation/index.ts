/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server, Socket } from "socket.io";
import { GroupPresentationData, IGroupChooseOption } from "../type";
import { chooseOptionForSlideGroup } from "./choose-option-group";
import { endGroupPresentation } from "./end-group-presentation";
import { joinGroupPresentation } from "./join-group-presentation";
import { startGroupPresentation } from "./start-group-presentation";
import { transferSlideGroup } from "./transfer-slide-group";

export const groupPresentationHandlers = (io: Server, socket: Socket) => {
  socket.on("group:start-present", async (data: GroupPresentationData, callBack: any) => {
    await startGroupPresentation(socket, data, callBack);
  });
  socket.on("group:join-present", async (data: GroupPresentationData, callBack: any) => {
    await joinGroupPresentation(socket, data, callBack);
  });
  socket.on("group:transfer-slide", async (data: GroupPresentationData, callBack: any) => {
    await transferSlideGroup(socket, data, callBack);
  });
  socket.on("group:choose-option", async (data: IGroupChooseOption, callBack: any) => {
    await chooseOptionForSlideGroup(socket, data, callBack);
  });
  socket.on("group:end-present", async (data: GroupPresentationData, callBack: any) => {
    await endGroupPresentation(socket, data, callBack);
  });
};
