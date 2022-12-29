// import { Server, Socket } from "socket.io";
// import { GroupRole, ISlideOption, Presentation, Slide, SlideType, UserGroup } from "../models";

// export type ISlide = {
//   title: string;
//   options: ISlideOption[] | string;
//   type: SlideType;
// };

// type GroupPresentationData = {
//   groupId: string;
//   presentationId: string;
//   slideId: string;
// };
// export const presentationHandlers = (io: Server, socket: Socket) => {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const socketNotType = socket as any;
//   const joinPresentation = async (
//     presentationId: string,
//     slideId: string,
//     sendResponseToClient: (response: ISlide) => void,
//   ) => {
//     try {
//       console.log(`Client ${socket.id} join room ${presentationId} - ${slideId}`);
//       await socket.join(`${presentationId} - ${slideId}`);
//       const slide = await Slide.findOne({
//         where: {
//           id: slideId,
//         },
//       });
//       if (!slide) {
//         sendResponseToClient({
//           title: "",
//           options: [],
//           type: SlideType.MultipleChoice,
//         });
//       }
//       sendResponseToClient({
//         title: slide.title,
//         options: slide.options,
//         type: slide.type,
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const chooseOptionForSlide = async (
//     presentationId: string,
//     slideId: string,
//     index: number,
//     sendResponseToClient: (response: ISlide) => void,
//   ) => {
//     try {
//       console.log(`Client ${socket.id} choose ${index} for slide ${slideId}`);
//       const slide = await Slide.findOne({
//         where: {
//           id: slideId,
//         },
//       });
//       if (!slide || slide.type != SlideType.MultipleChoice) {
//         console.error("slide not found");
//         return;
//       }
//       const newOption = (slide.options as ISlideOption[]).map((option) => {
//         return option.index == index
//           ? {
//               index: option.index,
//               content: option.content,
//               chooseNumber: option.chooseNumber + 1,
//             }
//           : option;
//       });

//       console.log(newOption);

//       await slide.update({
//         options: newOption,
//       });

//       sendResponseToClient({
//         title: slide.title,
//         options: newOption,
//         type: slide.type,
//       });

//       socket.to(`${presentationId} - ${slideId}`).emit("stat", {
//         title: slide.title,
//         options: slide.options,
//         type: slide.type,
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const presentationToGroup = async (data: GroupPresentationData, sendResponseToClient: (response) => void) => {
//     try {
//       const userId = socketNotType.userId;
//       if (!userId) {
//         sendResponseToClient({
//           error: {
//             code: "user_not_found",
//             message: "User not found",
//           },
//         });
//       }
//       const userGroup = await UserGroup.findOne({
//         where: {
//           userId: userId,
//           groupId: data.groupId,
//         },
//       });
//       if (!userGroup) {
//         sendResponseToClient({
//           error: {
//             code: "group_not_found",
//             message: "Group not found",
//           },
//         });
//       }

//       if (userGroup.role == GroupRole.MEMBER) {
//         sendResponseToClient({
//           error: {
//             code: "group_not_found",
//             message: "Group not found",
//           },
//         });
//       }

//       const presentation = await Presentation.findOne({
//         where: {
//           id: data.presentationId,
//         },
//         include: [
//           {
//             model: Slide,
//             as: "slices",
//           },
//         ],
//       });
//     } catch (error) {
//       console.log(error);
//       sendResponseToClient({ error });
//     }
//   };

//   socket.on("join room", joinPresentation);
//   socket.on("choose", chooseOptionForSlide);
//   socket.on("personal:present", joinPresentation);
//   socket.on("choose", chooseOptionForSlide);
//   socket.on("group:present", presentationToGroup);
//   socket.on("group:join", joinGroupPresent);
// };
