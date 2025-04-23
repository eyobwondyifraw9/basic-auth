const router = require("express").Router();
const {jwt} = require("../middlewares");
const {asyncHandler} = require("../utils")
const userController = require("../controllers/userController")

router.get(
    "/me",
    jwt.verifyAccessToken,
    asyncHandler(userController.getProfile)
)

module.exports = router;