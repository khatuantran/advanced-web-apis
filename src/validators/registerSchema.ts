import * as Joi from "Joi";
export const RegisterSchema = Joi.object({
  fullName: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .allow(null),
});
