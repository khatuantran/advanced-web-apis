import { Server, Socket } from "socket.io";
import { ISlideOption, Slide, SlideType } from "../models";

export type ISlide = {
  title: string;
  options: ISlideOption[] | string;
  type: SlideType;
};
export const presentationHandlers = (io: Server, socket: Socket) => {
  const joinPresentation = async (presentationId: string, slideId: string, callback: (response: ISlide) => void) => {
    try {
      console.log(`Client ${socket.id} join room ${presentationId} - ${slideId}`);
      await socket.join(`${presentationId} - ${slideId}`);
      const slide = await Slide.findOne({
        where: {
          id: slideId,
        },
      });
      if (!slide) {
        callback({
          title: "",
          options: [],
          type: SlideType.MultipleChoice,
        });
      }
      callback({
        title: slide.title,
        options: slide.options,
        type: slide.type,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const chooseOptionForSlide = async (
    presentationId: string,
    slideId: string,
    index: number,
    callback: (response: ISlide) => void,
  ) => {
    try {
      console.log(`Client ${socket.id} choose ${index} for slide ${slideId}`);
      const slide = await Slide.findOne({
        where: {
          id: slideId,
        },
      });

      const newOption = (slide.options as ISlideOption[]).map((option) => {
        return option.index == index
          ? {
              index: option.index,
              content: option.content,
              chooseNumber: option.chooseNumber + 1,
            }
          : option;
      });

      console.log(newOption);

      await slide.update({
        options: newOption,
      });

      callback({
        title: slide.title,
        options: newOption,
        type: slide.type,
      });

      socket.to(`${presentationId} - ${slideId}`).emit("stat", {
        title: slide.title,
        options: slide.options,
        type: slide.type,
      });
    } catch (error) {
      console.log(error);
    }
  };
  socket.on("join room", joinPresentation);
  socket.on("choose", chooseOptionForSlide);
};
