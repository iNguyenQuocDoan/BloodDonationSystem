import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { LoginPage } from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import { RegisterPage } from "./pages/auth/Register";

import LayoutDeFault from "./Layouts/LayoutDefault";
import Homepage from "./pages/home";
import DonateBlood from "./pages/home/DonateBlood";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<LayoutDeFault />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/donateBlood" element={<DonateBlood />} />
            <Route path="/" element={<Homepage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
