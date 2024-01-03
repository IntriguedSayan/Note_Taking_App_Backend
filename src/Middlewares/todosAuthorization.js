const {TodoModel} = require("../Models/todo.model.js");

const todoAuthorization=async(req,res,next)=>{
    
    try{
        const userId = req.body.userId;
        const checkedData = await TodoModel.findById({_id:req.params.id});
        if(checkedData){
            // console.log(checkedData);
            if(checkedData?.userId===userId){
                next()
            }
            else{
                return res.send("You are not authorized to perform this operation.");
            }
        }else{
            return res.status(500).json({"msg":"Some error occurred"});
        }
        
    }catch(err){
        res.status(500).json({message:err.message,err:err});
    }

}

module.exports={
    todoAuthorization
}