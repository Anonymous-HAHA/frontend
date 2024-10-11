import React from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { AiFillSound } from "react-icons/ai";
// import { IoSettings } from "react-icons/io5"; // Settings icon
import { GiBookCover } from "react-icons/gi"; // Book cover icon
import { RiLogoutBoxRFill } from "react-icons/ri"; // Logout icon
import { FaHome } from "react-icons/fa"; // Home icon
// import { MdDashboard } from "react-icons/md"; 

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

  const goToSound = () => {
    navigate("/admin/create/sound"); // Navigate to Admin Settings
  };

  // const goToDashboard = () => {
  //   navigate("/admin/dashboard"); // Navigate to Admin Dashboard
  // };

  return (
    <footer className="flex justify-around items-center bg-gray-100 p-4 shadow-md mt-auto">
      <button
        type="button"
        className="w-1/5 text-center px-4 py-2 hover:bg-gray-300 rounded-md font-bold transition duration-200 ease-in-out"
        onClick={goToHome} // Navigate on button click
      >
        <FaHome className="text-2xl mb-1" />
      </button>
      <button
        type="button"
        className="w-1/5 text-center px-4 py-2 hover:bg-gray-300 rounded-md font-bold transition duration-200 ease-in-out"
        onClick={goToCreatePoem} // Navigate on button click
      >
        <GiBookCover className="text-2xl mb-1" />
      </button>
      <button
        type="button"
        className="w-1/5 text-center px-4 py-2 hover:bg-gray-300 rounded-md font-bold transition duration-200 ease-in-out"
        onClick={goToSound} // Navigate to Dashboard
      >
        <AiFillSound className="text-2xl mb-1" />
      </button>
      {/* <button
        type="button"
        className="w-1/5 text-center px-4 py-2 hover:bg-gray-300 rounded-md font-bold transition duration-200 ease-in-out"
        onClick={} // Navigate to Settings
      >
        <IoSettings className="text-2xl mb-1" /> 
      </button> */}
      <button
        type="button"
        className="w-1/5 text-center px-4 py-2 hover:bg-gray-300 rounded-md font-bold transition duration-200 ease-in-out"
        onClick={logOut} // Log out on button click
      >
        <RiLogoutBoxRFill className="text-2xl mb-1" />
      </button>
    </footer>
  );
}

export default AdminFooterComponent;
