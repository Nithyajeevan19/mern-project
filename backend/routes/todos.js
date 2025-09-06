import { Router } from "express";
import {getTodos,addTodo,updateTodo,deleteTodo} from '../controllers/todoController.js'

const todoRoutes=Router()


todoRoutes.get("/todos",getTodos);       // GET all
// todoRoutes.get("/todos/:id", getTodoById); // GET by ID
todoRoutes.post("/todos",addTodo);       // CREATE
todoRoutes.put("/todos/:id", updateTodo);  // UPDATE
todoRoutes.delete("/todos/:id",deleteTodo); // DELETE


export default todoRoutes;
