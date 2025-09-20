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
      <nav style={{ display:"flex", gap:12, marginBottom:16 }}>
        <Link to="/news">News</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/news" element={<PrivateRoute><News/></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/news" replace/>} />
      </Routes>
    </div>
  );
}
