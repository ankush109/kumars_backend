const Errorhandler = require("../utils/errorhandler");
const catchasyncerror = require("./catchasyncerror");
const jwttoken = require("jsonwebtoken")
const User = require("../models/usermodels")
const createError = require( "http-errors");
exports.isauthenticateduser = catchasyncerror(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(createError.Unauthorized());
    }
  try{
    const token =authHeader;
    const decoded = jwttoken.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  }catch(error){
    return next(createError(401, "Not authorized to access this route"));
  }
})
exports.authorizeroles = (...roles) => {
    return (req, res, next) => {
        // if(!roles.includes(req.user.role)){
        //    return next( new Errorhandler(`role : ${req.user.role} is not allowed to acccess this resource`)
        // )}else{
        //     return 0
        // }
        next()
    }

}