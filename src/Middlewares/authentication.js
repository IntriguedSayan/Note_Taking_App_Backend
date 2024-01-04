const jwt=require("jsonwebtoken")
require("dotenv").config()

const authentication=(req,res,next)=>{
    try{
        if(!req.headers.authorization){
            return res.send("Please Login");
        }
        
        const token=req.headers?.authorization?.split(" ")[1];
    
        jwt.verify(token,`${process.env.SECRET_KEY}`,(err,decoded)=>{
            if(err){
                return res.json({message:err.message,err:err});
            }else{
                req.body.userId=decoded.userId;
                // console.log(decoded.userId);
                req.body.name=decoded.name;
                next();
            }
            
        })
    }catch(err){
         return res.status(500).json({message:err.message,err:err});
    }
}




module.exports={
    authentication
}