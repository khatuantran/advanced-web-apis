import express from "express";
import { createGroup } from "../controllers/group/create-group";
import { listGroup } from "../controllers/group/list-group";
const groupRouter = express.Router();
groupRouter.post("/create", createGroup);
groupRouter.get("/list-group", listGroup);
export default groupRouter;
