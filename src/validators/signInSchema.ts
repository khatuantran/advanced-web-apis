import joi from "joi";
export const SignInSchema = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
});
