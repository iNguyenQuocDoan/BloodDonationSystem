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
import EmergencyRequest from "./pages/home/EmergencyRequest";  // đã thêm trang EmergencyRequest 6/6/2025 By Vượng
import DonateBlood from "./pages/home/DonateBlood";
import { FAQPage } from "./pages/home/FAQ";
import LayoutStaff from "./Layouts/LayoutStaff";
import CreateSlotPage from "./pages/Staff/CreateSlot";
import ConfirmBloodPage from "./pages/Staff/ConfirmBlood";
import DashboardPage from "./pages/Staff/Dashboard";
import ManageEmergencyPage from "./pages/Staff/ManageEmergency";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/*           
          <Route element={<LayoutDeFault />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/contact" element={<Contact />} />         đã sửa thêm trang contact nha
            <Route path="aboutus" element={<AboutUs />} />          đã sửa thêm trang about us 6/6/2025 đã đông bộ với footer
            <Route path="/emergency" element={<EmergencyRequest />} />
            <Route path="/contact" element={<Contact />} />{" "}
            
            <Route path="/" element={<Homepage />} />


            <Route path="/contact" element={<Contact />} />
            <Route path="faq" element={<FAQPage />} />
          </Route> */}

          {/*Cái này chỉ là ví dụ để xem UI header của Staff nếu phân quyền xong thì mở comment trên và gộp lại 
          sẵn gộp luôn headerStaff với header thành 1 và Layout cũng dị và Footer nữa*/}
          <Route element={<LayoutStaff />}>
            <Route path="create-slot" element={<CreateSlotPage />} />
            <Route path="/" element={<DashboardPage />} />
            <Route path="confirm-blood" element={<ConfirmBloodPage />} />
            <Route path="edit-blood" />
            <Route path="manage-emergency" element={<ManageEmergencyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
