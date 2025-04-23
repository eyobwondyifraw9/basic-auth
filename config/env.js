const dotenv = require("dotenv");
const {cleanEnv, str, port, url, email} = require("envalid");

dotenv.config();

const env = cleanEnv(process.env, {
    PORT: port({default: 3000}),
    DB_URL: url(),
    MAGIC_LOGIN_SECRET: str(),
    MAIL_HOST: str(),
    MAIL_PORT: port(),
    MAIL_USERNAME: str(),
    MAIL_PASSWORD: str(),
    MAIL_FROM: email(),
    JWT_ACCESS_SECRET: str(),
    JWT_REFRESH_SECRET: str(),
    JWT_ONETIME_CODE_SECRET: str(),
    FRONTEND_URL: url(),
    MAILTRAP_TOKEN: str(),
    GOOGLE_CLIENT_ID: str(),
    GOOGLE_CLIENT_SECRET: str(),
    GOOGLE_CALLBACK_URL: url(),
    SERVER_URL: url(),
    NODE_ENV: str({choices: ["production", "development"], default: "development"})
})

module.exports = env;