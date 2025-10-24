
import { Routes, Route, Navigate} from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./Register";
import Todos from "./Todos";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={<LoginForm  />}
        />
        <Route
          path="/register"
          element={<RegisterForm  />}
        />
        <Route
          path="/todos"
          element={
            <ProtectedRoute>
              <Todos/>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      
    </>
  );
}

export default App;
