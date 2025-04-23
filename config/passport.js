const googleStrategy = require("./strategies/googleStrategy");
const magicLogin = require("./strategies/magicLogin");

/**
 * 
 * @param {import("passport").PassportStatic} passport 
*/

function configurePassport(passport){
    passport.use(magicLogin);
    passport.use(googleStrategy);
}

module.exports = configurePassport;