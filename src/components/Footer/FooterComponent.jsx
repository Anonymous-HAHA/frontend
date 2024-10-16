import React from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { IoSettings } from "react-icons/io5";
import { GiBookCover } from "react-icons/gi";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { FaHome } from "react-icons/fa";
import { AiFillSound } from "react-icons/ai";
import { MdOutlineBrush } from "react-icons/md"; // Drawing icon

function FooterComponent() {
  const navigate = useNavigate();

  const logOut = () => {
    Cookies.remove("jwtToken");
    console.log("Logged out");
    navigate("/login", { replace: true });
  };

  const goToHome = () => {
    navigate("/"); // Navigate to the Home page
  };

  const goToPoems = () => {
    navigate("/poems"); // Navigate to the Poems page
  };

  const goToSettings = () => {
    navigate("/settings"); // Navigate to the Settings page
  };

  const goToSounds = () => {
    navigate("/sounds"); // Navigate to the Sounds page
  };

  const goToDrawings = () => {
    navigate("/drawings"); // Navigate to the Drawings page
  };

  return (
    <footer className="flex justify-around items-center bg-gray-100 p-4 shadow-md">
      <button
        type="button"
        className="w-1/5 flex flex-col items-center text-center px-4 py-2 hover:bg-gray-300 rounded-md font-bold"
        onClick={goToHome}
      >
        <FaHome className="text-2xl mb-1" />
      </button>
      <button
        type="button"
        className="w-1/5 flex flex-col items-center text-center px-4 py-2 hover:bg-gray-300 rounded-md font-bold"
        onClick={goToPoems}
      >
        <GiBookCover className="text-2xl mb-1" />
      </button>
      <button
        type="button"
        className="w-1/5 flex flex-col items-center text-center px-4 py-2 hover:bg-gray-300 rounded-md font-bold"
        onClick={goToSettings}
      >
        <IoSettings className="text-2xl mb-1" />
      </button>
      <button
        type="button"
        className="w-1/5 flex flex-col items-center text-center px-4 py-2 hover:bg-gray-300 rounded-md font-bold"
        onClick={goToSounds}
      >
        <AiFillSound className="text-2xl mb-1" />
      </button>
      <button
        type="button"
        className="w-1/5 flex flex-col items-center text-center px-4 py-2 hover:bg-gray-300 rounded-md font-bold"
        onClick={goToDrawings} // Navigate to Drawings page
      >
        <MdOutlineBrush className="text-2xl mb-1" /> {/* Drawing icon */}
      </button>
      <button
        type="button"
        className="w-1/5 flex flex-col items-center text-center px-4 py-2 hover:bg-gray-300 rounded-md font-bold"
        onClick={logOut}
      >
        <RiLogoutBoxRFill className="text-2xl mb-1" />
      </button>
    </footer>
  );
}

export default FooterComponent;
