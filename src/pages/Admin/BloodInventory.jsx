import React from "react";

const bloodData = [
  { group: "O", units: 200, threshold: 50 },
  { group: "A", units: 150, threshold: 40 },
  { group: "B", units: 130, threshold: 30 },
  { group: "AB", units: 80, threshold: 20 },
];

const BloodInventory = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-600">Quản lý Kho Máu</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Tải lại
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-blue-100 text-blue-600">
            <tr>
              <th className="px-6 py-3">Nhóm Máu</th>
              <th className="px-6 py-3">Số Đơn Vị Hiện Có</th>
              <th className="px-6 py-3">Ngưỡng Tái Cấp</th>
              <th className="px-6 py-3">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {bloodData.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="px-6 py-4">{item.group}</td>
                <td className="px-6 py-4">{item.units}</td>
                <td className="px-6 py-4">{item.threshold}</td>
                <td className="px-6 py-4">
                  <button className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700">
                    Điều chỉnh
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BloodInventory;
