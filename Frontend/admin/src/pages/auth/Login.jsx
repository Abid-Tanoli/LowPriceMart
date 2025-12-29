import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUserThunk } from "../../hooks/authSlice";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const { user, isAuthenticatic } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if(isAuthenticatic && user) {
      navigate("/admin")
    }
  }, [isAuthenticatic, user, navigate]);


  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUserThunk(form)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") navigate("/admin");
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <input
          name="email"
          onChange={handleChange}
          value={form.email}
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          required
        />
        <input
          name="password"
          type="password"
          onChange={handleChange}
          value={form.password}
          placeholder="Password"
          className="border p-2 w-full mb-3 rounded"
          required
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          disabled={loading}
          className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center mt-3 text-sm">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;