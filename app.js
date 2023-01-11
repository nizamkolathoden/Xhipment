const express = require('express')
const app = express()
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser')

   


//reguler middleware

app.use(express.json())
app.use(express.urlencoded({extended:true}))
const morgan = require("morgan")
app.use(morgan('dev'))
require('dotenv').config()

//DB connection and Port
const DB = require('./config/Db')()
const PORT = process.env.PORT||3000;

//cookie 
app.use(cookieParser())


//import all routes
app.use("/api/v1/user",require('./router/user'))
app.use("/api/v1/auth",require('./router/authRoute'))


app.listen(PORT,()=>console.log(`Server Running on ${PORT} 🚀 🚀`))