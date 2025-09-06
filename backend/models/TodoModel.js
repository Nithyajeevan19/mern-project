import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    completed: { type: Boolean, default: false },
    important: { type: Boolean, default: false },
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
}, { timestamps: true });


const Todo = mongoose.model('Todo', todoSchema);

export default Todo