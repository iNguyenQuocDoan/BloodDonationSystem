import React from "react";

const roles = [
  {
    name: "Admin",
    description: "Quyền cao nhất",
  },
  {
    name: "Staff",
    description: "Quản lý hoạt động",
  },
];

const RoleManagement = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-blue-600">Quản lý Role</h2>
        <button className="bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600">
          Tải lại
        </button>
      </div>

      <div className="bg-white shadow-md rounded overflow-x-auto mb-4">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Mô tả</th>
              <th className="px-4 py-2 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.name} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{role.name}</td>
                <td className="px-4 py-2">{role.description}</td>
                <td className="px-4 py-2 text-center">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600">
                    Chỉnh sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700">
        Thêm Role Mới
      </button>
    </div>
  );
};

export default RoleManagement;
