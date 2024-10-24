import { useEffect } from "react";
import Cookies from "js-cookie";
import { Outlet, useNavigate } from "react-router-dom";
import { getToken, messaging } from '../firebase';
import axios from 'axios';
import env from '../env'; 

const ProtectedRoute = ({ allowedRoles }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = Cookies.get("jwtToken");
    if (!jwtToken) {
      navigate("/login", { replace: true });
      return;
    }

    const role = Cookies.get("role");
    if (!allowedRoles.includes(role)) {
      navigate("/", { replace: true });
      return;
    }

  }, [allowedRoles, navigate]);

  return <Outlet />;
};

export default ProtectedRoute;