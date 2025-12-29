import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.userInfo);
  const token = localStorage.getItem("token");

  // console.log("AdminRoute - Token:", token);
  // console.log("AdminRoute - User:", user);
  // console.log("AdminRoute - User Role:", user);

  if (user === undefined) {
    return null; 
  }


  if (!token || !user || user.role !== "admin") {
    console.log("Redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
