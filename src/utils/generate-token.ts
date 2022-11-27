import "dotenv/config";
import jwt from "jsonwebtoken";
export const generateToken = (userId: string, tokenCounter: number) => {
  const token = jwt.sign(
    {
      id: userId,
      tokenCounter: tokenCounter,
    },
    process.env.AUTH_SECRET,
    { expiresIn: "360 days" },
  );
  return token;
};
