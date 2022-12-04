import joi from "joi";
export const CreateSlideSchema = joi.object({
  title: joi.string().required(),
  contents: joi.array().items(joi.string()).min(1),
});
