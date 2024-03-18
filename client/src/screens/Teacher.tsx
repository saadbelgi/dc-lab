import Navbar from "../components/Navbar";
import { useAppDispatch, useAppSelector } from "../app/store";
import { userData } from "../constants/tableData";
import { setUsers } from "../app/features/UsersSlice";
import { useEffect } from "react";
import CourseTable from "../components/CourseTable";

const Teacher = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setUsers(userData));
  }, []);
  const teacher = localStorage.getItem("name") || "teacher";
  const courses = useAppSelector((state) => state.courses.data);
  const allotedCourses = courses.filter((course) => course.teacher === teacher);
  return (
    <div className="w-screen h-screen bg-slate-400">
      <Navbar />
      <div className="m-5">
        <CourseTable title={"Alloted Courses"} tableData={allotedCourses} />
      </div>
    </div>
  );
};

export default Teacher;
