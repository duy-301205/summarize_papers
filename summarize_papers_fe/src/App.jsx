import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./assets/pages/LandingPage";
import Auth from "./assets/pages/Auth";
import Dashboard from "./assets/pages/Dashboard";
import UploadArticle from "./assets/pages/UploadArticle";
import ArticleAnalysis from "./assets/pages/ArticleAnalysis";
import MySummaries from "./assets/pages/MySummaries";

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang chủ */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<UploadArticle />} />
        <Route path="/analysis" element={<ArticleAnalysis />} />
        <Route path="/summaries" element={<MySummaries />} />

        <Route
          path="*"
          element={
            <div className="flex h-screen items-center justify-center font-bold">
              404 - Trang này không tồn tại Duy ơi!
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
