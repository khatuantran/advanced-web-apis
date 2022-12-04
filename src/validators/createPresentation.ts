import joi from "joi";
export const CreatePresentationSchema = joi.object({
  name: joi.string().required(),
});
