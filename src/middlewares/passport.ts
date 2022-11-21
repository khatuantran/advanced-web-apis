import "dotenv/config";
import { PassportStatic } from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../models/user.model";
export const applyPassportStrategy = (passport: PassportStatic) => {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.AUTH_SECRET ? process.env.AUTH_SECRET : "",
  };
  passport.use(
    new Strategy(options, async (payload, done) => {
      try {
        const user = await User.findOne({
          where: {
            id: payload.id,
          },
        });
        if (!user) {
          return done(null, false);
        }
        return done(null, {
          id: user.id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          password: user.password,
        });
      } catch (err) {
        return done(err, false);
      }
    }),
  );
};
