import { Link, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserShield,
  FaKey,
  FaChartBar,
  FaTools,
  FaSignOutAlt,
  FaBell,
} from "react-icons/fa";
import React from "react";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (e) {}
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
    window.location.reload();
  };
  return (
    <div className="w-64 min-h-screen bg-blue-600 text-white flex flex-col px-4 py-6">
      <h2 className="text-lg font-bold mb-6">BloodShare Admin</h2>
      <nav className="flex-1 space-y-3 text-sm">
        <Link
          to="/admin"
          className="flex items-center gap-2 hover:bg-blue-500 px-3 py-2 rounded"
        >
          <FaTachometerAlt className="text-white" />
          Dashboard
        </Link>
        <Link
          to="#"
          className="flex items-center gap-2 hover:bg-blue-500 px-3 py-2 rounded"
        >
          <FaUserShield />
          Quản lý Staff
        </Link>
        <Link
          to="/admin/manage-role"
          className="flex items-center gap-2 hover:bg-blue-500 px-3 py-2 rounded"
        >
          <FaKey />
          Quản lý Role
        </Link>
        <Link
          to="/admin/create-slot"
          className="flex items-center gap-2 hover:bg-blue-500 px-3 py-2 rounded"
        >
          <FaChartBar />
          Tạo ca
        </Link>
        <Link
          to="/admin/emergency-request"
          className="flex items-center gap-2 text-red-300 hover:bg-blue-500 px-3 py-2 rounded"
        >
          <FaBell />
          Yêu cầu khẩn cấp
        </Link>
        <Link
          to="#"
          className="flex items-center gap-2 hover:bg-blue-500 px-3 py-2 rounded"
        >
          <FaTools />
          Cài đặt
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 hover:bg-blue-500 px-3 py-2 rounded w-full text-left"
        >
          <FaSignOutAlt />
          Đăng xuất
        </button>
      </nav>
    </div>
  );
};

export default AdminNavbar;
