import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./screens/Auth";
import Admin from "./screens/Admin";
import Teacher from "./screens/Teacher";
import Student from "./screens/Student";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin/dashboard" element={<Admin />} />
      <Route path="/teacher/dashboard" element={<Teacher />} />
      <Route path="/student/dashboard" element={<Student />} />

      {/* <Route
        path="/"
        element={
          localStorage.getItem("persist") ? (
            localStorage.getItem("role") === "ADMIN" ? (
              <Navigate to="/admin/dashboard" replace />
            ) : localStorage.getItem("role") === "TEACHER" ? (
              <Navigate to="/teacher/dashboard" replace />
            ) : (
              <Navigate to="/student/dashboard" replace />
            )
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      /> */}
    </Routes>
  );
};
export default App;
