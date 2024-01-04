const {Router}=require("express")
const {UserModel}=require("../Models/user.model")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
require("dotenv").config()
const {authentication}=require("../Middlewares/authentication")

const authController=Router()

authController.get("/",(req,res)=>{
    res.json({msg:"Continue towards authentication"})
})

authController.get("/user/:id",authentication,async(req,res)=>{

    try{
        const id=req.params.id;
        const user=await UserModel.findOne({_id: id });

        if(!user){
            return res.status(500).json({msg:"Something went wrong,user not found. Please try again later."})
        }
        return res.status(200).json({msg:"Profile fetched Succecsfully",user:user});
    }catch(err){
        res.status(500).json({msg:err.message,err:err});
    }

})

authController.patch("/update/:id",authentication,async(req,res)=>{
        
    try{
        const id=req.params.id;
        const payload=req.body;

        await UserModel.findByIdAndUpdate({_id:id},payload);

    
        res.status(200).json({msg:"Profile updated successfully"});
    

    
    }catch(err){
        res.status(500).json({msg:err.message,err:err});
    }


})

authController.post("/signup",async(req,res)=>{
   
    try{
        const{name,email,password}=req.body
        const checkEmail=await UserModel.findOne({email:email});
        if(!checkEmail){
            let hashedPassword =  bcrypt.hashSync(toString(password),8);
            if(!hashedPassword){
                return res.status(500).json({msg:"Something went wrong. Please try again later."})
            }else{
                const user=new UserModel({
                    name,
                    email,
                    password:hashedPassword 
                })
            
                    await user.save();
                    return res.status(201).json({msg:"Signup Successful"});
            
            }
        }else{
            return res.status(400).json({msg:"Please choose another email"})
        }
    }catch(err){
        res.status(500).json({msg:err.message,err:err});
    }
   

})

authController.post("/login",async(req,res)=>{

   try{

        const{email,password}=req.body
        const user = await UserModel.findOne({email})
        if(!user){
            return res.status(400).json({msg:"Something went wrong. Please give correct credentials and try again later."})
        }
        const hashedPassword=user.password
        const checkPassword = bcrypt.compareSync(toString(password), hashedPassword);
        const userId = user._id;
        if(checkPassword){
            const secret_key = process.env.SECRET_KEY
            const token=jwt.sign({userId:userId,name:user.name},secret_key,{expiresIn:"1h"});
            return res.status(200).json({message:"login succesful",token:token});

        }
        
        return res.status(400).json({msg:"Login failed.Invalid credentials, please signup if you haven't."});


   }catch(err){

        res.status(500).json({msg:err.message,err:err});

   }
})



module.exports={
    authController
}