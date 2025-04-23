const { body, header, check, param} = require("express-validator");

exports.magicLinkValidator = [
    body("name")
        .optional()
        .trim()
        .isLength({min: 2, max: 30})
        .withMessage("Name must be 3-30 characters long"),
    body("destination")
        .exists({checkFalsy: true})
        .withMessage("destination is required")
        .isEmail()
        .withMessage("destination must be a valid email address")
]

exports.codeExchangeValidator = [
    body("code")
        .notEmpty()
        .withMessage("code is required")
]

exports.accessTokenValidator = [
    header("authorization")
        .exists({ checkFalsy: true })
        .withMessage("Authorization header is required")
        .matches(/^Bearer\s[\w-]*\.[\w-]*\.[\w-]*$/)
        .withMessage("Authorization header must be a valid Bearer token")
]

exports.refreshTokenValidator = [
    check("refreshToken")
    .exists({checkFalsy: true})
    .withMessage("Refresh token is required")
    .isJWT()
    .withMessage("Refresh token must be a valid JWT")
]

exports.logoutFromSessionValidator = [
    param("sessionId")
    .exists({checkFalsy: true})
    .withMessage("session id is required")
    .isMongoId()
    .withMessage("Invalid id provided")
]