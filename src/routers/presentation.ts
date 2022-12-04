import express from "express";
import {
  createPresentation,
  createSlide,
  deletePresentation,
  deleteSlide,
  editPresentation,
  editSlide,
  listPresentationSlide,
  listUserPresentation,
} from "../controllers";
import { presentationOfSlide } from "../middlewares";
const presentationRouter = express.Router();
presentationRouter.post("/create-presentation", createPresentation);
presentationRouter.get("/list-presentation", listUserPresentation);
presentationRouter.post("/:presentationId/delete", deletePresentation);
presentationRouter.post("/:presentationId/edit", editPresentation);
presentationRouter.post("/:presentationId/slide/:slideId/create-slide", presentationOfSlide, createSlide);
presentationRouter.post("/:presentationId/slide/:slideId/edit-slide", presentationOfSlide, editSlide);
presentationRouter.post("/:presentationId/slide/:slideId/delete-slide", presentationOfSlide, deleteSlide);
presentationRouter.post("/:presentationId/slide/list-slide", presentationOfSlide, listPresentationSlide);
export { presentationRouter };
