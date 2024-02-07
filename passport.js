const GithubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("./models/user");

const GOOGLE_CLIENT_ID =
  "812271762583-t5kh3j398kngltlr5dihhiv18pdfr6he.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

GITHUB_CLIENT_ID = "add54727787114148f25";
GITHUB_CLIENT_SECRET = "42b4444a1822a615b5a6f5d27d1ec37b540419f4";

FACEBOOK_APP_ID = "3656849411195234";
FACEBOOK_APP_SECRET = "f1d72ab7cc88f263576db4877688c2c3";

// PASSPORT STRATEGY FOR GOOGLE

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,

      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, acccessToken, refreshToken, profile, cb) => {
      // console.log("Acess Token Refresh Token", acccessToken);
      // console.log("refresh token", refreshToken);
      const { id, name, emails, photos } = profile;
      // console.log(id);
      // console.log(name);
      // console.log(emails);
      // console.log(photos);
      // console.log(profile);
      const email = emails[0].value;
      const emailVerified = emails[0].verified;
      const fullName = `${name.givenName} ${name.familyName}`;
      const profilePic = photos[0].value;

      if (emailVerified && email) {
        try {
          let user = await User.findOne({
            accountId: id,
          });

          if (!user) {
            const createnewUser = new User({
              accountId: id,
              name: fullName,
              email,
              picture: profilePic,
            });

            const newUser = await createnewUser.save();
            return cb(null, newUser);
          } else {
            return cb(null, user);
          }
        } catch (error) {
          cb(new Error(error.message), null);
        }
      } else {
        return cb(new Error("Email Not verified", null));
      }
    }
  )
);

//---------------------------------------------------------------------------------------------------------------------

// PASSPORT STRATEGY FOR GITHUB

passport.use(
  new GithubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/github/callback",
    },
    async (req, acccessToken, refreshToken, profile, cb) => {
      console.log("Acess Token Refresh Token", acccessToken);
      console.log("refresh token", refreshToken);
      const { id, username, photos, profileUrl, provider } = profile;
      const profilePic = photos[0].value;
      //  console.log(id);
      //  console.log(username);
      //  console.log(profileUrl);
      //  console.log(profilePic);
      //  console.log(provider);
      //  console.log(profile);
      if (username) {
        try {
          let user = await User.findOne({
            accountId: id,
          });
          console.log(user);
          if (!user) {
            const createnewUser = new User({
              accountId: id,
              name: username,
              email: profileUrl,
              picture: profilePic,
              provider: provider,
            });

            const newUser = await createnewUser.save();
            return cb(null, newUser);
          } else {
            return cb(null, user);
          }
        } catch (error) {
          cb(new Error(error.message), null);
        }
      } else {
        return cb(new Error("Email Not verified", null));
      }
    }
  )
);

//---------------------------------------------------------------------------------------------------------------------

// PASSPORT STRATEGY FOR FACEBOOK

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:5000/auth/facebook/callback",
    },
    async (req, acccessToken, refreshToken, profile, cb) => {
      // console.log("Acess Token Refresh Token", acccessToken);
      // console.log("refresh token", refreshToken);
      const { id, name, emails, photos } = profile;
      console.log(id);
      console.log(name);
      console.log(emails);
      console.log(photos);
      console.log(profile);
      const email = emails[0].value;
      const emailVerified = emails[0].verified;
      const fullName = `${name.givenName} ${name.familyName}`;
      const profilePic = photos[0].value;

      if (emailVerified && email) {
        try {
          let user = await User.findOne({
            accountId: id,
          });

          if (!user) {
            const createnewUser = new User({
              accountId: id,
              name: fullName,
              email,
              picture: profilePic,
            });

            const newUser = await createnewUser.save();
            return cb(null, newUser);
          } else {
            return cb(null, user);
          }
        } catch (error) {
          cb(new Error(error.message), null);
        }
      } else {
        return cb(new Error("Email Not verified", null));
      }
    }
  )
);

//---------------------------------------------------------------------------------------------------------------------

//SERIALIZATION

passport.serializeUser((user, cb) => {
  try {
    console.log("Serializing user:", user);
    console.log(user.accountId);
    if (!user.accountId) {
      throw new Error("User accountId is undefined");
    }
    cb(null, user.accountId);
  } catch (err) {
    console.log("Error", err);
    cb(err, null);
  }
});

//DESERIALIZATION

passport.deserializeUser(async (id, cb) => {
  if (id) {
    try {
      const user = await User.findOne({ accountId: id });
      // console.log("Deserializing user with ID:", id);
      if (user) {
        return cb(null, user);
      }
       else {
        // return cb(new Error("User Not Found"), null);
        return cb("User Not Found", null);
      }
    } catch (error) {
      return cb(new Error(error.message), null);
    }
  } else {
    return cb(new Error("No id present for dserialization"), null);
  }
});
