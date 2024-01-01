const {Router}=require("express")
const {TodoModel} = require("../Models/todo.model")
const { authentication } = require("../Middlewares/authentication")
const { authorization }=require("../Middlewares/authorization")

const todoController = Router();


todoController.get("/",authentication,async(req,res)=>{


    try{

        const{userId, name} = req.body;
        const todos = await TodoModel.find({userId: userId});
        if(!todos){
            return res.status(500).json({message:"Something went wrong"});
        }
        return res.status(200).json({message:"Success",name:name,todos:todos});

    }catch(err){

        res.status(500).json({message:err.message});

    }


})

todoController.get("/singleTodo/:id",authentication,authorization,async(req,res)=>{


    try{

        const id = req.params.id;
        console.log(id)
        const todo = await TodoModel.findById({_id:id});
        if(!todo)
            return res.status(500).json({message:"Something went wrong"});

        return res.status(200).json({message:"Success",todo:todo});

    }catch(err){

        res.status(500).json({msg:err.message});

    }


})


todoController.post("/addMainTodo",authentication,async(req,res)=>{

    try{

        const{mainTodo, userId} = req.body;
        if(!mainTodo || !userId){
            return res.status(400).json({msg:"Please fill all the required fields"})
        }
        const payload = req.body;
        const newPayload = {...payload, userId};

        const todo = await new TodoModel(newPayload);
        todo.save();
        return res.status(201).json({msg:"Successfully todo added"});

    }catch(err){

        res.status(500).json({msg:err.message, err:err});

    }

})


todoController.patch("/addSubTodo/:id",authentication,async(req,res)=>{

    try{
        
        const mainTodoId = req.params.id;
        const payload = req.body;
        if(!payload){
            return res.status(400).json({msg:"Please fill all the required fields"});
        }
        const result = await TodoModel.findByIdAndUpdate({_id:mainTodoId},{$push:{subTodos:payload}},{new:true});

        if(!result){
            res.status(404).json({msg:"Error occured while updating subtodo"});
        }
        
        res.status(200).json({msg:"Successfully updated subtodo", todo:result});
        

    }catch(err){

        res.status(500).json({msg:err.message, err:err});
        
    }

})


module.exports = {
    todoController
}