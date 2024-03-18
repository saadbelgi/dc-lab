import { courseData, userData } from "../constants/tableData";
import { setUsers } from "../app/features/UsersSlice";
import { useAppDispatch, useAppSelector } from "../app/store";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setCourses } from "../app/features/CoursesSlice";
import spitLogo from "../assets/spitLogo.jpg";

const Auth: React.FC = () => {
  const [role, setRole] = useState<string>("admin");
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const users = useAppSelector((state) => state.users.data);

  useEffect(() => {
    dispatch(setUsers(userData));
    dispatch(setCourses(courseData));
  }, []);

  const handleRoleChange = (selectedRole: string) => {
    setRole(selectedRole);
  };

  const handleSubmit = () => {
    if (!id.trim() || !password.trim()) {
      setError("Please fill out all fields.");
    } else {
      setError(null);
      const user = users.find((user) => user.id === id && user.role === role);
      if (!user) {
        setError("User not found.");
        return;
      }
      if (user.password !== password) {
        setError("Incorrect password.");
        return;
      }
      localStorage.setItem("id", id);
      localStorage.setItem("role", role.toUpperCase());
      localStorage.setItem("name", user.name);
      localStorage.setItem("password", password);
      localStorage.setItem("persist", "true");
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "teacher") {
        navigate("/teacher/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex py-8 justify-center">
        <img
          src={spitLogo}
          alt="spit"
          className="rounded-full h-14 w-14 me-3"
        />
        <header className="text-center text-3xl font-bold mt-2">
          Sardar Patel Institute of Technology
        </header>
      </div>

      <div className="flex items-center justify-center">
        <div className="bg-white p-8 rounded-md shadow-lg w-96 mt-4">
          <h2 className="text-2xl font-semibold mb-8 text-center my-2">
            Welcome back🙂!
          </h2>

          <div className="flex mb-4">
            <button
              className={`flex-1 py-2 rounded-tl-md rounded-bl-md border ${
                role === "admin"
                  ? "border-blue-600 text-blue-600"
                  : "border-gray-300"
              }`}
              onClick={() => handleRoleChange("admin")}
            >
              Admin
            </button>
            <button
              className={`flex-1 py-2 border ${
                role === "teacher"
                  ? "border-blue-600 text-blue-600"
                  : "border-gray-300"
              }`}
              onClick={() => handleRoleChange("teacher")}
            >
              Teacher
            </button>
            <button
              className={`flex-1 py-2 rounded-tr-md rounded-br-md border ${
                role === "student"
                  ? "border-blue-600 text-blue-600"
                  : "border-gray-300"
              }`}
              onClick={() => handleRoleChange("student")}
            >
              Student
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {role.charAt(0).toUpperCase() + role.slice(1)} ID
            </label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full border p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <button
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-500"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
