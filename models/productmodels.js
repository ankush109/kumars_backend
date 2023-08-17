const mongoose = require("mongoose");
const prodcutschema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter product name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"please enter product desc"]
    },
    price:{
        type:Number,
        required:[true,"please enter product price"],
        maxlength:[8,"price cant exceed 8 characters"]
    },
    ratings:{
        type:Number,
        default:0
    },

    images:[{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }
    ],
    category:{
type:String

    },
    stock:{
        type:Number,
        required:true,
        default:100,
        
    },
    numberofreviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"user",
                required:true,
        
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
        required:true,

    },
    createdat:{
        type:Date,
        default:Date.now
    }
})
module.exports =mongoose.model("product",prodcutschema)