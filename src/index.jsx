import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from '@contexts/AuthContext';
import reportWebVitals from "./reportWebVitals.js";
import { NotificationProvider } from "@/hooks/notifications/useNotifications"; // ✅ NUEVO

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
