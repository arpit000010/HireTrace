import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./context/AuthProvider.jsx";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#12121a",
              color: "#f1f5f9",
              border: "1px solid #ffffff12",
              borderRadius: "10px",
              fontSize: "14px",
            },
            success: { iconTheme: { primary: "#34d399", secondary: "#12121a" } },
            error: { iconTheme: { primary: "#f87171", secondary: "#12121a" } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
