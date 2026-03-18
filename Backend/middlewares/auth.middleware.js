 const jwt = require('jsonwebtoken');
 
 async function identifyuser(req,res,next){

    const token = req.cookies.token;

    if(!token){
      return res.status(401).json({
        message:"token is not found"
      })
    }

    let decoded =null
    
    try{
      decoded = await jwt.verify(token,process.env.JWT_SECRET);
    }catch(err){
      return res.status(401).json({
        message:"user is not authorize"
      })
    }

    req.user=decoded;
    next();
}


module.exports=identifyuser; 