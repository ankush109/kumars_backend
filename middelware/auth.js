const Errorhandler = require("../utils/errorhandler");
const catchasyncerror = require("./catchasyncerror");
const jwttoken = require("jsonwebtoken")
const User = require("../models/usermodels")
exports.isauthenticateduser = catchasyncerror(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new Errorhandler("please login to access this resourse", 401))
    }
 
    const decodeddata = jwttoken.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decodeddata.id)
    next()
   
  // const {
  //       user
  // } = req.cookies
  // if(user){
  //   const data = JSON.parse(user)
  //   req.user=data.data
  //     next()
  //   }else{
  //       return next(new Errorhandler("please login to access this resourse", 401))
  //   }

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