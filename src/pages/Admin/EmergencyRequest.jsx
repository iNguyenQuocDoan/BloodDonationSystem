import React from "react";

const emergencyRequests = [
  {
    id: "E001",
    patient: "Nguyễn Thị X",
    bloodType: "O",
    hospital: "BV A",
    unit: 2,
    date: "10/06/2025",
    status: "Chờ",
  },
  {
    id: "E002",
    patient: "Trần Văn Y",
    bloodType: "A",
    hospital: "BV B",
    unit: 3,
    date: "12/06/2025",
    status: "Đã Xác Minh",
  },
];

const ManageEmergencyRequest = () => {
  return (
    <div className="flex-1 bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-blue-600">
          Quản lý Yêu cầu Khẩn Cấp
        </h2>
        <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 text-sm">
          Tải lại
        </button>
      </div>

      <div className="bg-white shadow-md rounded overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Bệnh Nhân</th>
              <th className="px-4 py-2">Nhóm Máu</th>
              <th className="px-4 py-2">Đơn vị</th>
              <th className="px-4 py-2">Ngày</th>
              <th className="px-4 py-2">Trạng Thái</th>
              <th className="px-4 py-2">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {emergencyRequests.map((req) => (
              <tr key={req.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{req.id}</td>
                <td className="px-4 py-2">{req.patient}</td>
                <td className="px-4 py-2">{req.bloodType}</td>
                <td className="px-4 py-2">{req.hospital}</td>
                <td className="px-4 py-2">{req.unit}</td>
                <td className="px-4 py-2">{req.date}</td>
                <td className="px-4 py-2">{req.status}</td>
                <td className="px-4 py-2">
                  {req.status === "Chờ" ? (
                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600">
                      Xác Minh
                    </button>
                  ) : (
                    <button className="bg-blue-700 text-white px-3 py-1 rounded text-xs hover:bg-blue-800">
                      Hoàn Thiện
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageEmergencyRequest;
