const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const passport = require("passport");
const configurePassport = require("./config/passport");
const { errorHandler, limiter } = require("./middlewares");
const helmet = require("helmet");


// built in middlewares
app.use(cors({origin: true, credentials: true}));
app.use(helmet());
app.use(limiter());

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser())

// setup passport
app.use(passport.initialize());
configurePassport(passport);

// applying routes
app.use("/", routes);
app.use(errorHandler.notFound());
app.use(errorHandler.serverError());

module.exports = app;