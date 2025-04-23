const { MongooseError } = require("mongoose");
const User = require("../../models/User");
const env = require("../env");
const GoogleStrategy = require("passport-google-oauth20").Strategy;



module.exports = new GoogleStrategy({
  clientID: env.GOOGLE_CLIENT_ID,
  callbackURL: env.GOOGLE_CALLBACK_URL,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  scope: ["email", "profile"]
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log("profile", profile);
    const user = await findOrCreateUser(profile);
    return done(null, user);
  } catch (err) {
    if (err instanceof MongooseError) {
      console.error("Mongoose error:", err);
    }
    return done(err);
  }
});

const findOrCreateUser = async (profile) => {
  const preferVerifiedEmail = profile.emails.find(e => e.verified)?.value || profile.emails[0]?.value;

  let user = await User.findOne({
    $or: [
      { email: preferVerifiedEmail },
      {
        oauthProviders: {
          $elemMatch: {
            profileId: profile.id,
            provider: profile.provider
          }
        }
      }
    ]
  });

  if (user) {
    const alreadyLinked = user.oauthProviders.some(({ profileId, provider }) => {
      return profileId === profile.id && provider === profile.provider;
    });

    if (!alreadyLinked) {
      await user.updateOne({
        $addToSet: {
          oauthProviders: {
            provider: profile.provider,
            profileId: profile.id
          }
        },
        $set: {
          avatar: user.avatar || profile.photos[0]?.value
        }
      });
    }
  } else {
    user = new User({
      email: preferVerifiedEmail,
      name: profile.displayName,
      avatar: profile.photos[0]?.value,
      oauthProviders: [{
        profileId: profile.id,
        provider: profile.provider
      }]
    });

    await user.save();
  }

  return user;
};