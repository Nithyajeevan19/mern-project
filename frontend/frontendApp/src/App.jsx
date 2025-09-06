import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AuthForm from "./Auth";
import Todos from "./Todos";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // This function will be passed down to AuthForm
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    navigate("/todos");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/auth");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [isAuthenticated]); // Rerun effect when isAuthenticated changes

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/todos" /> : <Navigate to="/auth" />}
      />
      <Route path="/auth" element={<AuthForm onAuthSuccess={handleAuthSuccess} />} />
      <Route
        path="/todos"
        element={isAuthenticated ? <Todos onLogout={handleLogout} /> : <Navigate to="/auth" />}
      />
    </Routes>
  );
}

export default App;