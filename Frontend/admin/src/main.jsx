import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

import store from "./store.js";
import { Provider } from "react-redux";

import { CartProvider } from "./context/CartContext";
import { QtyTotalsProvider } from "./context/QtyAndTotalsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <CartProvider>
        <QtyTotalsProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QtyTotalsProvider>
      </CartProvider>
    </Provider>
  </React.StrictMode>
);
