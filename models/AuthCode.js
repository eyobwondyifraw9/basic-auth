const {model, Schema} = require("mongoose");

const authCodeSchema = new Schema({
    code: {
        type: String,
        required: true,
    },
    userId: Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    used: { type: Boolean, default: false },
    usedAt: Date,
    expiredAt: {
        type: Date,
        default: () => Date.now() + 10 * 60 * 1000, // 10 minutes from now
        expires: 0, // TTL index
    },
});

authCodeSchema.index({ code: 1 }, { unique: true });

module.exports = model("AuthCode", authCodeSchema);