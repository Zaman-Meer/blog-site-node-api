const jwt = require("jsonwebtoken");

const TokenVerify = (req, res, next) => {
    
    const authHeader = req.headers?.authorization;

    // console.log(JSON.stringify(req.headers));
    if (authHeader) {
      const token = authHeader?.split(" ")[1];
  
      jwt.verify(token, process.env.SECRET_KEY, (err, user) => { 
         
        if (err) {
          return res.status(403).json("Token is not valid!");
        }
  
        req.user = user;
        console.log("AUTHPass")
        next();
      });
    } else {
      res.status(401).json("You are not authenticated!");
    }
  };

  module.exports=TokenVerify;