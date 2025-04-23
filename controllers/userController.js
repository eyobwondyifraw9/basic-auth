const User = require("../models/User");
const Session = require("../models/Session");

exports.getProfile = async (req, res, next) => {
    const user = await User.findById(req.user.sub);
    res.json({
        success: true,
        data: {
            user,
            sessionId: req.user.sessionId
        }
    })
}