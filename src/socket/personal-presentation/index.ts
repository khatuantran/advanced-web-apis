/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server, Socket } from "socket.io";
import { IChooseOption, PersonalPresentationData } from "../type";
import { chooseOptionForSlide } from "./choose-option";
import { endPresentation } from "./end-presentation";
import { joinPresentation } from "./join-presentation";
import { startPresentation } from "./start-presentation";
import { transferSlide } from "./transfer-slide";

export const personalPresentationHandlers = (io: Server, socket: Socket) => {
  socket.on("personal:start-present", async (data: PersonalPresentationData, callBack: any) => {
    await startPresentation(socket, data, callBack);
  });
  socket.on("personal:join-present", async (data: PersonalPresentationData, callBack: any) => {
    await joinPresentation(socket, data, callBack);
  });
  socket.on("personal:transfer-slide", async (data: PersonalPresentationData, callBack: any) => {
    await transferSlide(socket, data, callBack);
  });
  socket.on("personal:choose-option", async (data: IChooseOption, callBack: any) => {
    await chooseOptionForSlide(socket, data, callBack);
  });
  socket.on("personal:end-present", async (data: PersonalPresentationData, callBack: any) => {
    await endPresentation(socket, data, callBack);
  });
  // socket.on("disconnect", async () => {
  //   if (socketNotType.userId) {
  //     const presentation = await Presentation.findOne({
  //       where: {
  //         ownerId: socketNotType.userId,
  //         isPresent: true,
  //       },
  //     });
  //     if (presentation) {
  //       console.log(`Client ${socket.id} disconnected, update present ${presentation.id}`);
  //       await presentation.update({
  //         isPresent: false,
  //       });

  //       const group = await Group.findOne({
  //         where: {
  //           presentationId: presentation.id,
  //         },
  //       });

  //       if (group) {
  //         console.log(`Client ${socket.id} disconnected, update group present ${presentation.id}`);
  //         await group.update({
  //           presentationId: null,
  //         });
  //       }
  //       socket.to(`${presentation.id}`).emit("personal:end-present");
  //     }
  //   }
  // });
};
