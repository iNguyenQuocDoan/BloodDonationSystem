import { useState, useEffect } from 'react';
import useApi from '../../hooks/useApi';

const EditBloodPage = () => {
  const { getAllAppointments, getSlotList, loading, error } = useApi();
  const [data, setData] = useState([]);
  const [slotList, setSlotList] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [volumeInput, setVolumeInput] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllAppointments();
        // Sort by Appointment_ID ascending (AP001, AP002, ...)
        const sortedData = (res.data || []).slice().sort((a, b) => {
          const numA = parseInt((a.Appointment_ID || '').replace(/\D/g, ''));
          const numB = parseInt((b.Appointment_ID || '').replace(/\D/g, ''));
          return numA - numB;
        });
        setData(sortedData);
        const slotRes = await getSlotList();
        setSlotList(slotRes.data || []);
      } catch (err) {
        setData([]);
        setSlotList([]);
      }
    };
    fetchData();
  }, [getAllAppointments, getSlotList]);

  const statusMap = {
    'P': 'Chờ xác nhận',
    'A': 'Được hiến',
    'C': 'Đã hoàn thành',
    'R': 'Từ chối',
  };

  const handleComplete = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };
  const handleConfirm = () => {
    setData(prev => prev.map(item =>
      item.Appointment_ID === selectedId ? { ...item, Status: 'C', Volume: volumeInput[selectedId] || 1 } : item
    ));
    setShowConfirm(false);
    setSuccessMsg('Đã hoàn thành ca hiến máu!');
    setTimeout(() => setSuccessMsg(''), 2000);
    setSelectedId(null);
    // TODO: Gọi API cập nhật trạng thái và bắn sang báo cáo thống kê
  };
  const handleCancel = () => {
    setShowConfirm(false);
    setSelectedId(null);
  };

  // Helper format giờ dạng 7h00, trả về '-' nếu không hợp lệ
  const formatTimeVN = (timeString) => {
    if (!timeString || timeString === '00:00:00' || timeString === '-' || timeString === 'Invalid Date') return '-';
    const parts = timeString.split(':');
    if (parts.length < 2) return '-';
    const [h, m] = parts;
    if (!h || !m) return '-';
    return `${parseInt(h, 10)}h${m}`;
  };

  // Helper lấy khung giờ từ slotList
  const getSlotTime = (slotId, item) => {
    const slot = slotList.find(s => s.Slot_ID === slotId);
    if (slot) {
      const start = formatTimeVN(slot.Start_Time);
      const end = formatTimeVN(slot.End_Time);
      return `${start} - ${end}`;
    }
    // Fallback: lấy từ item nếu có
    if (item && item.Start_Time && item.End_Time) {
      const start = formatTimeVN(item.Start_Time);
      const end = formatTimeVN(item.End_Time);
      return `${start} - ${end}`;
    }
    return '-';
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-red-700 mb-6">Quản lý danh sách hiến máu</h1>
      {successMsg && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded shadow text-center font-semibold">
          {successMsg}
        </div>
      )}
      {loading ? (
        <div className="text-center text-gray-500 py-8">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">Lỗi tải dữ liệu: {error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-lg border border-gray-200">
            <thead className="bg-red-100">
              <tr>
                <th className="px-3 py-2 text-center text-[#D32F2F]">Appointment_ID</th>
                <th className="px-2 py-2 text-center text-[#D32F2F] max-w-xs w-32 truncate">Họ tên</th>
                <th className="px-3 py-2 text-center text-[#D32F2F]">SĐT</th>
                <th className="px-3 py-2 text-center text-[#D32F2F]">Nhóm máu</th>
                <th className="px-3 py-2 text-center text-[#D32F2F]">Ngày hiến</th>
                <th className="px-2 py-2 text-center text-[#D32F2F] w-32">Khung giờ</th>
                <th className="px-3 py-2 text-center text-[#D32F2F]">Đơn vị máu</th>
                <th className="px-3 py-2 text-center text-[#D32F2F]">Trạng thái</th>
                <th className="px-3 py-2 text-center text-[#D32F2F]">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.Appointment_ID} className="border-b hover:bg-gray-50 text-center">
                  <td className="px-3 py-2 font-mono">{item.Appointment_ID || '-'}</td>
                  <td className="px-2 py-2 text-center max-w-xs w-32 truncate">{item.User_Name || '-'}</td>
                  <td className="px-3 py-2">{item.Phone || '-'}</td>
                  <td className="px-3 py-2">{item.Verified_BloodType || '-'}</td>
                  <td className="px-3 py-2">{item.Slot_Date ? new Date(item.Slot_Date).toLocaleDateString('vi-VN') : '-'}</td>
                  <td className="px-2 py-2 text-center whitespace-nowrap text-sm font-mono">{getSlotTime(item.Slot_ID, item)}</td>
                  <td className="px-3 py-2">
                    {item.Status === 'A' ? (
                      <input
                        type="number"
                        min={1}
                        className="w-20 border rounded px-2 py-1 text-center"
                        value={volumeInput[item.Appointment_ID] || ''}
                        onChange={e => setVolumeInput(v => ({ ...v, [item.Appointment_ID]: e.target.value }))}
                        placeholder="Nhập số đơn vị máu"
                      />
                    ) : (item.Status === 'C' ? (item.Volume || 1) : '')}
                  </td>
                  <td className="px-3 py-2 font-semibold">
                    {item.Status === 'P' && (
                      <span className="inline-block px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-xs">Chờ xác nhận</span>
                    )}
                    {item.Status === 'A' && (
                      <span className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-800 font-semibold text-xs">Được hiến</span>
                    )}
                    {item.Status === 'C' && (
                      <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold text-xs">Đã hoàn thành</span>
                    )}
                    {item.Status === 'R' && (
                      <span className="inline-block px-2 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-xs">Từ chối</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {item.Status === 'A' && (
                      <button
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded font-medium text-xs border border-blue-300 shadow-sm hover:bg-blue-200 hover:text-blue-900 transition-all"
                        onClick={() => handleComplete(item.Appointment_ID)}
                        disabled={!volumeInput[item.Appointment_ID]}
                      >
                        Hoàn thành
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Popup xác nhận hoàn thành */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[350px]">
            <h2 className="text-lg font-bold text-center text-red-700 mb-4">Xác nhận hoàn thành</h2>
            <p className="text-center mb-6">Bạn có chắc chắn muốn hoàn thành ca hiến máu này không?</p>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={handleCancel}>Hủy</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={handleConfirm}>Đồng ý</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default EditBloodPage;