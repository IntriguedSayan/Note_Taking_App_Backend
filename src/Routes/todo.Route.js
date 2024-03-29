const { Router } = require("express");
const { TodoModel } = require("../Models/todo.model");
const { authentication } = require("../Middlewares/authentication");
const { todoAuthorization } = require("../Middlewares/todosAuthorization");
const { authorizationForGetReq } = require("../Middlewares/getReq");

const todoController = Router();

todoController.get("/", authentication, authorizationForGetReq, async (req, res) => {
  try {
    const { userId, name } = req.body;
    const todos = await TodoModel.find({ userId: userId });
    if (!todos) {
      return res.status(500).json({ message: "Something went wrong" });
    }
    return res
      .status(200)
      .json({ message: "Success", name: name, todos: todos });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

todoController.get(
  "/singleTodo/:id",
  authentication,
  todoAuthorization,
  async (req, res) => {
    try {
      const id = req.params.id;
      console.log(id);
      const todo = await TodoModel.findById({ _id: id });
      if (!todo)
        return res.status(500).json({ message: "Something went wrong" });

      return res.status(200).json({ message: "Success", todo: todo });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
);

todoController.post("/addMainTodo", authentication, async (req, res) => {
  try {
    const { mainTodo, userId } = req.body;
    if (mainTodo && userId) {
      // const payload = req.body;
      const newPayload = { mainTodo, userId };

      const todo = await new TodoModel(newPayload);
      todo.save();
      return res.status(201).json({ msg: "Successfully todo added" });
    }

    return res.status(400).json({ msg: "Please fill all the required fields" });
  } catch (err) {
    res.status(500).json({ msg: err.message, err: err });
  }
});

todoController.patch(
  "/addSubTodo/:id",
  authentication,
  todoAuthorization,
  async (req, res) => {
    try {
      const mainTodoId = req.params.id;
      const payload = req.body;
      if (!payload) {
        return res
          .status(400)
          .json({ msg: "Please fill all the required fields" });
      }
      const result = await TodoModel.findByIdAndUpdate(
        { _id: mainTodoId },
        { $push: { subTodos: payload } },
        { new: true }
      );

      if (!result) {
        res.status(404).json({ msg: "Error occured while updating subtodo" });
      }

      res
        .status(200)
        .json({ msg: "Successfully updated subtodo", todo: result });
    } catch (err) {
      res.status(500).json({ msg: err.message, err: err });
    }
  }
);

todoController.patch(
  "/updateMainTodo/:id",
  authentication,
  todoAuthorization,
  async (req, res) => {
    try {
      const id = req.params.id;
      const { mainTodo } = req.body;
      const updateMainTodo = await TodoModel.findByIdAndUpdate(
        id,
        { mainTodo: mainTodo },
        { new: true }
      );

      if (!updateMainTodo) {
        res.status(404).json({ msg: "Todo not found" });
      }

      res
        .status(200)
        .json({ msg: "Successfully updated mainTodo", todo: updateMainTodo });
    } catch (err) {
      res.status(500).json({ msg: err.message, err: err });
    }
  }
);

todoController.patch(
  "/updateSubTodo/:id/:subtodoid",
  authentication,
  todoAuthorization,
  async (req, res) => {
    try {
      const mainTodoId = req.params.id;
      const subTodoId = req.params.subtodoid;
      const newSubTodoDescription = req.body.todoDescription;
      const updatedMainTodo = await TodoModel.updateOne(
        { _id: mainTodoId, "subTodos._id": subTodoId },
        { $set: { "subTodos.$.todoDescription": newSubTodoDescription } },
        { new: true }
      );

      if (!updatedMainTodo) {
        return res.status(404).json({ message: "not able to update" });
      }

      return res.status(200).json({
        message: "successfully updated subTodo",
        todo: updatedMainTodo,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.msg, err: err });
    }
  }
);

todoController.delete(
  "/deleteMainTodo/:id",
  authentication,
  todoAuthorization,
  async (req, res) => {
    try {
      const mainTodoId = req.params.id;
      const deletedMainTodo = await TodoModel.findByIdAndDelete({
        _id: mainTodoId,
      });

      // console.log(deletedMainTodo);
      if (deletedMainTodo) {
        return res
          .status(200)
          .json({
            msg: "deleted successfully",
            deletedMainTodo: deletedMainTodo,
          });
      }

      return res
        .status(404)
        .json({ msg: "Wrong request", err: deletedMainTodo });
    } catch (err) {
      return res.status(500).json({ message: err.message, err: err });
    }
  }
);

todoController.patch(
  "/deleteSubTodo/:id/:subtodoid",
  authentication,
  todoAuthorization,
  async (req, res) => {
    try {
      const mainTodoId = req.params.id;
      const subTodoIdToDelete = req.params.subtodoid;

      const deletedSubTodo = await TodoModel.updateOne(
        { _id: mainTodoId },
        { $pull: { subTodos: { _id: subTodoIdToDelete } } }
      );

      if (!deletedSubTodo) {
        res.status(404).json({ message: "subtodo not found" });
      }

      res
        .status(200)
        .json({ message: "successfully deleted subtodo", res: deletedSubTodo });
    } catch (err) {
      res.status(500).json({ message: err.message, error: err });
    }
  }
);

module.exports = {
  todoController,
};
