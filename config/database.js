const mongoose = require("mongoose")
const connectdatabase =()=>{
    mongoose.connect(process.env.DBE).then((data)=>{
    console.log(`mongodb connected wiht server ${data.connection.host}`);
}).catch((err)=>{
    console.log(err);
})
}
module.exports =connectdatabase