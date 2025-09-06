import Todo from '../models/TodoModel.js';


// GET all todos for the authenticated user
export const getTodos = async (req, res) => {
  const userId = req.user.id; 
  try {
    const todos = await Todo.find({ userId }).populate("userId", "username email");
    res.status(200).json({
      message: "Todos fetched successfully",
      requiredTodos: todos
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching todos" });
  }
};

// POST create new todo for the authenticated user
export const addTodo = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id; 
  try {
    const todo = new Todo({ title, description, userId });
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(400).json({ error: "Error creating todo" });
  }
};

// PUT update todo for the authenticated user
export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, description, completed, important } = req.body;
  const userId = req.user.id; // Get user ID from the token payload
  try {
    const todo = await Todo.findOne({ _id: id, userId });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found or not owned by user" });
    }
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description, completed, important },
      { new: true }
    );
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(400).json({ error: "Error updating todo" });
  }
};


// DELETE todo for the authenticated user
export const deleteTodo = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Get user ID from the token payload
  try {
    const deleted = await Todo.findOneAndDelete({ _id: id, userId });
    if (!deleted) {
      return res.status(404).json({ message: "Todo not found or not owned by user" });
    }
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Error deleting todo" });
  }
};

