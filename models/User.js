const {model, Schema} = require("mongoose");

const oauthProviderSchema = new Schema({
    provider: {
        type: String,
        required: true,
        enum: ["google", "facebook", "twitter", "github"]
    },
    profileId: {
        type: String,
        required: true
    }
}, {_id: false});

const userSchema = new Schema({
   email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
   },
   name: {
    type: String,
    required: true,
   },
   gender: {
    type: String,
    enum: ["male", "female", "other"],
   },
   avatar: String,
   oauthProviders: [oauthProviderSchema],
}, {
    timestamps: true
});

module.exports = model("User", userSchema);