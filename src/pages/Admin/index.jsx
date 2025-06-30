import React from "react";

const AdminDashboard = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Dashboard Admin</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Tải lại
        </button>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded shadow p-4 text-center">
          <p className="text-blue-600 font-semibold">Tổng số Staff</p>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <p className="text-blue-600 font-semibold">Số Role</p>
          <p className="text-2xl font-bold">5</p>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <p className="text-blue-600 font-semibold">Yêu cầu khẩn cấp</p>
          <p className="text-2xl font-bold">8</p>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <p className="text-blue-600 font-semibold">Người dùng đăng ký</p>
          <p className="text-2xl font-bold">230</p>
        </div>
      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-4">
          <p className="text-blue-600 font-semibold mb-4">
            Lưu lượng hiến máu tháng
          </p>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <p className="text-blue-600 font-semibold mb-4">
            Yêu cầu khẩn cấp theo nhóm máu
          </p>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
