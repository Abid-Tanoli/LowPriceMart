import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../services/adminDashboard";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Dashboard error", error);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Stat title="Total Users" value={stats.users} icon="👤" />
        <Stat title="Total Orders" value={stats.orders} icon="📦" />
        <Stat title="Total Products" value={stats.products} icon="🛒" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <QuickAction
            title="Add Product"
            subtitle="Create new product"
            icon="➕"
            color="bg-blue-100 text-blue-600"
            onClick={() => navigate("/create-product")}
          />

          <QuickAction
            title="View Orders"
            subtitle="Manage orders"
            icon="📦"
            color="bg-green-100 text-green-600"
            onClick={() => navigate("/orders")}
          />

          <QuickAction
            title="View Users"
            subtitle="User management"
            icon="👤"
            color="bg-purple-100 text-purple-600"
            onClick={() => navigate("/users")}
          />
        </div>
      </div>
    </div>
  );
};

const Stat = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <p className="text-gray-500">{title}</p>
    <h2 className="text-2xl font-bold">
      {icon} {value ?? "—"}
    </h2>
  </div>
);

const QuickAction = ({ title, subtitle, icon, color, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-4 p-4 rounded-lg border cursor-pointer hover:shadow-md transition"
  >
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
      <span className="text-xl">{icon}</span>
    </div>

    <div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  </div>
);

export default Dashboard;
