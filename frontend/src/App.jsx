// App.jsx – root component with providers and routes.

import { Routes, Route } from "react-router-dom";
import { AdminProvider } from "./contexts/AdminContext";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import SuggestionFAB from "./components/SuggestionFAB";
import Home from "./pages/Home";
import SubjectPage from "./pages/SubjectPage";
import MessagesPage from "./pages/MessagesPage";

export default function App() {
  return (
    <AdminProvider>
      {/* Fixed mesh gradient background */}
      <div className="mesh-bg" />

      {/* Layout */}
      <div className="relative min-h-screen">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/subject/:subjectId" element={<SubjectPage />} />
          <Route path="/messages" element={<MessagesPage />} />
        </Routes>

        <BottomNav />
        <SuggestionFAB />
      </div>
    </AdminProvider>
  );
}
