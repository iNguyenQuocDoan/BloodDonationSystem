import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "./components/layout/header";
import { LoginPage } from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import { RegisterPage } from "./pages/auth/Register";

import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/head" element={<Header />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
