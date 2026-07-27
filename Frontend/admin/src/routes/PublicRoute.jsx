import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { logout } from "../hooks/authSlice";

const PublicRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo && userInfo.role !== "admin") {
      dispatch(logout());
    }
  }, [userInfo, dispatch]);

  if (userInfo && userInfo.role === "admin") return <Navigate to="/" replace />;
  if (userInfo && userInfo.role !== "admin") return null;

  return children;
};

export default PublicRoute;
