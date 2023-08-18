const Errorhandler = require("../utils/errorhandler");
const catchasyncerror = require("./catchasyncerror");
const jwttoken = require("jsonwebtoken")
const User = require("../models/usermodels")
exports.isauthenticateduser = catchasyncerror(async (req, res, next) => {
    const { token } = req.cookies;
    console.log(token)
  
    const decodeddata = jwttoken.verify(token,process.env.JWT_SECRET)
    req.user = await User.findById(decodeddata.id)
    next()

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