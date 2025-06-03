import "./App.css";
import { LoginPage } from "./components/auth/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ForgotPasswordPage } from "./components/auth/ForgotPassword";
import { RegisterPage } from "./components/auth/Register";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
