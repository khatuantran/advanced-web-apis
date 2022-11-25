import joi from "joi";
export const SignInSchema = joi.object({
  email: joi.string().required(),
  password: joi.string().required(),
});
