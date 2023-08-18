const mongoose =require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto =require("crypto")
const userschema  =new mongoose.Schema({
 
    name:{
        type:String,
        required:[true,"please enter your name"],
        maxlength:[30,"cannot exceed 30 characters"],
        minlength:[4,"cannot be more than 5 characters"]

    },
    email:{
        type:String,
        required:[true,"please enter your email"],
        unique:true,
        validate:[validator.isEmail,"please enter a valid email"]
    },
    password:{
        type:String,
        required:[true,"please enter your password"],
        minlength:[8,"password should be more than 8 characters"],
        select:false,
    },
    avatar:{
        public_id:{
            type:String,
           
        },
        url:{
            type:String,
            
        }
    },
    role:{
        type:String,
        default:"user"
    },
    createdat:{
        type:Date,
        default:Date.now,
    },
    resetpassword:String,
    resetpasswordexpire:Date
})
userschema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
this.password = await bcrypt.hash(this.password,10)
})


//jwt token
userschema.methods.getJWTtoken =function(){
return jwt.sign({id:this._id},"ijdfalkjdflkjafdldkjhfljkhadsflkjhljfhjhflajdshfkljsah",{
    expiresIn:process.env.JWT_EXPIRE

})
}

//comapare  password 
userschema.methods.comparePassword = async function(enteredpassword){
    return await bcrypt.compare(enteredpassword,this.password)
}

//reset password 
userschema.methods.getresetpasswordtoken =function(){
//generating token



const resettoken =crypto.randomBytes(20).toString("hex");



//hashing and adding to user schemaa
this.resetpassword =crypto.createHash("sha256").update(resettoken).digest("hex")
this.resetpasswordexpire =Date.now() +15 *60*1000;
return resettoken
}

module.exports = mongoose.model("user",userschema)