import { useEffect } from "react";
import Cookies from "js-cookie";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = ({allowedRoles}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = Cookies.get("jwtToken");
    if (jwtToken === undefined) {
      navigate("/login", { replace: true });
    }
    const role = Cookies.get("role");
    if (!allowedRoles.includes(role)) {
      navigate("/", { replace: true });
    }
  });

  return (
    <>
      <Outlet />
    </>
  );
};

export default ProtectedRoute;