import "dotenv/config";
import jwt from "jsonwebtoken";
import { ITokenPayload } from "../middlewares";
import { User } from "../models";
export const verifySocketToken = async (token: string) => {
  try {
    const secretKey = process.env.AUTH_SECRET;
    const decoded = jwt.verify(token, secretKey) as ITokenPayload;

    const user = await User.findOne({
      where: {
        id: decoded.id,
        tokenCounter: decoded.tokenCounter,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
};
