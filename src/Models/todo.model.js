const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  mainTodo: { type: String, required: true },
  subTodos: { type: Array, default: [] },
  status: { type:Boolean, default: false },
  userId: { type: String, required: true, unique: true },
},{
    versionKey:false,
    timestamps:true
});


const TodoModel = mongoose.model("fstodo",todoSchema);

module.exports = {
    TodoModel
}
