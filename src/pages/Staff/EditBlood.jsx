import React, { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import Swal from 'sweetalert2';

const EditBloodPage = () => {
    const { getAppointments, loading, error, addAppointmentVolume } = useApi();
    const [appointments, setAppointments] = useState([]);
    const [nameSearch, setNameSearch] = useState("");
    const [phoneSearch, setPhoneSearch] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [volumes, setVolumes] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAppointments();
                setAppointments(data.data);
                setFiltered(data.data);
                
                // Khởi tạo volumes từ dữ liệu có sẵn
                const initialVolumes = {};
                data.data.forEach(item => {
                    initialVolumes[item.Appointment_ID] = item.Volume || "";
                });
                setVolumes(initialVolumes);
            } catch (err) {
                setAppointments([]);
                setFiltered([]);
            }
        };
        fetchData();
    }, [getAppointments]);

    const handleSearch = () => {
        let result = appointments;
        if (nameSearch.trim()) {
            result = result.filter(item =>
                item.Name?.toLowerCase().includes(nameSearch.toLowerCase())
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
                    ? { ...item, Volume: volume }
                    : item
            ));
            
            setFiltered(prev => prev.map(item => 
                item.Appointment_ID === id 
                    ? { ...item, Volume: volume }
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

    return (
        <div className="container mx-auto py-8 px-4">
            <h2 className="text-2xl font-bold text-center text-red-600 mb-6">
                Ghi nhận lưu lượng máu người hiến
            </h2>
            
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
                            <th className="py-3 px-4 text-left">ID</th>
                            <th className="py-3 px-4 text-left">Họ Tên</th>
                            <th className="py-3 px-4 text-left">Nhóm Máu</th>
                            <th className="py-3 px-4 text-left">Số điện thoại</th>
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
                                        <td className="py-2 px-4 font-medium">{item.Appointment_ID}</td>
                                        <td className="py-2 px-4">{item.Name}</td>
                                        <td className="py-2 px-4">
                                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                                                {item.Blood_group || "Chưa có"}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4">{item.Phone}</td>
                                        <td className="py-2 px-4">
                                            {itemHasVolume ? (
                                                // Hiển thị volume đã lưu (chỉ đọc)
                                                <div className="flex items-center gap-2">
                                                    <span className="px-3 py-2 bg-green-100 text-green-800 rounded border font-medium">
                                                        {item.Volume} ml
                                                    </span>
                                                    <span className="text-green-600 text-sm">✅</span>
                                                </div>
                                            ) : (
                                                // Input để nhập volume mới
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
                                            )}
                                        </td>
                                        <td className="py-2 px-4">
                                            {itemHasVolume ? (
                                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                                    ✅ Đã ghi nhận
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                                    ⏳ Chưa ghi nhận
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-2 px-4">
                                            {itemHasVolume ? (
                                                // Hiển thị trạng thái đã hoàn thành
                                                <span className="px-4 py-1 bg-gray-100 text-gray-600 rounded font-medium text-sm">
                                                    🔒 Đã hoàn thành
                                                </span>
                                            ) : (
                                                // Hiển thị nút Lưu
                                                <button
                                                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 hover:shadow-md transition-all font-medium"
                                                    onClick={() => handleSave(item.Appointment_ID)}
                                                >
                                                    💾 Lưu
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center py-8 text-gray-500">
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
                    <strong>✅ Đã ghi nhận:</strong> {filtered.filter(item => hasVolume(item)).length}
                </div>
                <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
                    <strong>⏳ Chưa ghi nhận:</strong> {filtered.filter(item => !hasVolume(item)).length}
                </div>
            </div>
        </div>
    );
};

export default EditBloodPage;