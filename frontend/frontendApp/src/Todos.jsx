import { useState,useEffect } from "react"

import { Circle, CheckCircle } from "lucide-react";
import { FaStar, FaTrash } from "react-icons/fa";


function Todos() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showTodos, setShowTodos] = useState(true);
  const [filter, setFilter] = useState("all");

  const getToken = () => localStorage.getItem("token");

  async function fetchTodos() {
    try {
      const res = await fetch("http://localhost:7000/api/todos", {
        headers: {
          "Authorization": `Bearer ${getToken()}` // Crucial: Send the token
        }
      });
      if (!res.ok) {
        if (res.status === 401) onLogout(); // Redirect on unauthorized
        throw new Error(`Failed to fetch: ${res.status}`);
      }
      const data = await res.json();
      setTodos(Array.isArray(data.requiredTodos) ? data.requiredTodos : data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTodo = { title, description };
      const response = await fetch("http://localhost:7000/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}` // Send the token
        },
        body: JSON.stringify(newTodo),
      });
      if (!response.ok) {
        if (response.status === 401) onLogout();
        throw new Error("Failed to add todo");
      }
      setTitle("");
      setDescription("");
      await fetchTodos();
      setShowTodos(true);
    } catch (err) {
      console.error(err);
    }
  };


  // The rest of your functions (toggleTodoCompletion, toggleStarCompletion, handleDelete)
  // need to be updated to send the token as well.
  // For example:

  async function toggleTodoCompletion(id) {
    
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${getToken()}` // Send the token
      },
      body: JSON.stringify({ completed: !todo.completed }),
    };
    const response = await fetch(`http://localhost:7000/api/todos/${id}`, options);
    if (response.ok) {
        await fetchTodos();
    } else if (response.status === 401) {
        onLogout();
    }
    return true;
  }
  // Make similar changes to `toggleStarCompletion` and `handleDelete`

  const filteredTodos = Array.isArray(todos) ? todos.filter(todo => {
    if (filter === "completed") {
      return todo.completed;
    } else if (filter === "important") {
      return todo.important;
    } else {
      return true; // Use true to show all todos
    }
  }) : [];

    return (
      <>
        <div className="min-h-screen bg-neutral-900 text-white p-6">
          <div className="flex justify-between items-center gap-2 mb-6">
            <div className="mb-5 flex flex-row">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-12 text-blue-500  mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              <h1 className="text-2xl font-semibold text-indigo-400 mt-2">Tasks</h1>
            </div>
            <div className="flex content-center justify-around items-center mb-6 mr-12 w-500px">
                <p className="text-orange-400 mr-90 text-2xl">Manage your tasks efficiently</p>
                  <button onClick={()=>{setShowTodos(prev=>!prev)}} className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white text-2xl shadow-md hover:bg-green-600 transition">
                    +
                  </button>
            </div>
          </div>

          {showTodos ? (
            <div className="flex flex-row justify-around items-center w-140 ml-80 mb-10">
              <button onClick={() => setFilter("completed")} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                  completed
                </span>
              </button>
              <button onClick={() => setFilter("important")} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                  important
                </span>
              </button>
              <button onClick={() => setFilter("all")} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                  All
                </span>
              </button>
            </div>
          ) : null}
          
          {showTodos ? 
          (
            <ul className="flex flex-col gap-3">
              {filteredTodos.map((todo) => (
                <li
                  key={todo._id}
                  className="flex items-center justify-between bg-neutral-800 px-4 py-3 rounded-md hover:bg-neutral-700 transition"
                >
                  {/* Left side: Circle or Tick + Text */}
                  <div className="flex items-center gap-3 flex-grow">
                    {todo.completed ? (
                      <CheckCircle
                        className="w-5 h-5 text-green-400 cursor-pointer"
                        onClick={() => toggleTodoCompletion(todo._id)}
                      />
                    ) : (
                      <Circle
                        className="w-5 h-5 text-gray-400 cursor-pointer"
                        onClick={() => toggleTodoCompletion(todo._id)}
                      />
                    )}
                    <div className="flex flex-col">
                      <span className={todo.completed ? "line-through text-gray-400" : "text-xl"}>
                        {todo.title}
                      </span>
                      <p className="text-gray-400 text-sm">{todo.description}</p>
                    </div>
                  </div>
                  {/* Right side: Star + Trash */}
                  <div className="flex items-center gap-4">
                    <FaStar
                      onClick={() => toggleStarCompletion(todo._id)}
                      className={todo.important ? "w-5 h-5 text-yellow-400 cursor-pointer" : "w-5 h-5 text-gray-400 cursor-pointer"}
                    />
                    <FaTrash
                      onClick={() => handleDelete(todo._id)}
                      className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700"
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-transparent">
              <h1 className="text-2xl font-bold">Todo</h1>
              <input
                className="w-80 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-9"
                placeholder="Title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <input
                className="w-80 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-9"
                placeholder="Description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <button type="submit" onClick={handleSubmit} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Submit
              </button>
            </div>
          )}
      </div>
    </>
  )

}


export default Todos
