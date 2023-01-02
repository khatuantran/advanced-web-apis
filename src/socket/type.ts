import { ISlideOption, SlideType } from "../models";

export type ISlide = {
  id: string;
  title: string;
  options: ISlideOption[] | string;
  type: SlideType;
  isSelected: boolean;
  presentationId: string;
};

export type IError = {
  error: {
    code: string;
    message: string;
  };
};
export type GroupPresentationData = {
  groupId?: string;
  presentationId?: string;
  slideId?: string;
  userId?: string;
  message?: string;
  createdAt?: Date;
  questionId?: string;
};

export type PersonalPresentationData = {
  presentationId?: string;
  slideId?: string;
  userId?: string;
  message?: string;
  createdAt?: Date;
  questionId?: string;
};

export type IChooseOption = {
  presentationId?: string;
  slideId?: string;
  index: number;
};

export type IGroupChooseOption = {
  presentationId?: string;
  slideId?: string;
  index: number;
  groupId: string;
};

export type IChat = {
  id: string;
  content: string;
  createdAt: Date;
};

export type IGroupPresent = {
  groupId: string;
  groupName: string;
  presentationId: string;
};

export type IQuestion = {
  id: string;
  content: string;
  isAnswer: boolean;
  voteQuantity: number;
  createdAt: Date;
};
