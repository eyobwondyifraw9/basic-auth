const router = require("express").Router(); 
const passport = require("passport");
const magicLogin = require("../config/strategies/magicLogin");
const authController = require("../controllers/authController");
const authValidator = require("../validators/authValidator")
const {jwt, validate} = require("../middlewares");
const { asyncHandler } = require("../utils");

router.post(
    "/email", 
    validate(authValidator.magicLinkValidator), 
    magicLogin.send, 
);   

router.get(
    "/email/callback", 
    passport.authenticate(magicLogin.name, {session: false}), 
    authController.redirectWithOneTimeCode
);

router.get(
    "/google", 
    passport.authenticate("google")
);

router.get(
    "/google/callback",
    passport.authenticate("google", {session: false}),
    authController.redirectWithOneTimeCode
)

router.post(
    "/exchange", 
    validate(authValidator.codeExchangeValidator),
    jwt.verifyOneTimeCode,
    asyncHandler(authController.exchangeCode)
)

router.post(
    "/refreshToken",
    validate(authValidator.refreshTokenValidator),
    jwt.verifyRefreshToken,
    authController.refreshToken
)

router.delete(
    "/logout", 
    validate(authValidator.refreshTokenValidator),
    jwt.verifyRefreshToken,
    authController.logout
)


router.get(
    "/sessions", 
    jwt.verifyAccessToken,
    validate(authValidator.refreshTokenValidator),
    jwt.verifyRefreshToken,
    asyncHandler(authController.getSession)
)

router.delete(
    "/sessions/:sessionId", 
    jwt.verifyAccessToken, 
    validate(authValidator.refreshTokenValidator),
    jwt.verifyRefreshToken,
    validate(authValidator.logoutFromSessionValidator),
    asyncHandler(authController.logoutFromDevice)
)

router.delete(
    "/sessions",
    jwt.verifyAccessToken,
    validate(authValidator.refreshTokenValidator),
    jwt.verifyRefreshToken,
    asyncHandler(authController.logoutFromAll)
)

module.exports = router;