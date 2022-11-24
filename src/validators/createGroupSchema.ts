import joi from "joi";
export const CreateGroupSchema = joi.object({
  name: joi.string().required(),
});
