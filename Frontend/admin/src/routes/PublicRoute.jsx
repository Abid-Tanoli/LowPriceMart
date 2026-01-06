import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  if (userInfo) return <Navigate to="/" replace />;
  return children;
};

export default PublicRoute;
