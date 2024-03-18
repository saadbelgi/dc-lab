import TeacherTable from "../components/TeacherTable";
import Navbar from "../components/Navbar";
import { useAppDispatch, useAppSelector } from "../app/store";
import { userData } from "../constants/tableData";
import { setUsers } from "../app/features/UsersSlice";
import { useEffect } from "react";

const Admin = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setUsers(userData));
  }, []);
  const users = useAppSelector((state) => state.users.data);
  const teachers = users.filter((user) => user.role === "teacher");
  return (
    <div className="w-screen h-screen bg-slate-400">
      <Navbar />
      <div className="m-5">
        <TeacherTable title={"Teacher Table"} tableData={teachers} />
      </div>
    </div>
  );
};

export default Admin;
