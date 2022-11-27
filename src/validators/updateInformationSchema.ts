import joi from "joi";
export const UpdateInformationSchema = joi.object({
  fullName: joi.string().required(),
});
