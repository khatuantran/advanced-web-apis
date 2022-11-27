import joi from "joi";
export const VerifyGoogleSchema = joi.object({
  email: joi.string().required(),
  fullName: joi.string().required(),
});
