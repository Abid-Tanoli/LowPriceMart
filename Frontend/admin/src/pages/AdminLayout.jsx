import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const baseClass =
    "px-4 py-2 rounded transition-colors duration-200 text-gray-300 hover:bg-gray-700 hover:text-white";
  const activeClass = "bg-blue-600 text-white";

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-10 mt-6 text-center">Admin Panel</h1>

          <nav className="flex flex-col gap-3">
            <NavLink to="" end className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ""}`}>
              Dashboard
            </NavLink>

            <NavLink to="users" className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ""}`}>
              Users
            </NavLink>

            <NavLink to="orders" className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ""}`}>
              Orders
            </NavLink>

            <NavLink to="products" className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ""}`}>
              Products
            </NavLink>

            <NavLink to="create-product" className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ""}`}>
              Add Product
            </NavLink>
          </nav>
        </div>

        <button
          onClick={logoutHandler}
          className="bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-colors duration-200"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
