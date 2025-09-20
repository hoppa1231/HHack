import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import QueryProvider from "./providers/QueryProvider";
import NewsPage from "../pages/NewsPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <QueryProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/news" />} />
          <Route path="/news" element={<NewsPage />} />
        </Routes>
      </QueryProvider>
    </BrowserRouter>
  );
}
