import joi from "joi";
export const TransferGroupSchema = joi.object({
  userId: joi.string().uuid().required(),
});
