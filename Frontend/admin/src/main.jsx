import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import "./index.css";
import store from "./store.js";
import { Provider } from "react-redux";
import AdminRoute from "./routes/AdminRoute.jsx";



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <CartProvider> */}
        {/* <QtyTotalsProvider> */}
            < App />
        {/* </QtyTotalsProvider> */}
      {/* </CartProvider> */}
    </Provider>
  </React.StrictMode>
);
