import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import LayoutStaff from "./Layouts/LayoutStaff";
import CreateSlotPage from "./pages/Staff/CreateSlot";
import DashboardPage from "./pages/Staff/Dashboard";
import EditBloodPage from "./pages/Staff/EditBlood";
import ManageEmergencyPage from "./pages/Staff/ManageEmergency";
import ConfirmBloodPage from "./pages/Staff/ConfirmBlood";
import AdminLayout from "./Layouts/LayoutAdmin";
import CreateSlot from "./pages/Admin/CreateSlot";
import ManageEmergencyRequest from "./pages/Admin/EmergencyRequest";
import RoleManagement from "./pages/Admin/Rolemange";
import RequireRole from "./components/auth/RequireRole";
import AdminDashboard from "./pages/Admin/Dashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Các route public cho member */}
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
            <Route path="donate" element={<DonateBlood />} />
          </Route>

          {/* Route cho staff */}
          <Route element={<RequireRole allowedRoles={["AR002"]} />}>
            <Route element={<LayoutStaff />}>
              <Route path="create-slot" element={<CreateSlotPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="confirm-blood" element={<ConfirmBloodPage />} />
              <Route path="edit-blood" element={<EditBloodPage />} />
              <Route path="manage-emergency" element={<ManageEmergencyPage />} />
            </Route>
          </Route>

          {/* Route cho admin */}
          <Route element={<RequireRole allowedRoles={["AR001"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="create-slot" element={<CreateSlot />} />
              <Route path="emergency-request" element={<ManageEmergencyRequest />} />
              <Route path="manage-role" element={<RoleManagement />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;
