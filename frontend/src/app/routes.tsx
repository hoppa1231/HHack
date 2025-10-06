import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import QueryProvider from "./providers/QueryProvider";
import NewsPage from "../pages/NewsPage";
import Login from "../pages/Login";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <QueryProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/auth" element={<Login />} />
        </Routes>
      </QueryProvider>
    </BrowserRouter>
  );
}
