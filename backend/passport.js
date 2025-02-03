import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "./models/userSchema.js";
import dotenv from 'dotenv';
dotenv.config({ path: './config/.env' });

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        var familyName;
        if(profile.name.familyName == null)
        {
          familyName = ""
        }
        else{
          familyName = profile.name.familyName
        }
        if (!user) {
          user = await User.create({
            name: profile.name.givenName + " " + familyName,
            email: profile.emails[0].value,
            role: "Patient", // Bạn có thể điều chỉnh theo ý muốn
            isOAuthUser: true, // Đánh dấu người dùng này được tạo từ OAuth

          });
        }
        done(null, user);
      } catch (error) {
        done(error, false);
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
  } catch (error) {
    done(error, false);
  }
});

export default passport;
