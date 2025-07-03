import React, { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";

const EditBloodPage = () => {
    const { getAppointments, loading, error, addAppointmentVolume } = useApi();
    const [appointments, setAppointments] = useState([]);
    const [nameSearch, setNameSearch] = useState("");
    const [emailSearch, setEmailSearch] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [volumes, setVolumes] = useState({}); // Lưu giá trị input cho từng appointment

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAppointments();
                setAppointments(data.data);
                setFiltered(data.data);
                // Khởi tạo volumes từ dữ liệu có sẵn (nếu có)
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
        if (emailSearch.trim()) {
            result = result.filter(item =>
                item.Email?.toLowerCase().includes(emailSearch.toLowerCase())
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
            alert("Vui lòng nhập lưu lượng hợp lệ!");
            return;
        }
        try {
            // Ép kiểu volume thành string để đúng với yêu cầu BE
            await addAppointmentVolume(id, String(volume));
            alert("Lưu thành công!");
        } catch (err) {
            alert("Lưu thất bại!");
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <h2 className="text-2xl font-bold text-center text-red-600 mb-6">
                Ghi nhận nhóm máu người hiến
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
                <label className="py-2 text-lg">Email:</label>
                <input
                    type="text"
                    placeholder="Nhập Email..."
                    className="border px-3 py-2 rounded w-60"
                    value={emailSearch}
                    onChange={(e) => setEmailSearch(e.target.value)}
                />
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={handleSearch}
                >
                    Tìm kiếm
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow">
                    <thead>
                        <tr className="bg-red-100 text-red-600">
                            <th className="py-3 px-4 text-left">Phiếu ID</th>
                            <th className="py-3 px-4 text-left">Họ Tên</th>
                            <th className="py-3 px-4 text-left">Nhóm Máu</th>
                            <th className="py-3 px-4 text-left">Email</th>
                            <th className="py-3 px-4 text-left">Lưu lượng</th>
                            <th className="py-3 px-4 text-left">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? (
                            filtered.map((item) => (
                                <tr key={item.Appointment_ID} className="border-b">
                                    <td className="py-2 px-4">{item.Appointment_ID}</td>
                                    <td className="py-2 px-4">{item.Name}</td>
                                    <td className="py-2 px-4">{item.Blood_group || "Chưa có"}</td>
                                    <td className="py-2 px-4">{item.Email}</td>
                                    <td className="py-2 px-4">
                                        <input
                                            type="number"
                                            className="border rounded px-2 py-1 w-24"
                                            min={1}
                                            value={volumes[item.Appointment_ID] || ""}
                                            onChange={e => handleVolumeChange(item.Appointment_ID, e.target.value)}
                                        />
                                    </td>
                                    <td className="py-2 px-4">
                                        <button
                                            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                                            onClick={() => handleSave(item.Appointment_ID)}
                                        >
                                            Lưu
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-gray-500">
                                    {loading
                                        ? "Đang tải dữ liệu..."
                                        : error
                                            ? "Không thể tải danh sách"
                                            : "Không có dữ liệu"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EditBloodPage;