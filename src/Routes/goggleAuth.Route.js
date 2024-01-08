const {Router} = require('express');
const passport = require('passport');
const session = require("express-session");
const { isLoggedIn } = require('../Middlewares/googleOauth');
require("dotenv").config;

require("../Services/googleAuth");

const googleAuthController = Router();

googleAuthController.get("/",passport.authenticate("google",{
    scope:["email", "profile"]
}
))

googleAuthController.get("/callback",passport.authenticate("google",{
    failureRedirect:"/google/loginFailed",
    successRedirect:"/google/loginSuccess",
})

)


googleAuthController.get("/loginSuccess",isLoggedIn,(req,res)=>{

    res.status(200).json({message:`Login Success. Welcome ${req.user.displayName}`,user:req.user});

})

googleAuthController.get("/loginFailed",(req,res)=>{

    res.status(500).json({message:"Login Failed"});

})

googleAuthController.get("/logout",(req,res)=>{

    req.session.destroy((err)=>{

        if(err){
            res.status(500).json({message:"Error while destroying session", errorMessage:err.message,err:err})
        }else{

            req.logout(()=>{

                res.status(200).json({message:"You are successfully Logged out"})

            })

        }

    })

})

module.exports = {

    googleAuthController

}








