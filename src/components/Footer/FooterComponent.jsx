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

  return (
    <button
      type="button"
      className="block w-full text-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
      onClick={logOut}
      style={{
        borderRadius: "8px", // Adjust the border-radius for curved edges
        fontWeight: "bold", // Make the text bold
      }}
    >
      Sign out
    </button>
  );
}

export default FooterComponent;
