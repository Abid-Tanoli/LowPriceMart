import { Routes, Route } from "react-router-dom";
import Home from "./pages/Index";
import Cart from "./pages/Cart";
import Login from "./pages/auth/Login";
import AppLayout from "./components/global/AppLayout";
import Product from "./pages/Product";
import Index from "./pages/Index"
import Register from "./pages/auth/Register";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccess from "./pages/OrderSuccess";
import ProductDetails from "./pages/ProductDetails";
import ProfilePage from "./pages/ProfilePage";
import OrderList from "./pages/OrderList";
import OrderDetails from "./pages/OrderDetails"
import InvoicePage from "./pages/InvoicePage";
import Wishlist from "./pages/Wishlist";
import PaymentResult from "./pages/PaymentResult";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import PrivateRoute from "./routes/PrivateRoute";

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
        <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
        <Route path="/payment-result" element={<PaymentResult />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default App;
