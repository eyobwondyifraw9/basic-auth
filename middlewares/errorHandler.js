const { JsonWebTokenError } = require("jsonwebtoken");
const { env } = require("../config");
const { ServerError } = require("../utils");
const { MongooseError } = require("mongoose");

exports.notFound = () => (req, res, next) => {
    res.status(404);
    next(new Error("Resource not found"));
}

exports.serverError = () => (err, req, res, next) => {
   let statusCode = err.statusCode || 500;

  if (err instanceof JsonWebTokenError) {
     statusCode = 401;
     err.message = "Unauthorized: Invalid or expired token";
  }
  
   if(err instanceof MongooseError){
      statusCode = 500;
      err.message = "Something went wrong";
   }

   res.status(statusCode).json({
    success: false,
    message: err.message,
    statusCode,
    stack: env.isDev ? err.stack : undefined
   })
}