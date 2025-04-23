const { default: MagicLoginStrategy } = require("passport-magic-login");
const env = require("../env");
const { mail, ServerError } = require("../../utils");
const User = require("../../models/User");

module.exports = new MagicLoginStrategy({
  secret: env.MAGIC_LOGIN_SECRET,
  callbackUrl: "/auth/email/callback",
  async sendMagicLink(destination, href, verificationCode, req) {
    try {
      const existingUser = await User.findOne({ email: destination });

      if (!existingUser && !req.body.name) {
        throw ServerError.badRequest("Account not found", "No account found. Please Sign Up.");
      }

      await mail.sendMail({
        from: env.MAIL_FROM,
        to: destination,
        template: existingUser ? "login" : "createAccount",
        subject: existingUser ? "Yizet Login" : "Yizet Create Account",
        locals: {
          magicLink: new URL(href, env.SERVER_URL).href,
          verificationCode,
        },
      });
    } catch (error) {
      if (error) {
        console.log(error.message);
        if(error instanceof ServerError){
          const msg = error.details || error.message;
          throw new ServerError(error.statusCode, msg, msg);
        }
        error.statusCode = 500;
        throw ServerError.internal("Unable to send email", "Failed to send email please try again");
      }
    }
  },
  async verify(payload, callback, req) {
    const { destination: email, name } = payload;
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, name });
      await user.save();
    }

    return callback(null, user);
  },
  jwtOptions: {
    expiresIn: "10m",
  },
});
