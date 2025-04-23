const jwt = require("jsonwebtoken");
const env = require("../config/env");

const generateAccessToken = (user) => {
   return jwt.sign({sub: user._id}, env.JWT_ACCESS_SECRET, {expiresIn: "30m"});
}

const generateOneTimeCode = (user) => {
    const payload = {
        sub: user._id,
        nonce: crypto.randomUUID(16).toString('hex'),
        purpose: 'auth_code',
    }
    return jwt.sign(payload, env.JWT_ONETIME_CODE_SECRET, {expiresIn: "5m"});
}

const generateRefreshToken = (user, session) => {
    return jwt.sign({sub: user._id, sessionId: session._id}, env.JWT_REFRESH_SECRET, {expiresIn: "7d"});
}

module.exports = {
    generateAccessToken,
    generateOneTimeCode,
    generateRefreshToken
}