import "dotenv/config";
import { PassportStatic } from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User, UserStatus } from "../models/user.model";
export interface ITokenPayload {
  id: string;
  tokenCounter: number;
}
export const applyPassportStrategy = (passport: PassportStatic) => {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.AUTH_SECRET ? process.env.AUTH_SECRET : "",
  };
  passport.use(
    new Strategy(options, async (payload: ITokenPayload, done) => {
      try {
        const user = await User.findOne({
          where: {
            id: payload.id,
            status: UserStatus.ACTIVE,
          },
        });
        if (!user || user.tokenCounter != payload.tokenCounter) {
          return done(null, false);
        }
        return done(null, {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          password: user.password,
          tokenCounter: user.tokenCounter,
        });
      } catch (err) {
        return done(err, false);
      }
    }),
  );
};
