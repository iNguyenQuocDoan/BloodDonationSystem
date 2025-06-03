import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "./components/layout/header";
import { LoginPage } from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import { RegisterPage } from "./pages/auth/Register";

import "./App.css";
import LayoutDeFault from "./Layouts/LayoutDefault";
import Homepage from "./pages/home";

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
            <Route path="/home" element={<Homepage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
