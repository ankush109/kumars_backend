//creating token and saving in cookie


const sendtoken =(user,statuscode,res)=>{
    const token = user.getJWTtoken();
    //options for cookie

res.status(statuscode).cookie("token",token).json({
    success:true,
    token,
    user
})
;
}
module.exports =sendtoken