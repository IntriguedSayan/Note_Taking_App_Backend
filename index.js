const express=require("express")
const connection=require("./src/Config/db")
const {authController}=require("./src/Routes/auth.Route.js")
const {notesController}=require("./src/Routes/notes.Route.js")
const {todoController} = require("./src/Routes/todo.Route.js")
const {googleAuthController} = require("./src/Routes/goggleAuth.route.js")
const session = require("express-session");
const passport = require("passport");

require("dotenv").config()
const cors=require("cors");

const app=express()


const PORT=process.env.PORT || 7600

app.use(cors())
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json())
app.use("/auth",authController)
app.use("/google",googleAuthController)
app.use("/notes",notesController)
app.use("/todos",todoController)

app.get("/",(req,res)=>{
    res.json({msg:"Welcome to homePage"})
})

app.use("*",(req,res)=>{

    return res.json({msg:"You have entered a wrong path"});
    
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
