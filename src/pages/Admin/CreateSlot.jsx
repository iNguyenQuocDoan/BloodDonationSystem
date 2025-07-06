import { useState } from "react";
import useApi from "../../hooks/useApi";

const CreateSlot = () => {
  const [formData, setFormData] = useState({
    Slot_Date: "",
    Start_Time: "",
    End_Time: "",
    Max_Volume: ""
  });
  
  // Sử dụng hook useApi
  const { loading, createSlot } = useApi();
  const [message, setMessage] = useState({ text: "", type: "" });
  const [timeError, setTimeError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // When Start_Time changes, validate End_Time
    if (name === "Start_Time") {
      setFormData(prev => {
        const updatedData = { ...prev, [name]: value };
        
        // If End_Time is earlier than or equal to the new Start_Time, reset End_Time
        if (prev.End_Time && prev.End_Time <= value) {
          setTimeError("Giờ kết thúc phải sau giờ bắt đầu");
          return { ...updatedData, End_Time: "" };
        } else {
          setTimeError("");
          return updatedData;
        }
      });
    } 
    // When End_Time changes, validate against Start_Time
    else if (name === "End_Time") {
      if (formData.Start_Time && value <= formData.Start_Time) {
        setTimeError("Giờ kết thúc phải sau giờ bắt đầu");
      } else {
        setTimeError("");
      }
      setFormData({ ...formData, [name]: value });
    }
    // For all other fields, just update normally
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateTimes = () => {
    if (formData.Start_Time && formData.End_Time) {
      if (formData.End_Time <= formData.Start_Time) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate times before submission
    if (!validateTimes()) {
      setMessage({
        text: "Giờ kết thúc phải sau giờ bắt đầu",
        type: "error"
      });
      return;
    }
    
    setMessage({ text: "", type: "" });

    try {
      // Chuẩn hóa giờ về HH:mm:ss nếu chỉ có HH:mm
      const pad = (n) => n.toString().padStart(2, '0');
      const normalizeTime = (t) => {
        if (!t) return '';
        const parts = t.split(':');
        if (parts.length === 2) return `${pad(parts[0])}:${pad(parts[1])}:00`;
        if (parts.length === 3) return `${pad(parts[0])}:${pad(parts[1])}:${pad(parts[2])}`;
        return t;
      };
      const slotData = {
        ...formData,
        Start_Time: normalizeTime(formData.Start_Time),
        End_Time: normalizeTime(formData.End_Time),
        Max_Volume: parseInt(formData.Max_Volume)
      };

      // Sử dụng createSlot từ hook useApi
      const response = await createSlot(slotData);
      
      console.log("Server response:", response);
      setMessage({ 
        text: "Tạo ca hiến máu thành công!", 
        type: "success" 
      });
      
      // Clear form after successful submission
      setFormData({
        Slot_Date: "",
        Start_Time: "",
        End_Time: "",
        Max_Volume: ""
      });
      
    } catch (error) {
      console.error("Error creating slot:", error);
      setMessage({ 
        text: error.message || "Đã xảy ra lỗi khi tạo ca hiến máu", 
        type: "error" 
      });
    }
  };

  const handleTimeRangeChange = (e) => {
    const timeRange = e.target.value;
    
    if (!timeRange) {
      setFormData({
        ...formData,
        Start_Time: "",
        End_Time: ""
      });
      return;
    }
    
    const [startTime, endTime] = timeRange.split('-');
    
    setFormData({
      ...formData,
      Start_Time: startTime,
      End_Time: endTime
    });
    
    // Clear any previous time errors
    setTimeError("");
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-center text-lg font-semibold text-blue-600 mb-6">
        Tạo Ca Hiến Máu
      </h2>
      
      {message.text && (
        <div className={`mb-4 p-3 rounded text-center ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Ngày</label>
          <input
            type="date"
            name="Slot_Date"
            value={formData.Slot_Date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
            min={new Date().toLocaleDateString('en-CA')}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Khung Giờ</label>
          <select
            name="timeRange"
            value={`${formData.Start_Time}-${formData.End_Time}`}
            onChange={handleTimeRangeChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Chọn khung giờ hiến máu</option>
            <option value="07:00-11:00">07:00 - 11:00</option>
            <option value="13:00-17:00">13:00 - 17:00</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Giờ Bắt Đầu</label>
          <input
            type="time"
            name="Start_Time"
            value={formData.Start_Time}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Giờ Kết Thúc</label>
          <input
            type="time"
            name="End_Time"
            value={formData.End_Time}
            onChange={handleChange}
            className={`w-full border ${timeError ? "border-red-500" : "border-gray-300"} rounded px-3 py-2`}
            required
            disabled={!formData.Start_Time} // Disable if no start time is selected
          />
          {timeError && (
            <p className="text-red-500 text-xs mt-1">{timeError}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Sức Chứa Tối Đa (Người)
          </label>
          <input
            type="number"
            name="Max_Volume"
            value={formData.Max_Volume}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="200"
            required
            min="1"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !!timeError}
          className={`w-full ${loading || timeError ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} text-white py-2 rounded transition`}
        >
          {loading ? "Đang xử lý..." : "Tạo Ca Hiến Máu"}
        </button>
      </form>
    </div>
  );
};

export default CreateSlot;
