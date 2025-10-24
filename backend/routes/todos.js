import { Router } from "express";
import {getTodos,addTodo,updateTodo,deleteTodo} from '../controllers/todoController.js'
import { verifyToken } from "../middlewares/authenticate.js";

const todoRoutes=Router()

todoRoutes.get("/todos", verifyToken, getTodos);
todoRoutes.post("/todos", verifyToken, addTodo);
todoRoutes.put("/todos/:id", verifyToken, updateTodo);
todoRoutes.delete("/todos/:id", verifyToken, deleteTodo);


export default todoRoutes;
