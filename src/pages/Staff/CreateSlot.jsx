import { useState } from "react";

const CreateSlotPage = () => {
    const [formData, setFormData] = useState({
        slot_date: "",
        start_time: "",
        end_time: "",
        max_volume: 100
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [debugInfo, setDebugInfo] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Hiển thị dữ liệu gửi đi mà không gọi API
    const handleDebug = (e) => {
        e.preventDefault();
        
        // Hiển thị dữ liệu sẽ được gửi đi
        setDebugInfo({
            url: "http://localhost:3000/api/slots",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                ...formData,
                // Sử dụng giá trị cố định cho staff_id vì không có phân quyền
                staff_id: "U002"
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.slot_date || !formData.start_time || !formData.end_time) {
            setMessage({ text: "Vui lòng điền đầy đủ thông tin", type: "error" });
            return;
        }

        try {
            setLoading(true);
            setMessage({ text: "", type: "" });
            setDebugInfo(null);

            // Chuẩn bị dữ liệu gửi đi
            // Thêm staff_id cố định vì chưa có phân quyền
            const requestData = {
                ...formData,
                staff_id: "U002"
            };
            
            console.log("Sending data to API:", requestData);

            const response = await fetch("http://localhost:3000/api/createSlot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();
            console.log("API response:", data);

            if (response.ok) {
                setMessage({ text: "Tạo ca hiến máu thành công!", type: "success" });
                setFormData({
                    slot_date: "",
                    start_time: "",
                    end_time: "",
                    max_volume: 100
                });
            } else {
                setMessage({ 
                    text: data.message || "Có lỗi xảy ra khi tạo ca hiến máu", 
                    type: "error" 
                });
            }
        } catch (error) {
            console.error("API Error:", error);
            setMessage({ text: "Lỗi kết nối đến server", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="bg-[#f5f5f5] py-8 px-2 flex justify-center">
                <div className="container max-w-xl mx-auto">
                    <h1 className="text-2xl md:text-3xl text-[#D32F2F] text-center mb-6">Tạo ca hiến máu mới</h1>
                    <div className="w-full">
                        <div className="bg-white rounded-lg shadow-sm border text-sm">
                            {message.text && (
                                <div className={`p-4 ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} rounded-t-lg`}>
                                    {message.text}
                                </div>
                            )}
                            <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block mb-1 font-medium text-gray-700">Ngày</label>
                                    <input 
                                        type="date" 
                                        name="slot_date" 
                                        value={formData.slot_date}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded" 
                                        required
                                        
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 font-medium text-gray-700">Giờ bắt đầu</label>
                                    <input 
                                        type="time" 
                                        name="start_time" 
                                        value={formData.start_time}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded" 
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 font-medium text-gray-700">Giờ kết thúc</label>
                                    <input 
                                        type="time" 
                                        name="end_time" 
                                        value={formData.end_time}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded" 
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 font-medium text-gray-700">Sức chứa</label>
                                    <input 
                                        type="number" 
                                        min={1} 
                                        max={200}
                                        name="max_volume" 
                                        value={formData.max_volume}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded"
                                        required
                                    />
                                </div>
                                
                                <div className="flex gap-2">
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className={`${loading ? "bg-gray-400" : "bg-[#D32F2F]"} p-[0.4rem] rounded-md text-white px-[1.2rem] transition`}
                                    >
                                        {loading ? "Đang tạo..." : "Tạo ca hiến máu"}
                                    </button>
                                    
                                    <button 
                                        type="button"
                                        onClick={handleDebug}
                                        className="bg-blue-500 p-[0.4rem] rounded-md text-white px-[1.2rem] transition"
                                    >
                                        Xem dữ liệu gửi đi
                                    </button>
                                </div>
                            </form>
                            
                            {/* Debug information */}
                            {debugInfo && (
                                <div className="p-4 border-t border-gray-200 bg-gray-50">
                                    <h3 className="font-medium text-gray-900 mb-2">Thông tin gửi đến API:</h3>
                                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                                        {JSON.stringify(debugInfo, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateSlotPage;