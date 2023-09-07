const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
import User from "../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import imageUrlToBase64 from "../utils/imageUrlToBase64";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.DEV_URL}/auth/google/callback`,
      passReqToCallback: true,
      scope: ["profile", "email"],
    },
    //@ts-ignore
    async function (req, accessToken, refreshToken, profile, cb) {
      console.log(
        "Google Auth Called with info",
        profile,
        accessToken,
        refreshToken
      );
      try {
        // Deferencing value from payload
        const { id, name, emails, photos } = profile;
        const { familyName, givenName } = name;
        const userEmail =
          emails && profile.emails.length > 0 ? profile.emails[0].value : null;
        const pictureUrl = photos && photos.length > 0 ? photos[0].value : null;
        const base64Picture = await imageUrlToBase64(pictureUrl)

        // Find existing User by googleId
        const existingUser = await User.findOne({ where: { googleId: id } });
        if (existingUser) {
          console.log("User found:", existingUser);
          return cb(null, existingUser);
        }

        // Create a new User with all required fields
        const newUser = await User.create({
          googleId: id,
          firstName: givenName,
          lastName: familyName,
          email: userEmail,
          profilePicture: base64Picture,
        });

        console.log("New Google User created", newUser);
        return cb(null, newUser);
      } catch (err) {
        console.error("Error creating Google user", err);
        return cb(err);
      }
    }
  )
);
// @ts-ignore
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
// @ts-ignore
passport.deserializeUser(async function (id, done) {
    // @ts-ignore
    try {
        const user = await User.findOne({ where: {id: id}});
        done('', user);
    } catch (err) {
        done(err, null);
    }
});

export default passport;
