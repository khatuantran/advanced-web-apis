import * as Joi from "Joi";
export const SignInSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
