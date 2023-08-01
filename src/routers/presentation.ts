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
presentationRouter.post("/:presentationId/create-slide", presentationOfSlide, createSlide);
presentationRouter.post("/:presentationId/slide/:slideId/edit", presentationOfSlide, editSlide);
presentationRouter.post("/:presentationId/slide/:slideId/delete", presentationOfSlide, deleteSlide);
presentationRouter.get("/:presentationId/list-slide", presentationOfSlide, listPresentationSlide);
export { presentationRouter };
