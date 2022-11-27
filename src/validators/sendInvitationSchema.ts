import joi from "joi";
export const SendInvitationSchema = joi.object({
  emails: joi.array().items(joi.string().email().required()).min(1),
});
