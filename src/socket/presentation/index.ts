/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server, Socket } from "socket.io";
import { Presentation } from "../../models";
import { joinPresentation } from "./join-presentation";
import { startPresentation } from "./start-presentation";
import { transferSlide } from "./transfer-slide";
import { PersonalPresentationData } from "./type";

export const presentationHandlers = (io: Server, socket: Socket) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const socketNotType = socket as any;
  // const chooseOptionForSlide = async (
  //   presentationId: string,
  //   slideId: string,
  //   index: number,
  //   sendResponseToClient: (response: ISlide | IError) => void,
  // ) => {
  //   try {
  //     console.log(`Client ${socket.id} choose ${index} for slide ${slideId}`);
  //     const slide = await Slide.findOne({
  //       where: {
  //         id: slideId,
  //       },
  //     });
  //     if (!slide || slide.type != SlideType.MultipleChoice) {
  //       sendResponseToClient({
  //         error: {
  //           code: "group_not_found",
  //           message: "Group not found",
  //         },
  //       });
  //       console.error("slide not found");
  //       return;
  //     }
  //     const newOption = (slide.options as ISlideOption[]).map((option) => {
  //       return option.index == index
  //         ? {
  //             index: option.index,
  //             content: option.content,
  //             chooseNumber: option.chooseNumber + 1,
  //           }
  //         : option;
  //     });

  //     console.log(newOption);

  //     await slide.update({
  //       options: newOption,
  //     });

  //     sendResponseToClient({
  //       title: slide.title,
  //       options: newOption,
  //       type: slide.type,
  //     });

  //     socket.to(`${presentationId} - ${slideId}`).emit("stat", {
  //       title: slide.title,
  //       options: slide.options,
  //       type: slide.type,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const presentationToGroup = async (data: GroupPresentationData, sendResponseToClient: (response) => void) => {
  //   try {
  //     const userId = socketNotType.userId;
  //     if (!userId) {
  //       sendResponseToClient({
  //         error: {
  //           code: "user_not_found",
  //           message: "User not found",
  //         },
  //       });
  //     }
  //     const userGroup = await UserGroup.findOne({
  //       where: {
  //         userId: userId,
  //         groupId: data.groupId,
  //       },
  //     });
  //     if (!userGroup) {
  //       sendResponseToClient({
  //         error: {
  //           code: "group_not_found",
  //           message: "Group not found",
  //         },
  //       });
  //     }

  //     if (userGroup.role == GroupRole.MEMBER) {
  //       sendResponseToClient({
  //         error: {
  //           code: "group_not_found",
  //           message: "Group not found",
  //         },
  //       });
  //     }

  //     const presentation = await Presentation.findOne({
  //       where: {
  //         id: data.presentationId,
  //       },
  //       include: [
  //         {
  //           model: Slide,
  //           as: "slices",
  //         },
  //       ],
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     sendResponseToClient({ error });
  //   }
  // };

  //   socket.on("join room", (data) => joinPresentation(socket, ...data));
  // socket.on("choose", chooseOptionForSlide);
  socket.on("personal:start-present", async (data: PersonalPresentationData, callBack: any) => {
    await startPresentation(socket, data, callBack);
  });
  socket.on("personal:join-present", async (data: PersonalPresentationData, callBack: any) => {
    await joinPresentation(socket, data, callBack);
  });
  socket.on("personal:transfer-slide", async (data: PersonalPresentationData, callBack: any) => {
    await transferSlide(socket, data, callBack);
  });
  socket.on("disconnect", async () => {
    if (socketNotType.userId) {
      const effectedRows = await Presentation.update(
        {
          isPresent: false,
        },
        {
          where: {
            ownerId: socketNotType.userId,
            isPresent: true,
          },
        },
      );
      console.log(effectedRows);
      io.to(socketNotType.userId).emit("personal:end-present", { data: "hashd" });
    }
  });

  // socket.on("choose", chooseOptionForSlide);
  // socket.on("group:present", presentationToGroup);
  // socket.on("group:join", joinGroupPresent);
};
