const {NoteModel}=require("../Models/note.model")

const authorization=async(req,res,next)=>{
    
    try{
        const userId = req.body.userId;
        const checkedData = await NoteModel.findOne({_id:req.params.id});
        if(checkedData.userId===userId){
            next()
        }
        else{
            return res.send("You are not authorized to perform this operation.");
        }
    }catch(err){
        res.status(500).json({message:err.message,err:err});
    }

}

module.exports={
    authorization
}