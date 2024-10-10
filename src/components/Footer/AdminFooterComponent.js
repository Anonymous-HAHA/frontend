import React from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { IoSettings } from "react-icons/io5";
import { GiBookCover } from "react-icons/gi";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { FaHome } from "react-icons/fa";

function AdminFooterComponent() {
  const navigate = useNavigate();

  const logOut = () => {
    Cookies.remove("jwtToken");
    console.log("Logged out");
    navigate("/login", { replace: true });
  };

  const goToCreatePoem = () => {
    navigate("/admin/create/poem"); // Navigate to the Create Poem page
  };

  const goToHome = () => {
    navigate("/admin"); // Navigate back to Admin Home
  };

  return (
    <footer className="flex justify-around items-center bg-gray-100 p-4 shadow-md mt-auto">
      <button
        type="button"
        className="w-1/3 text-center px-4 py-2 hover:bg-gray-300 rounded-md font-bold transition duration-200 ease-in-out"
        onClick={goToHome} // Navigate on button click
      >
        <FaHome className="text-2xl mb-1" />
      </button>
      <button
        type="button"
        className="w-1/3 text-center px-4 py-2 hover:bg-gray-300 rounded-md font-bold transition duration-200 ease-in-out"
        onClick={goToCreatePoem} // Navigate on button click
      >
        <GiBookCover className="text-2xl mb-1" />
      </button>
      <button
        type="button"
        className="w-1/3 text-center px-4 py-2 hover:bg-gray-300 rounded-md font-bold transition duration-200 ease-in-out"
        onClick={logOut}
      >
        <RiLogoutBoxRFill className="text-2xl mb-1" />
      </button>
    </footer>
  );
}

export default AdminFooterComponent;
