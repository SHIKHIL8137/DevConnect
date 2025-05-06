import passport from "passport";
import GoogleStrategy from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../model/userModel.js';
import { generateUserId } from "../util/reuseFunctions.js";

dotenv.config();

passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile?.emails?.[0]?.value;
        if (!email) {
          throw new Error('Google profile does not contain an email address.');
        }

        const role = req.query.role || req.query.state || 'client';

        let user = await User.findOne({ $or: [{ googleId: profile.id }, { email }] });
        if (user) {
          if (user.block) {
            req.blockedUser = true;
            return done(null, false, { message: 'User is blocked' });
          }
          return done(null, user);
        }

        if (!user) {
          let baseUserName = profile.displayName.trim().replace(/\s+/g, '_'); 
          let userName = baseUserName;
          let suffix = 1;

          while (await User.findOne({ userName })) {
            userName = `${baseUserName}_${suffix++}`;
          }

          user = new User({
            userName,
            email,
            googleId: profile.id,
            userId: generateUserId(),
            role
          });

          await user.save();
        }

        return done(null, user);
      } catch (error) {
        console.error('Error during Google authentication:', error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
