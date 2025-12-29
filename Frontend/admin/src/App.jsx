import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminRoute from "./routes/AdminRoute";
import PublicRoute from "./routes/PublicRoute";

import AdminLayout from "./pages/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import CreateProduct from "./pages/CreateProduct";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        <Route path="/" element={ <AdminRoute> <AdminLayout /> </AdminRoute> } >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="create-product" element={<CreateProduct />} />
        </Route>

        <Route path="*" element={<h1 className="text-center mt-20 text-2xl">404 - Page Not Found</h1>} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
