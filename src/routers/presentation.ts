import express from "express";
import { createPresentation, deletePresentation, listUserPresentation } from "../controllers";
const presentationRouter = express.Router();
presentationRouter.post("/create-presentation", createPresentation);
presentationRouter.get("/list-presentation", listUserPresentation);
presentationRouter.post("/:presentationId/delete", deletePresentation);
export { presentationRouter };
