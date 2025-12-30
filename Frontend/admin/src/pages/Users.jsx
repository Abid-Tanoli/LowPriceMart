import { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const usersArray = Array.isArray(res.data) ? res.data : res.data.users || [];
      setUsers(usersArray);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    }
    setLoading(false);
  };

  fetchUsers();
}, []);
  if (loading) return <p className="text-center py-10 text-xl font-semibold">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Users Management</h1>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full border-collapse bg-white">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold">Email</th>
              <th className="p-3 font-semibold">Role</th>
              <th className="p-3 font-semibold">Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${user.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
