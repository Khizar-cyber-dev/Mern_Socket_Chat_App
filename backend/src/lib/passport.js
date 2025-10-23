import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../model/User.js";
import dotenv from 'dotenv';

dotenv.config();

const callbackBase = process.env.SERVER_URL + "/api/auth";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${callbackBase}/google/callback`,
    },
    async (profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            fullname: profile.displayName,
            username: email.split("@")[0],
            email,
            provider: "google",
            providerId: profile.id,
            avatar: profile.photos?.[0]?.value,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${callbackBase}/github/callback`,
      scope: ["user:email"],
    },
    async (profile, done) => {
      try {
        const email =
          profile.emails?.[0]?.value || `${profile.username}@github.com`;
        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            fullname: profile.displayName || profile.username,
            username: profile.username,
            email,
            provider: "github",
            providerId: profile.id,
            avatar: profile.photos?.[0]?.value,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default passport;
