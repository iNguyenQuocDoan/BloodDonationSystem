import React, { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";

const statusColor = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  Canceled: "bg-red-100 text-red-700",
  "Đang điều trị": "bg-blue-100 text-blue-700"
};

const statusLabel = {
  Pending: "Đang chờ",
  Processing: "Đang xử lý",
  Completed: "Hoàn thành",
  Canceled: "Đã hủy",
  "Đang điều trị": "Đang điều trị"
};

function formatHour(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  return `${parseInt(h, 10)}h${m}`;
}

export default function PatientHistory() {
  const { getAllPatientHistoryByMember } = useApi();
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAllPatientHistoryByMember()
    
      .then(res => setHistories(res.data || []))
      
      .finally(() => setLoading(false));
  }, [getAllPatientHistoryByMember]);
  console.log(histories)
  return (
    <div className="w-full max-w-5xl mx-auto mt-8 bg-white rounded-xl shadow-lg p-4 md:p-8">
      <h2 className="text-2xl font-bold text-red-700 mb-6 text-center">Hồ sơ bệnh án của bạn</h2>
      {loading ? (
        <div className="text-center text-gray-500">Đang tải...</div>
      ) : histories.length === 0 ? (
        <div className="text-center text-gray-500 py-8">Bạn chưa có hồ sơ bệnh án nào.</div>
      ) : (
        <div>
          <table className="w-full table-fixed bg-white rounded-xl shadow-lg border border-gray-200 text-base">
            <thead className="bg-red-100">
              <tr>
                <th className="px-4 py-3 w-24 text-center font-semibold text-red-700 whitespace-nowrap">Mã hồ sơ</th>
                <th className="px-4 py-3 w-32 text-center font-semibold text-red-700 whitespace-nowrap">Mã cuộc hẹn</th>
                <th className="px-4 py-3 w-32 text-center font-semibold text-red-700 whitespace-nowrap">Ngày tạo</th>
                <th className="px-4 py-3 w-32 text-center font-semibold text-red-700 whitespace-nowrap">Khung giờ</th>
                <th className="px-4 py-3 w-64 text-center font-semibold text-red-700">Mô tả</th>
                <th className="px-4 py-3 w-32 text-center font-semibold text-red-700 whitespace-nowrap">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {histories.map((item, idx) => (
                <tr key={item.Patient_ID || idx} className="border-b hover:bg-gray-50 text-center transition">
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{item.Patient_ID || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{item.Appointment_ID || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{item.MedicalHistory ? new Date(item.MedicalHistory).toLocaleDateString("vi-VN") : '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {item.Start_Time && item.End_Time
                      ? `${formatHour(item.Start_Time)} - ${formatHour(item.End_Time)}`
                      : (item.Start_Time ? formatHour(item.Start_Time) : '-')}
                  </td>
                  <td className="px-4 py-3 break-words max-w-md whitespace-pre-line text-left">{item.Description || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full font-semibold ${statusColor[item.Status] || "bg-gray-100 text-gray-700"}`}>
                      {statusLabel[item.Status] || item.Status || '-'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 