import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Orders from "./pages/Orders";
import Products from "./pages/Products"

import Login from "./pages/auth/Login";

import AdminRoute from "./routes/AdminRoute";
import PublicRoute from "./routes/PublicRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>}/>

        <Route path="/" element={<AdminRoute><Dashboard /></AdminRoute>}/>

        <Route path="/users" element={<AdminRoute><Users /></AdminRoute>}/>

        <Route path="/orders" element={<AdminRoute><Orders /></AdminRoute>}/>

        <Route path="/products" element={<AdminRoute><Products /></AdminRoute>}/>
     </Routes>
   </BrowserRouter>
  );
};

export default App;
