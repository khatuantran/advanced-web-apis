import joi from "joi";
export const ChangePasswordSchema = joi.object({
  oldPassword: joi.string().required(),
  newPassword: joi.string().required(),
});
