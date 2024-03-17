import UserTable from "../components/UserTable";
import Navbar from "../components/Navbar";
import { teacherData } from "../constants/tableData";

const Admin = () => {
  const tableTitle =
    localStorage.getItem("role") === "ADMIN"
      ? "Teacher Table"
      : "Courses Table";
  return (
    <div className="w-screen h-screen bg-slate-400">
      <Navbar />
      <div className="m-5">
        <UserTable title={tableTitle} tableData={teacherData} />
      </div>
    </div>
  );
};

export default Admin;
