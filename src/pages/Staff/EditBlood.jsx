import React, { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import Swal from 'sweetalert2';

const EditBloodPage = () => {
    const { getAllAppointments, getSlotList, loading, error, addAppointmentVolume } = useApi();
    const [appointments, setAppointments] = useState([]);
    const [slotList, setSlotList] = useState([]);
    const [nameSearch, setNameSearch] = useState("");
    const [phoneSearch, setPhoneSearch] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [volumes, setVolumes] = useState({});
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Sử dụng getAllAppointments từ code sau
                const data = await getAllAppointments();
                // Sort by Appointment_ID ascending (AP001, AP002, ...)
                const sortedData = (data.data || []).slice().sort((a, b) => {
                    const numA = parseInt((a.Appointment_ID || '').replace(/\D/g, ''));
                    const numB = parseInt((b.Appointment_ID || '').replace(/\D/g, ''));
                    return numA - numB;
                });
                setAppointments(sortedData);
                setFiltered(sortedData);
                
                // Khởi tạo volumes từ dữ liệu có sẵn
                const initialVolumes = {};
                sortedData.forEach(item => {
                    initialVolumes[item.Appointment_ID] = item.Volume || "";
                });
                setVolumes(initialVolumes);

                // Lấy danh sách slots
                const slotRes = await getSlotList();
                setSlotList(slotRes.data || []);
            } catch (err) {
                setAppointments([]);
                setFiltered([]);
                setSlotList([]);
            }
        };
        fetchData();
    }, [getAllAppointments, getSlotList]);

    const handleSearch = () => {
        let result = appointments;
        if (nameSearch.trim()) {
            result = result.filter(item =>
                (item.User_Name || item.Name)?.toLowerCase().includes(nameSearch.toLowerCase())
            );
        }
        if (phoneSearch.trim()) {
            result = result.filter(item =>
                item.Phone?.toLowerCase().includes(phoneSearch.toLowerCase())
            );
        }
        setFiltered(result);
    };

    const handleVolumeChange = (id, value) => {
        setVolumes(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSave = async (id) => {
        const volume = volumes[id];
        
        if (!volume || isNaN(volume) || Number(volume) <= 0) {
            await Swal.fire({
                title: 'Lỗi!',
                text: 'Vui lòng nhập lưu lượng hợp lệ (số > 0)!',
                icon: 'error',
                confirmButtonColor: '#dc2626',
                confirmButtonText: 'Đã hiểu'
            });
            return;
        }

        // Popup xác nhận
        const result = await Swal.fire({
            title: '⚠️ Xác nhận lưu thông tin',
            html: `
                <div style="text-align: left; padding: 20px;">
                    <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #f59e0b;">
                        <h4 style="color: #92400e; margin: 0 0 10px 0;">📋 Thông tin sẽ được lưu:</h4>
                        <p style="margin: 5px 0;"><strong>Appointment ID:</strong> ${id}</p>
                        <p style="margin: 5px 0;"><strong>Lưu lượng máu:</strong> ${volume} ml</p>
                    </div>
                    
                    <div style="background: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #dc2626;">
                        <h4 style="color: #dc2626; margin: 0 0 10px 0;">⚠️ Lưu ý quan trọng:</h4>
                        <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                            <li><strong>Sau khi lưu, bạn KHÔNG thể thay đổi thông tin này</strong></li>
                            <li>Vui lòng kiểm tra kỹ lưu lượng máu trước khi xác nhận</li>
                            <li>Thông tin sẽ được ghi nhận vào hệ thống vĩnh viễn</li>
                        </ul>
                    </div>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: '✅ Xác nhận lưu',
            cancelButtonText: '❌ Hủy bỏ',
            width: '500px',
            padding: '0'
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            await addAppointmentVolume(id, String(volume));
            
            // Cập nhật lại appointment trong state để hiển thị volume đã lưu
            setAppointments(prev => prev.map(item => 
                item.Appointment_ID === id 
                    ? { ...item, Volume: volume, Status: 'C' } // Đánh dấu hoàn thành
                    : item
            ));
            
            setFiltered(prev => prev.map(item => 
                item.Appointment_ID === id 
                    ? { ...item, Volume: volume, Status: 'C' }
                    : item
            ));

            await Swal.fire({
                title: '✅ Lưu thành công!',
                html: `
                    <div style="text-align: center; padding: 20px;">
                        <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin-bottom: 15px;">
                            <h4 style="color: #16a34a; margin: 0 0 10px 0;">📊 Thông tin đã được ghi nhận</h4>
                            <p style="margin: 5px 0; font-size: 15px;"><strong>Appointment ID:</strong> ${id}</p>
                            <p style="margin: 5px 0; font-size: 15px;"><strong>Lưu lượng:</strong> ${volume} ml</p>
                        </div>
                        
                        <div style="background: #eff6ff; padding: 15px; border-radius: 8px;">
                            <p style="margin: 0; font-size: 14px; color: #1d4ed8;">
                                <strong>💡 Lưu ý:</strong> Thông tin này đã được khóa và không thể chỉnh sửa.
                            </p>
                        </div>
                    </div>
                `,
                icon: 'success',
                confirmButtonColor: '#16a34a',
                confirmButtonText: 'Đã hiểu',
                width: '450px',
                padding: '0'
            });

            setSuccessMsg('Đã hoàn thành ca hiến máu!');
            setTimeout(() => setSuccessMsg(''), 2000);

        } catch (err) {
            console.error('Error saving volume:', err);
            await Swal.fire({
                title: '❌ Lưu thất bại!',
                text: 'Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại!',
                icon: 'error',
                confirmButtonColor: '#dc2626',
                confirmButtonText: 'Thử lại'
            });
        }
    };

    // Kiểm tra xem appointment đã có volume chưa
    const hasVolume = (item) => {
        return item.Volume && item.Volume > 0;
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

    const statusMap = {
        'P': 'Chờ xác nhận',
        'A': 'Được hiến',
        'C': 'Đã hoàn thành',
        'R': 'Từ chối',
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <h2 className="text-2xl font-bold text-center text-red-600 mb-6">
                Ghi nhận lưu lượng máu người hiến
            </h2>

            {successMsg && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded shadow text-center font-semibold">
                    {successMsg}
                </div>
            )}
            
            <div className="mb-4 flex justify-center gap-2">
                <label className="py-2 text-lg">Tên:</label>
                <input
                    type="text"
                    placeholder="Nhập Tên..."
                    className="border px-3 py-2 rounded w-60"
                    value={nameSearch}
                    onChange={(e) => setNameSearch(e.target.value)}
                />
                <label className="py-2 text-lg">Số điện thoại:</label>
                <input
                    type="text"
                    placeholder="Nhập số điện thoại..."
                    className="border px-3 py-2 rounded w-60"
                    value={phoneSearch}
                    onChange={(e) => setPhoneSearch(e.target.value)}
                />
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={handleSearch}
                >
                    🔍 Tìm kiếm
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow">
                    <thead>
                        <tr className="bg-red-100 text-red-600">
                            <th className="py-3 px-4 text-left">Appointment ID</th>
                            <th className="py-3 px-4 text-left">Họ Tên</th>
                            <th className="py-3 px-4 text-left">SĐT</th>
                            <th className="py-3 px-4 text-left">Nhóm Máu</th>
                            <th className="py-3 px-4 text-left">Ngày hiến</th>
                            <th className="py-3 px-4 text-left">Khung giờ</th>
                            <th className="py-3 px-4 text-left">Lưu lượng (ml)</th>
                            <th className="py-3 px-4 text-left">Trạng thái</th>
                            <th className="py-3 px-4 text-left">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? (
                            filtered.map((item) => {
                                const itemHasVolume = hasVolume(item);
                                return (
                                    <tr key={item.Appointment_ID} className="border-b hover:bg-gray-50">
                                        <td className="py-2 px-4 font-medium font-mono">{item.Appointment_ID}</td>
                                        <td className="py-2 px-4">{item.User_Name || item.Name}</td>
                                        <td className="py-2 px-4">{item.Phone}</td>
                                        <td className="py-2 px-4">
                                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                                                {item.Verified_BloodType || item.Blood_group || "Chưa có"}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4">
                                            {item.Slot_Date ? new Date(item.Slot_Date).toLocaleDateString('vi-VN') : '-'}
                                        </td>
                                        <td className="py-2 px-4 text-center whitespace-nowrap text-sm font-mono">
                                            {getSlotTime(item.Slot_ID, item)}
                                        </td>
                                        <td className="py-2 px-4">
                                            {itemHasVolume || item.Status === 'C' ? (
                                                // Hiển thị volume đã lưu (chỉ đọc)
                                                <div className="flex items-center gap-2">
                                                    <span className="px-3 py-2 bg-green-100 text-green-800 rounded border font-medium">
                                                        {item.Volume} ml
                                                    </span>
                                                    <span className="text-green-600 text-sm">✅</span>
                                                </div>
                                            ) : item.Status === 'A' ? (
                                                // Input để nhập volume mới (chỉ cho status 'A')
                                                <input
                                                    type="number"
                                                    className="border rounded px-2 py-1 w-24 border-gray-300 focus:border-red-500 focus:outline-none"
                                                    min={1}
                                                    max={500}
                                                    step={1}
                                                    value={volumes[item.Appointment_ID] || ""}
                                                    onChange={e => handleVolumeChange(item.Appointment_ID, e.target.value)}
                                                    placeholder="ml"
                                                />
                                            ) : (
                                                // Các status khác không hiển thị gì
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="py-2 px-4">
                                            {item.Status === 'P' && (
                                                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                                    ⏳ Chờ xác nhận
                                                </span>
                                            )}
                                            {item.Status === 'A' && !itemHasVolume && (
                                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                                    ✅ Được hiến
                                                </span>
                                            )}
                                            {(item.Status === 'C' || itemHasVolume) && (
                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                    ✅ Đã hoàn thành
                                                </span>
                                            )}
                                            {item.Status === 'R' && (
                                                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                                                    ❌ Từ chối
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-2 px-4">
                                            {item.Status === 'A' && !itemHasVolume ? (
                                                // Hiển thị nút Lưu cho status 'A' chưa có volume
                                                <button
                                                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 hover:shadow-md transition-all font-medium"
                                                    onClick={() => handleSave(item.Appointment_ID)}
                                                    disabled={!volumes[item.Appointment_ID]}
                                                >
                                                    💾 Lưu
                                                </button>
                                            ) : (itemHasVolume || item.Status === 'C') ? (
                                                // Hiển thị trạng thái đã hoàn thành
                                                <span className="px-4 py-1 bg-gray-100 text-gray-600 rounded font-medium text-sm">
                                                    🔒 Đã hoàn thành
                                                </span>
                                            ) : (
                                                // Các trạng thái khác
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={9} className="text-center py-8 text-gray-500">
                                    <div className="flex flex-col items-center">
                                        <div className="text-4xl mb-2">📋</div>
                                        {loading
                                            ? "Đang tải dữ liệu..."
                                            : error
                                                ? "Không thể tải danh sách appointments"
                                                : "Không có appointment nào"}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Thống kê */}
            <div className="mt-6 flex justify-center gap-4">
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
                    <strong>📊 Tổng số ca đăng ký hiến máu:</strong> {filtered.length}
                </div>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                    <strong>✅ Đã ghi nhận:</strong> {filtered.filter(item => hasVolume(item) || item.Status === 'C').length}
                </div>
                <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
                    <strong>⏳ Chưa ghi nhận:</strong> {filtered.filter(item => item.Status === 'A' && !hasVolume(item)).length}
                </div>
            </div>
        </div>
    );
};

export default EditBloodPage;