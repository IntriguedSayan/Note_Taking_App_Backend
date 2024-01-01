const express=require("express")
const connection=require("./src/Config/db")
const {authController}=require("./src/Routes/auth.Route")
const {notesController}=require("./src/Routes/notes.Route")
const {todoController} = require("./src/Routes/todo.Route")
require("dotenv").config()
const cors=require("cors")

const app=express()

const PORT=process.env.PORT || 7600

app.use(express.json())
app.use(cors())
app.use("/auth",authController)
app.use("/notes",notesController)
app.use("/todos",todoController)

app.get("/",(req,res)=>{
    res.json({msg:"Welcome to homePage"})
})

app.listen(PORT,async()=>{
    try{
        await connection;
        console.log(`Listening on port ${PORT}`)
    }catch(err){
        console.log("connection Failed")
        console.log(err.message);
    }
    
})
