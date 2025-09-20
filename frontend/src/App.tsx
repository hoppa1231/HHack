import type { ReactNode } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { auth } from "./shared/auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import News from "./pages/News";

function PrivateRoute({ children }: { children: ReactNode }) {
  const token = auth.get();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: 16 }}>
      
    </div>
  );
}
