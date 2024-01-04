const {NoteModel} = require("../Models/note.model.js");
const {TodoModel} = require("../Models/todo.model.js");

const authorizationForGetReq=async(req,res,next)=>{
    
    try{
        const query = req.query.type;
        const userId = req.body.userId;
        const route = req.baseUrl;
        // console.log(route);
        if(route == "/notes" && query === "notes"){

            const checkedData = await NoteModel.find({userId:userId});
            if(!checkedData){
                // console.log(checkedData);
                
                return res.status(404).json({"msg":"Data does not exist"});
                
            }else{

                next()
            }
        }else if(route == "/todos" && query === "todos"){
            const checkedData = await TodoModel.find({userId:userId});
            if(!checkedData){
                // console.log(checkedData);
                
                return res.status(404).json({"msg":"Data does not exist"});
                
            }else{
                
                next()
            }
        }else{

            return res.status(404).json({"msg":"Pass proper data type"})

        }

        
    }catch(err){
        return res.status(500).json({message:err.message,err:err});
    }

}


module.exports = {

    authorizationForGetReq

}