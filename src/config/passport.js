const crypto = require("crypto");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

const { User } = require("../models/index");

const BASE_URL = "http://127.0.0.1:8000";

// GOOGLE OAUTH
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// FACEBOOK OAUTH
const FACEBOOK_CLIENT_ID = process.env.FB_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FB_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${BASE_URL}/api/auth/google/callback`,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      const user = await User.findOrCreate({
        where: { id: profile.id },
        defaults: {
          email: profile.emails[0].value,
          username: profile.displayName,
          photoProfile: profile.photos[0].value,
          password: crypto.createHash("sha256").digest("hex"),
        },
      });

      done(null, profile);
    }
  )
);

// FACEBOOK OAUTH
passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
      callbackURL: `${BASE_URL}/api/auth/facebook/callback`,
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await User.findOrCreate({
        where: { id: profile.id },
        defaults: {
          email: profile.emails[0].value,
          username: profile.displayName,
          photoProfile: profile.photos[0].value,
          password: crypto.createHash("sha256").digest("hex"),
        },
      });

      done(null, profile);
    }
  )
);

passport.serializeUser((profile, done) => {
  done(null, profile.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findOne({ where: { id } });
  done(null, user);
});
