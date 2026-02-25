const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization
  if(authHeader && authHeader.startsWith("Bearer")){
    token = authHeader.split(" ")[1];
 
  if(!token){
    return res.status(401).
    json({message:`NO token,authorization denied`})
  }
  try{
    const decode = jwt.verify(token,process.env.JWT_SECRETKEY);
    req.user=decode;
    console.log("the decoded user is:",req.user);
    next();
  }catch(err){
    res.status(400).json({message:"Token is not valid"});
  }
  
  }
  else{
    return res.status(401).
    json({message:`NO token,authorization denied`})
  }
}
module.exports = verifyToken