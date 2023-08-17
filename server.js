const app =require("./app")

const dotenv =require("dotenv")
const cloudinary = require("cloudinary")
const connectdatabase =require("./config/database")
//config

dotenv.config({path:"backend/config/config.env"})
//connecting to the database :
connectdatabase();


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
})
app.listen(4000,()=>{
    console.log(`server is working on 4000`);
})