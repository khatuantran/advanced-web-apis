import joi from "joi";
export const RegisterSchema = joi.object({
  fullName: joi.string().required(),
  username: joi.string().required(),
  password: joi.string().required(),
  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .allow(null),
});
