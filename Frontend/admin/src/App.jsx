import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/client/Index";
import Cart from "./pages/client/Cart";
import Login from "./pages/auth/Login";
import AppLayout from "./components/global/AppLayout";
import Product from "./pages/client/Product";
import Index from "./pages/client/Index"
import Register from "./pages/auth/Register";
import CheckoutPage from "./pages/client/CheckoutPage";
import OrderSuccess from "./pages/client/OrderSuccess";
import ProductDetails from "./pages/client/ProductDetails";
import ProfilePage from "./pages/client/ProfilePage";
import OrderList from "./pages/client/OrderList";
import OrderDetails from "./pages/client/orderDetails"
import InvoicePage from "./pages/client/InvoicePage";

const App = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/Index" element={<Index />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/orders" element={<OrderList />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/invoice/:id" element={<InvoicePage />} />

      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />


    </Routes>
  );
};

export default App;
