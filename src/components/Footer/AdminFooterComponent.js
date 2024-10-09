import React from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

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
        className="w-1/3 text-center px-4 py-2 hover:bg-gray-300 rounded-md font-bold"
        onClick={goToHome} // Navigate on button click
      >
        Home
      </button>
      <button
        type="button"
        className="w-1/3 text-center px-4 py-2 hover:bg-gray-300 rounded-md font-bold"
        onClick={goToCreatePoem} // Navigate on button click
      >
        Create Poem
      </button>
      <button
        type="button"
        className="w-1/3 text-center px-4 py-2 hover:bg-gray-300 rounded-md font-bold"
        onClick={logOut}
      >
        Sign out
      </button>
    </footer>
  );
}

export default AdminFooterComponent;
