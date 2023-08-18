const express= require("express")
const cookie =require("cookie-parser")
const bodyparser = require("body-parser")
const fileupload =require("express-fileupload")
const dotenv =require("dotenv")
const path = require("path")
const cors = require('cors')
const app =express()
const corsOption = {
    origin: [config.FRONTEND_URL, "http://localhost:3000", "https://www.docurum.com"],
  };
app.use(cors(corsOption))
const errormiddleware = require("./middelware/error")
dotenv.config({path:"config/config.env"})
app.use(express.json())
app.use(cookie())
app.use(bodyparser.urlencoded({extended:true}))
app.use(fileupload())
//route imports
const product =require("./routes/productrouter")
const user = require("./routes/userroutes")
const order =require("./routes/orderroute")
const payment = require("./routes/paymentroute")
const authRoutes = require('./routes/guserroutes')

app.use("/api/v1",product)
app.use("/api/v1",user)
app.use("/api/v1",order)
app.use("/api/v1",payment)
app.use("/api/v1",authRoutes)

// middelware for error
app.use(errormiddleware)
module.exports = app 