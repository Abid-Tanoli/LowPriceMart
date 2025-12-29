import { NavLink, Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const base =
    "px-3 py-2 rounded transition text-gray-300 hover:bg-gray-700 hover:text-white";

  const active = "bg-blue-600 text-white";

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white p-5 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-8 mt-6">Admin Panel</h2>

          <div className="flex flex-col gap-3">
            <NavLink
              to=""
              end
              className={({ isActive }) =>
                `${base} ${isActive ? active : ""}`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="users"
              className={({ isActive }) =>
                `${base} ${isActive ? active : ""}`
              }
            >
              Users
            </NavLink>

            <NavLink
              to="orders"
              className={({ isActive }) =>
                `${base} ${isActive ? active : ""}`
              }
            >
              Orders
            </NavLink>

            <NavLink
              to="products"
              className={({ isActive }) =>
                `${base} ${isActive ? active : ""}`
              }
            >
              Products
            </NavLink>

            <NavLink
              to="create-product"
              className={({ isActive }) =>
                `${base} ${isActive ? active : ""}`
              }
            >
              Add Product
            </NavLink>
          </div>
        </div>

        <button
          onClick={logoutHandler}
          className="bg-red-600 hover:bg-red-700 text-white py-2 rounded mt-6 transition"
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
