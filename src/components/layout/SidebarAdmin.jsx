import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserShield,
  FaKey,
  FaChartBar,
  FaTools,
  FaSignOutAlt,
  FaBell,
} from "react-icons/fa";
import useApi from "../../hooks/useApi";

// nav item classes for admin: maintain border, font and prevent shift
const adminNavItemClass = ({ isActive }) =>
  [
    "flex items-center gap-2 px-3 py-2 transition-colors duration-200 font-medium rounded-r-md border-l-4 border-l-transparent",
    isActive
      ? "border-l-red-500 bg-[#FDE8E8] text-[#D32F2F]"
      : "text-white hover:text-[#D32F2F] hover:bg-gray-100/40",
  ].join(" ");

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { logout } = useApi();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.log("Logout error:", e);
    }
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="w-64 min-h-screen bg-[#D32F2F] text-white flex flex-col px-4 py-6">
      <h2 className="text-lg font-bold mb-6">DaiVietBlood Admin</h2>
      <nav className="flex-1 space-y-3 text-sm">
        <NavLink to="/admin" end className={adminNavItemClass}>
          <FaTachometerAlt /> Dashboard
        </NavLink>
        <NavLink to="/admin/manage-staff" className={adminNavItemClass}>
          <FaUserShield /> Quản lý Staff
        </NavLink>
        <NavLink to="/admin/manage-role" className={adminNavItemClass}>
          <FaKey /> Quản lý Role
        </NavLink>
        <NavLink to="/admin/create-slot" className={adminNavItemClass}>
          <FaChartBar /> Tạo ca
        </NavLink>
        <NavLink to="/admin/emergency-request" className={adminNavItemClass}>
          <FaBell /> Yêu cầu khẩn cấp
        </NavLink>
        <NavLink to="/admin/blood-inventory" className={adminNavItemClass}>
          <FaTools /> Quản lý kho máu
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-r-md text-white hover:text-[#D32F2F] hover:bg-gray-100/40 font-medium"
        >
          <FaSignOutAlt /> Đăng xuất
        </button>
      </nav>
    </div>
  );
};

export default AdminNavbar;
