import React from "react";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Orders from "./pages/Orders";
import Products from "./pages/Products"
import Login from "./pages/auth/Login";
import AdminRoute from "./routes/AdminRoute";
import PublicRoute from "./routes/PublicRoute";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/auth/Register";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>}/>
        <Route path="/register" element={<PublicRoute><Register/></PublicRoute>}/>
        <Route path="/" element={<AdminRoute><Dashboard /></AdminRoute>}/>
        <Route path="/users" element={<AdminRoute><Users /></AdminRoute>}/>
        <Route path="/orders" element={<AdminRoute><Orders /></AdminRoute>}/>
        <Route path="/products" element={<AdminRoute><Products /></AdminRoute>}/>
        
        {/* Add this catch-all route */}
        <Route path="*" element={<div><h1>404 - Page Not Found</h1></div>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;