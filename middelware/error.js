const { JsonWebTokenError, TokenExpiredError } = require("jsonwebtoken");
const Errorhandler  =require("../utils/errorhandler");
module.exports =(err,req,res,next)=>{
    err.statuscode =err.statuscode || 500
    err.message =err.message || "internal server error";



    //mongodb duplicate key eror
    if(err.code === 11000){
        const message=`Duplicate ${Object.keys(err.keyValue)} entered`
        err =new Errorhandler(message,400)
    }
     //json web token error
     if(err.name === "JsonWebToken"){
        const message=`json web token  invalid`
        err =new Errorhandler(message,400)
    }
        //json web token error
        if(err.name === "TokenExpiredError"){
            const message=`token expired`
            err =new Errorhandler(message,400)
        }
    res.status(err.statuscode).json({
        success:false,
        error:err.stack,
        message:err.message
    })
}