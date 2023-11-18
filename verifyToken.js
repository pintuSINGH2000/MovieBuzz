const JWT = require("jsonwebtoken");

function verify(req,res,next){
   const authHeader = req.headers.token;
   if(authHeader){
     const token = authHeader.split(" ")[1];
     JWT.verify(token,process.env.SECRET_KEY,(err,user) => {
        if(err){
         res.status(403).json("Token is not valid");
         return ;
        } 
        req.user = user;
        next();
     })
   }else{
    return res.status(401).json("You are not auntheticated");
   }
}

module.exports = verify;