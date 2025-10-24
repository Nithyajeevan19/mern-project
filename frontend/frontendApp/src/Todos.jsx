import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CheckCircle2,
  Circle,
  Star,
  Trash2,
  Plus,
  LogOut,
  Filter,
  ListTodo,
  Sparkles,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Todos() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  // Search & Pagination states
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 5;

  const navigate = useNavigate();
  const getToken = () => Cookies.get("jwt_token");

  const handleLogout = () => {
    Cookies.remove("jwt_token");
    toast.info("Logged out successfully", {
      position: "top-right",
      autoClose: 2000,
      theme: "colored",
    });
    setTimeout(() => navigate("/login"), 1000);
  };

  async function fetchTodos() {
    try {
      const token = getToken();
      const res = await fetch("http://localhost:7000/api/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401) handleLogout();
        throw new Error(`Failed to fetch: ${res.status}`);
      }

      const data = await res.json();
      setTodos(Array.isArray(data.requiredTodos) ? data.requiredTodos : data);
    } catch (err) {
      console.error("Error fetching todos:", err);
      toast.error("Failed to fetch tasks", {
        position: "top-right",
        theme: "colored",
      });
    }
  }

  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.warning("Please enter a task title", {
        position: "top-right",
        theme: "colored",
      });
      return;
    }

    try {
      const token = getToken();
      const newTodo = { title, description };
      const response = await fetch("http://localhost:7000/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        if (response.status === 401) handleLogout();
        throw new Error("Failed to add todo");
      }

      setTitle("");
      setDescription("");
      setShowAddModal(false);
      await fetchTodos();
      toast.success("Task added successfully!", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to add task", {
        position: "top-right",
        theme: "colored",
      });
    }
  };

  async function handleDelete(id) {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:7000/api/todos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        await fetchTodos();
        toast.success("Task deleted", {
          position: "top-right",
          autoClose: 2000,
          theme: "colored",
        });
      } else if (response.status === 401) {
        handleLogout();
      } else {
        toast.error("Failed to delete task");
      }
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  }

  async function handleUpdate(id) {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:7000/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editTitle, description: editDesc }),
      });
      if (response.ok) {
        await fetchTodos();
        toast.success("Task updated!", { position: "top-right", autoClose: 2000, theme: "colored" });
        setEditId(null);
        setEditTitle("");
        setEditDesc("");
      } else {
        toast.error("Failed to update!", { position: "top-right", theme: "colored" });
      }
    } catch (err) {
      toast.error("Update error!", { position: "top-right", theme: "colored" });
    }
  }

  async function toggleTodoCompletion(todo) {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:7000/api/todos/${todo._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (response.ok) {
        await fetchTodos();
        toast.success(
          todo.completed ? "↩Task marked incomplete" : "Task completed!",
          {
            position: "top-right",
            autoClose: 2000,
            theme: "colored",
          }
        );
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  }

  async function toggleStarCompletion(todo) {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:7000/api/todos/${todo._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ important: !todo.important }),
      });

      if (response.ok) {
        await fetchTodos();
        toast.success(
          todo.important ? "Unmarked as important" : "Marked as important!",
          {
            position: "top-right",
            autoClose: 2000,
            theme: "colored",
          }
        );
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error("Error toggling star:", err);
    }
  }

  // Enhanced filter: search + filter type
  const filteredTodos = Array.isArray(todos)
    ? todos.filter(todo => {
        const matchesSearch =
          todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()));
        if (!matchesSearch) return false;
        if (filter === "completed") return todo.completed;
        else if (filter === "important") return todo.important;
        else return true;
      })
    : [];

  // Pagination logic
  const totalPages = Math.ceil(filteredTodos.length / todosPerPage);
  const startIdx = (currentPage - 1) * todosPerPage;
  const endIdx = startIdx + todosPerPage;
  const paginatedTodos = filteredTodos.slice(startIdx, endIdx);

  // Stats for UI cards
  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    important: todos.filter((t) => t.important).length,
  };

     return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <ToastContainer />

    {/* Header */}
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <ListTodo className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              My Tasks
            </h1>
            <p className="text-sm text-gray-600">
              {stats.completed} of {stats.total} completed
            </p>
          </div>
        </div>

        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-md"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </motion.button>
      </div>
    </motion.header>

    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <ListTodo className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Important</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.important}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search Bar */}
      <div className="mb-6 flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset to page 1 when searching
          }}
          placeholder="Search tasks..."
          className="w-full max-w-sm p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Filter Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap items-center gap-3 mb-6"
      >
        <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-md">
          {["all", "completed", "important"].map((filterType) => (
            <motion.button
              key={filterType}
              onClick={() => {
                setFilter(filterType);
                setCurrentPage(1); // Reset to page 1 on filter change
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-md font-medium capitalize transition-all ${
                filter === filterType
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {filterType === "all" && <Filter className="w-4 h-4 inline mr-2" />}
              {filterType === "completed" && (
                <CheckCircle2 className="w-4 h-4 inline mr-2" />
              )}
              {filterType === "important" && <Star className="w-4 h-4 inline mr-2" />}
              {filterType}
            </motion.button>
          ))}
        </div>

        <motion.button
          onClick={() => setShowAddModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="ml-auto flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </motion.button>
      </motion.div>

      {/* Todos List */}
      <motion.div layout className="space-y-3">
        <AnimatePresence>
          {paginatedTodos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No tasks found</p>
              <p className="text-gray-400 text-sm">Add a new task to get started!</p>
            </motion.div>
          ) : (
            paginatedTodos.map((todo, index) => (
              <motion.div
                key={todo._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                layout
                className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <motion.button
                    onClick={() => toggleTodoCompletion(todo)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="mt-1"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </motion.button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {editId === todo._id ? (
                      <>
                        <input
                          className="w-full my-1 px-3 py-2 border rounded"
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                        />
                        <textarea
                          className="w-full my-1 px-3 py-2 border rounded"
                          value={editDesc}
                          onChange={e => setEditDesc(e.target.value)}
                        />
                      </>
                    ) : (
                      <>
                        <h3 className={`text-lg font-semibold ${todo.completed ? "line-through text-gray-400" : "text-gray-900"}`}>
                          {todo.title}
                        </h3>
                        {todo.description && (
                          <p className={`text-sm mt-1 ${todo.completed ? "text-gray-300" : "text-gray-600"}`}>
                            {todo.description}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => toggleStarCompletion(todo)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 rounded-lg transition-colors ${todo.important
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-100 text-gray-400 hover:bg-yellow-50"
                      }`}
                    >
                      <Star className="w-5 h-5" fill={todo.important ? "currentColor" : "none"} />
                    </motion.button>

                    {editId === todo._id ? (
                      <>
                        <motion.button
                          onClick={() => handleUpdate(todo._id)}
                          className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                        >
                          Save
                        </motion.button>
                        <motion.button
                          onClick={() => setEditId(null)}
                          className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        onClick={() => {
                          setEditId(todo._id)
                          setEditTitle(todo.title)
                          setEditDesc(todo.description || "")
                        }}
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                      >
                        Update
                      </motion.button>
                    )}

                    <motion.button
                      onClick={() => handleDelete(todo._id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2">
          <button
            className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`px-3 py-2 rounded font-semibold
                ${currentPage === page ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}
              `}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}

    </div>

    {/* Add Task Modal */}
    <AnimatePresence>
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Task</h2>
              <motion.button
                onClick={() => setShowAddModal(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add more details..."
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <motion.button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Add Task
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);


}

export default Todos;













