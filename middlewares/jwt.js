const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { ServerError } = require("../utils");
const Session = require("../models/Session");

const verifyToken = (token, secret, req, next) => {
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    return next();
  } catch (err) {
    next(err);
  }
};

exports.verifyOneTimeCode = (req, res, next) => {
  verifyToken(req.body.code, env.JWT_ONETIME_CODE_SECRET, req, next);
};

exports.verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(ServerError.unauthorized("No token provided"));
  }

  verifyToken(authHeader.split(" ")[1], env.JWT_ACCESS_SECRET, req, next);
};

exports.verifyRefreshToken = async (req, res, next) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;

  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
    const session = await Session.findOne({
      _id: decoded.sessionId,
      userId: decoded.sub,
    });
    if (!session || !(await session.isValidRefreshToken(token))) {
      throw ServerError.unauthorized("Invalid or expired session");
    }

    req.user = { ...decoded, session };
    return next();
  } catch (error) {
    next(error);
  }
};
