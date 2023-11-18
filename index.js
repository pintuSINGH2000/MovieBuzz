const express = require("express");
const app = express();
const mongoose =require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require('path');
const url = require('url');
const morgan = require("morgan");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const movieRoute = require("./routes/movie");
const listRoute = require("./routes/list");

dotenv.config();

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>console.log("DB connected successfully")).catch((err) => console.log(err));

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use("/api/auth",authRoute);
app.use("/api/user",userRoute);
app.use("/api/movie",movieRoute);
app.use("/api/list",listRoute);

app.use(express.static(path.join(__dirname,'../client/build')));

app.use('*',function(req,res) {
    res.sendFile(path.join(__dirname,'../client/build/index.html'));
 })
 
 const PORT = process.env.PORT || 8080;

app.listen(8080,()=>{
    console.log("Backend server is running "+8080);
})