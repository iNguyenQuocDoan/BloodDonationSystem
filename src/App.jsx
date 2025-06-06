import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { LoginPage } from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import { RegisterPage } from "./pages/auth/Register";
import Contact from "./pages/home/Contact";
import LayoutDeFault from "./Layouts/LayoutDefault";
import Homepage from "./pages/home";
import DonateBlood from "./pages/home/DonateBlood";
import { FAQPage } from "./pages/home/FAQ";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<LayoutDeFault />}>
            {/* <Route path="/head" element={<Header />} /> */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/register" element={<RegisterPage />} />
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
