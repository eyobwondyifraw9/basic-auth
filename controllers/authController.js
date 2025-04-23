const User = require("../models/User");
const { env } = require("../config");
const { token, ServerError, createSession } = require("../utils");
const Session = require("../models/Session");
const AuthCode = require("../models/AuthCode");
const { default: mongoose } = require("mongoose");

exports.redirectWithOneTimeCode = async (req, res, next) => {
  const code = token.generateOneTimeCode(req.user);

  const authCode = new AuthCode({ code, userId: req.user._id });
  await authCode.save();

  const url = new URL("/auth/exchange", env.FRONTEND_URL);
  url.searchParams.append("code", code);
  res.redirect(url.href);
};

exports.refreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  const { sub, sessionId } = req.user;

  const user = await User.findById(sub);

  if (!user) throw ServerError.forbidden("User not found");

  const session = await Session.findById(sessionId);

  if (!session) throw ServerError.unauthorized("Invalid refresh token");

  if (new Date(session.expiresAt) < new Date())
    throw ServerError.forbidden("Session expired");

  const isValid = await session.isValidRefreshToken(refreshToken);

  if (!isValid) throw ServerError.forbidden("Invalid token");

  const accessToken = token.generateAccessToken(user);

  res.json({
    success: true,
    data: {
      accessToken,
    },
  });
};

exports.exchangeCode = async (req, res, next) => {
  const { sub } = req.user;
  const code = req.body.code;

  const authCode = await AuthCode.findOneAndUpdate(
    { code, used: false },
    { used: true, usedAt: new Date() },
    { new: true, runValidators: true }
  );

  if (!authCode) {
    throw ServerError.forbidden("Authorization code already used or invalid");
  }

  const user = await User.findById(authCode.userId);

  if (!user) {
    throw new ServerError.notFound("User not found");
  }

  const accessToken = token.generateAccessToken(user);

  const { refreshToken } = await createSession(user, req);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    data: {
      accessToken,
      refreshToken,
      user,
    },
  });
};

exports.getSession = async (req, res, next) => {
  const { sub, sessionId } = req.user;

  const sessions = await Session.find({ userId: sub }).lean();
  const sessionsWithIsCurrent = sessions.map((session) => ({
    ...session,
    isCurrent: session._id.toString() === sessionId,
  }));

  res.json({
    success: true,
    data: {
      sessions: sessionsWithIsCurrent,
    },
  });
};

exports.logout = async (req, res, next) => {
  const { sessionId } = req.user;

  // Check if the session exists before attempting to delete
  const session = await Session.findById(sessionId);
  if (!session) {
    throw ServerError.forbidden("Invalid session");
  }

  await Session.deleteOne({ _id: sessionId });
  res.clearCookie("refreshToken");
  res.json({
    success: true,
    message: "Logged out successfully",
  });
};

exports.logoutFromDevice = async (req, res, next) => {
  const { sub: currentUserId, sessionId: currentUserSession } = req.user;
  const sessionId = req.params.sessionId;

  const session = await Session.findById(sessionId);

  if (!session) throw ServerError.forbidden("Invalid session");

  if (!session.userId.equals(currentUserId)) {
    throw ServerError.forbidden("Not authorized to log out this session");
  }

  await Session.deleteOne({ _id: session._id });

  if (session._id.equals(currentUserSession)) {
    res.clearCookie("refreshToken");
  }

  res.json({
    success: true,
    message: "Session logout successfully",
    isCurrent: session._id.equals(currentUserSession),
  });
};

exports.logoutFromAll = async (req, res, next) => {
  const { sub, sessionId } = req.user;
  await Session.deleteMany({ userId: sub });
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out from all devices" });
};
