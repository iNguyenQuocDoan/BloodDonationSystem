import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { LoginPage } from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import { RegisterPage } from "./pages/auth/Register";
import Contact from "./pages/home/Contact";
import AboutUs from "./pages/home/AboutUs";

import "./App.css";
import LayoutDeFault from "./Layouts/LayoutDefault";
import Homepage from "./pages/home";
import EmergencyRequest from "./pages/home/EmergencyRequest"; // đã thêm trang EmergencyRequest 6/6/2025 By Vượng
import DonateBlood from "./pages/home/DonateBlood";
import { FAQPage } from "./pages/home/FAQ";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<LayoutDeFault />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/contact" element={<Contact />} />{" "}
            {/* đã sửa thêm trang contact nha*/}
            <Route path="aboutus" element={<AboutUs />} />{" "}
            {/* đã sửa thêm trang about us 6/6/2025 đã đông bộ với footer*/}
            <Route path="/emergency" element={<EmergencyRequest />} />
            <Route path="/contact" element={<Contact />} />{" "}
            {/* đã sửa thêm trang contact nha*/}
            <Route path="/" element={<Homepage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="faq" element={<FAQPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
