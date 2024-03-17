import logo from "../assets/logo.png";
import avatar from "../assets/defaultAvatar.jpg";
import { Link } from "react-router-dom";

const Navbar = () => {
  const role = localStorage.getItem("role")?.toLowerCase();
  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 rounded-b-lg ">
          <Link to={`${role}/dashboard`} className="flex">
            <img
              src={logo}
              className="h-10 w-10 rounded-full me-2 "
              alt="Cllg Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Sardar Patel Institute of Technology
            </span>
          </Link>
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              type="button"
              className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded="false"
              data-dropdown-toggle="user-dropdown"
              data-dropdown-placement="bottom"
            >
              <span className="sr-only">Open user menu</span>
              <img className="w-8 h-8 rounded-full" src={avatar} alt="avatar" />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
