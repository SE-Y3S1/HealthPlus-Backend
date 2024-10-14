const express = require("express");
const app = express(); 
const mongoose = require("mongoose"); 
const cors = require("cors"); 

app.use(express.json()); 
app.use(cors()); 
require("dotenv").config(); 
 
const MONGODB_URI = process.env.MONGODB_URI;

const PatientRouter = require('./routers/Patient.js')

app.use('/patients',PatientRouter);


app.listen(8080,()=>{
    console.log("Server Started");
})

mongoose.connect(MONGODB_URI).then(()=>console.log("DB Connected"));