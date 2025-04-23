const { validationResult, matchedData } = require("express-validator");
const { ServerError } = require("../utils");

module.exports = (validators) => [
    ...validators,
    (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const errorMsg = errors.array().map(err => err.msg).join(" ");
        const err = ServerError.badRequest(errorMsg);
        return next(err);
    }
    req.body = matchedData(req)
    next();
}]