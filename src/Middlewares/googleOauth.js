const isLoggedIn = (req,res,next) => {

    if(req.user){
        next();
    }else{
        return res.status(400).json({message:"Log in first"});
    }

}


module.exports = {

    isLoggedIn

}