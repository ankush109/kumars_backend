const catchasyncerrors = require("../middelware/catchasyncerror")
const Errorhandler = require("../utils/errorhandler");
const User = require("../models/usermodels")
const sendToken = require("../utils/jwttoken")
const sendEmail =require("../utils/sendemail")
const cloudinary = require("cloudinary")
const crypto =require("crypto")
exports.registername =catchasyncerrors(async(req,res,next)=>{
  
    const{name,email,password}= req.body
    const user = await User.create({

        name,
        email,
        password
    })
    sendToken(user,201,res)
})

// Login User
exports.loginUser = catchasyncerrors(async (req, res, next) => {
    const { email, password } = req.body;
  
    // checking if user has given password and email both
  
    if (!email || !password) {
      return next(new Errorhandler("Please Enter Email & Password", 400));
    }
  
    const user = await User.findOne({ email }).select("+password");
  
    if (!user) {
      return next(new Errorhandler("Invalid email or password", 401));
    }
  
    const isPasswordMatched = await user.comparePassword(password);
  
    if (!isPasswordMatched) {
      return next(new Errorhandler("Invalid email or password", 401));
    }
  
    sendToken(user, 200, res);
  });
  
//logout user 
exports.logout = catchasyncerrors(async (req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"logged out"
    })
})


//forgot password
exports.frogotpassword = catchasyncerrors(async (req,res,next)=>{
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return next(new Errorhandler("user not found",404))
    }
    //get reset password token
    const resettoken =user.getresetpasswordtoken()
    await user.save({valiateBeforeSave:false})

    const resetpasswordurl = `http://localhost/api/v1/password/reset/${resettoken}`
const message=`your password reset token is:- \n \n ${resetpasswordurl} \n\n if you have not requested this email please ignore it`
try {
    await sendEmail({
 email:user.email,
 subject:`eccomerce password  recovery`,
 message
    })
    res.status(200).json({
        success:true,
        message:`email sent to ${user.email} successfully`
    })
} catch (error) {
    user.getresetpasswordtoken =undefined;
    user.resetpasswordexpire =undefined
    await user.save({valiateBeforeSave:false})
    return next(new Errorhandler(error.message,500))
}
})
exports.resetpassword =catchasyncerrors(async(req,res,next)=>{
    //creating token hash
    const resetpassword =crypto.createHash("sha256").update(req.params.token).digest("hex")
    const user = await User.findOne({
        getresetpasswordtoken,
        resetpasswordexpire:{$gt:Date.now()}
    })
    if(!user){
        return next(new Errorhandler("reset password token is invalid or has been expired",400))
    }
    if(req.body.password!== req.body.confirmpassword){
        return next(new Errorhandler("passwords doest match",400))
    }
    user.password =req.body.password;
    user.getresetpasswordtoken=undefined;
    user.resetpasswordexpire= undefined;
  await  user.save()
  sendToken(user,200,res)
})

//update user profile
exports.updateprofile=catchasyncerrors(async (req,res,next)=>{
    const newUserdata ={
        name:req.body.name,
        email:req.body.email,

    }
    //we will add cloudinary later

    const user  = await User.findByIdAndUpdate(req.user.id,newUserdata,{
        new:true,
        runValidators:true,
        userFindAndModify:true,
    })

    res.status(200).json({
        success:true
    })


})

//get all users:- (admin)
exports.getalluser =catchasyncerrors(async(req,res,next)=>{
    const user =await User.find()
    res.status(200).json({
        success:true,
        user
    })
})

//get single user:- (admin)
exports.getsingleuser =catchasyncerrors(async(req,res,next)=>{
    const user =await User.findById(req.params.id)
    if(!user){
        return next(new Errorhandler(`user does not exist with id: ${req.params.id}`))
    }

    res.status(200).json({
        success:true,
        user
    })
})
//get user detail 
exports.getuserdetails =catchasyncerrors(async(req,res,next)=>{
    const user =await User.findById(req.user.id)
    res.status(200).json({
        success:true,
        user,
    })
})
//update user password

exports.updatepassword =catchasyncerrors(async(req,res,next)=>{
    const user =await User.findById(req.user.id).select("+password")
    const ispasswordmatched =await user.comparePassword(req.body.oldpassword);
    if(!ispasswordmatched){
        return next(new Errorhandler("old password is incorrect",401))
    }
    if(req.body.newpassword!==req.body.confirmpassword){
        return next(new Errorhandler("password doesnot match",401))
    }

    user.password=req.body.newpassword
    await user.save()
    sendToken(user,200,res) 
  
})

//update user role
// exports.updaterol=catchasyncerrors(async (req,res,next)=>{
//     const newUserdata ={
//         name:req.body.name,
//         email:req.body.email,
//         role:req.body.role

//     }
//     //we will add cloudinary later

//     const user  = await User.findByIdAndUpdate(req.params.id,newUserdata)
//     await user.save()

//     res.status(200).json({
//         success:true
//     })


// })
// update User Role -- Admin
exports.updateUserRole = catchasyncerrors(async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };
  let user =User.findById(req.params.id)
  if(!user){
      return next(
          new Errorhandler("user does not exist")
      )
  }
   user=  await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
    });
  });
  
//delete user -admin
exports.deleteuser=catchasyncerrors(async (req,res,next)=>{
   const user =await User.findById(req.params.id)
   if(!user){
       return next(new Errorhandler("user doesnot exist with id"))
   }
   await user.remove()
    res.status(200).json({
        success:true
    })


})