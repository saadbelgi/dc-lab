import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./screens/Auth";

const App = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/"
        element={
          localStorage.getItem("persist") ? (
            localStorage.getItem("role") === "ADMIN" ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/teacher/dashboard" replace />
            )
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
    </Routes>
  );
};
export default App;
