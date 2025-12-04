import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProfileThunk, logout } from "../../hooks/auth/authSlice";

const ProfilePage = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      dispatch(getProfileThunk());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user === null && !loading) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading || (!user && user !== null)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}</h1>
        <p className="text-gray-600 mb-2">Email: {user?.email}</p>
        <p className="text-gray-500 text-sm">Token stored successfully ✅</p>

        <button
          onClick={() => {
            dispatch(logout());
            navigate("/login");
          }}
          className="bg-red-500 mt-4 text-white px-6 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
