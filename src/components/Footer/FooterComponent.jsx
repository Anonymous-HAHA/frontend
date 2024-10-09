import React from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

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

  return (
    <footer className="flex justify-around items-center bg-gray-100 p-4 shadow-md">
      <button
        type="button"
        className="w-1/3 text-center px-4 py-2 hover:bg-gray-300 rounded-md font-bold"
        onClick={goToHome} // Navigate to Home on button click
      >
        Home
      </button>
      <button
        type="button"
        className="w-1/3 text-center px-4 py-2 hover:bg-gray-300 rounded-md font-bold"
        onClick={goToPoems} // Navigate to Poems on button click
      >
        Poems
      </button>
      <button
        type="button"
        className="w-1/3 text-center px-4 py-2 hover:bg-gray-300 rounded-md font-bold"
        onClick={logOut} // Logout on button click
      >
        Sign out
      </button>
    </footer>
  );
}

export default FooterComponent;
