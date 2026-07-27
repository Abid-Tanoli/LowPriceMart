import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { Toaster } from "sonner";
import "./index.css";

import store from "./store.js";
import { Provider } from "react-redux";

import { QtyTotalsProvider } from "./context/QtyAndTotalsContext";
import CartProvider from "./context/CartContext.jsx";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <CartProvider>
          <QtyTotalsProvider>
            <BrowserRouter>
              <App />
              <Toaster richColors position="top-right" />
            </BrowserRouter>
          </QtyTotalsProvider>
        </CartProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
