import { useDispatch, useSelector } from "react-redux";
import { getProfileThunk, loginUserThunk, logout, registerUserThunk } from "./authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  return {
    user,
    loading,
    error,
    login: (credentials) => dispatch(loginUserThunk(credentials)),
    registerUser: (data) => dispatch(registerUserThunk(data)),
    profile: () => dispatch(getProfileThunk()),
    logout: () => dispatch(logout()),
  };
};
