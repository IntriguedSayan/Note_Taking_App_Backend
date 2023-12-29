const {Router}=require("express")
const {NoteModel}=require("../Models/note.model")
const { authentication } = require("../Middlewares/authentication")
const { authorization }=require("../Middlewares/authorization")

const notesController=Router();


notesController.get("/",authentication,authorization,async(req,res)=>{

    try{
        const{userId,name}=req.body;
        const notes=await NoteModel.find({userId:userId});
        if(!notes){
            return res.status(500).json({msg:"Something went wrong"});
        }
        return res.status(200).json({msg:"Data fetched",name:name,notes:notes});
    }catch(err){
        res.status(500).json({msg:err.message,err:err});
    }
    
})

notesController.get("/:id",authentication,authorization,async(req,res)=>{
    
    try{
        const id = req.params.id;

        const singleNote=await NoteModel.findOne({_id:id});

        if(!singleNote){
            return res.status(500).json({msg:"Something went wrong."})
        }
        
        return res.status(200).json({msg:"Note fetched",note:singleNote})
    }catch(err){
        res.status(500).json({msg:err.message,err:err});
    }

})


notesController.post("/create",authentication,async(req,res)=>{

    try{

        const{userId,heading,description,tag}=req.body;
        if(!userId|| !heading|| !description|| !tag){
                return res.status(400).json({msg:"Please fill all the input fields"});
        }
        const payload=req.body
        const newPayload={...payload,userId:userId}
        // console.log(newPayload)
        const notes=await new NoteModel(newPayload)
   
        notes.save()
        return res.status(201).json({msg:"Note Created"});
        
    }catch(err){

        res.status(500).json({msg:err.message,err:err});

    }
   

})

notesController.patch("/update/:id",authentication,authorization,async(req,res)=>{

   try{
        const id=req.params.id
        const payload=req.body
        await NoteModel.findByIdAndUpdate({_id:id},payload)
      
        return res.status(200).json({msg:"Note updated"})
    
   }catch(err){
        res.status(500).json({msg:err.message,err:err});
   }
    
    
})

notesController.delete("/:id",authentication,authorization,async(req,res)=>{
    
    try{
        const id=req.params.id;
        await NoteModel.findByIdAndDelete({_id:id});
     
        return res.status(200).json({msg:"Note deleted"});
       
    }catch(err){
        res.status(500).json({msg:err.message,err:err});
    }
    

})

module.exports={
    notesController
}
