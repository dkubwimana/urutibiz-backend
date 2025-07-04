import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import config from './config';

export const configurePassport = (): void => {
  // JWT Strategy
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwt.secret,
      },
      async (_payload, done) => {
        try {
          // TODO: Implement user lookup from database
          // const user = await findUserById(payload.userId);
          // if (user) {
          //   return done(null, user);
          // }
          return done(null, false);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  // Local Strategy
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (_email, _password, done) => {
        try {
          // TODO: Implement user authentication
          // const user = await authenticateUser(email, password);
          // if (user) {
          //   return done(null, user);
          // }
          return done(null, false, { message: 'Invalid credentials' });
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Serialize and deserialize user for session management
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (_id: string, done) => {
    try {
      // TODO: Implement user lookup from database
      // const user = await findUserById(id);
      // done(null, user);
      done(null, null);
    } catch (error) {
      done(error);
    }
  });
};
