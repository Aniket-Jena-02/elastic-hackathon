import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Guide from "./pages/Guide.jsx";
import Interchange from "./pages/Interchange.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guide/:id" element={<Guide />} />
        <Route path="/interchange" element={<Interchange />} />
      </Routes>
    </div>
  );
}
