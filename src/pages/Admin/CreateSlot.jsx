import { useState } from "react";
import useApi from "../../hooks/useApi";

const CreateSlot = () => {
  const [formData, setFormData] = useState({
    Start_Date: "",
    End_Date: "",
    Start_Time: "",
    End_Time: "",
    Max_Volume: ""
  });
  
  // Sử dụng hook useApi
  const { loading, createSlot } = useApi();
  const [message, setMessage] = useState({ text: "", type: "" });
  const [dateError, setDateError] = useState("");
  const [creatingSlots, setCreatingSlots] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate dates
    if (name === "Start_Date" || name === "End_Date") {
      const startDate = name === "Start_Date" ? value : formData.Start_Date;
      const endDate = name === "End_Date" ? value : formData.End_Date;
      
      if (startDate && endDate && endDate < startDate) {
        setDateError("Ngày kết thúc phải sau ngày bắt đầu");
      } else {
        setDateError("");
      }
    }
    
    setFormData({ ...formData, [name]: value });
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
  };

  // Generate array of dates between start and end date
  const generateDateRange = (startDate, endDate) => {
    const dates = [];
    const currentDate = new Date(startDate);
    const finalDate = new Date(endDate);
    
    while (currentDate <= finalDate) {
      dates.push(new Date(currentDate).toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate dates
    if (!formData.Start_Date || !formData.End_Date) {
      setMessage({
        text: "Vui lòng chọn ngày bắt đầu và ngày kết thúc",
        type: "error"
      });
      return;
    }
    
    if (formData.End_Date < formData.Start_Date) {
      setMessage({
        text: "Ngày kết thúc phải sau ngày bắt đầu",
        type: "error"
      });
      return;
    }
    
    if (!formData.Start_Time || !formData.End_Time) {
      setMessage({
        text: "Vui lòng chọn khung giờ",
        type: "error"
      });
      return;
    }
    
    setMessage({ text: "", type: "" });
    setCreatingSlots(true);

    try {
      // Generate dates in range
      const datesInRange = generateDateRange(formData.Start_Date, formData.End_Date);
      
      console.log("Creating slots for dates:", datesInRange);
      
      const results = [];
      let successCount = 0;
      let errorCount = 0;
      
      // Loop through each date and create slot
      for (const date of datesInRange) {
        try {
          const slotData = {
            Slot_Date: date,
            Start_Time: formData.Start_Time,
            End_Time: formData.End_Time,
            Max_Volume: parseInt(formData.Max_Volume)
          };

          const response = await createSlot(slotData);
          results.push({ date, success: true, response });
          successCount++;
          
          console.log(`Created slot for ${date}:`, response);
          
        } catch (error) {
          console.error(`Error creating slot for ${date}:`, error);
          results.push({ date, success: false, error: error.message });
          errorCount++;
        }
      }
      
      // Show summary message
      if (successCount > 0 && errorCount === 0) {
        setMessage({ 
          text: `Tạo thành công ${successCount} ca hiến máu từ ${new Date(formData.Start_Date).toLocaleDateString('vi-VN')} đến ${new Date(formData.End_Date).toLocaleDateString('vi-VN')}`, 
          type: "success" 
        });
      } else if (successCount > 0 && errorCount > 0) {
        setMessage({ 
          text: `Tạo thành công ${successCount} ca, thất bại ${errorCount} ca. Vui lòng kiểm tra console để xem chi tiết.`, 
          type: "warning" 
        });
      } else {
        setMessage({ 
          text: `Tạo thất bại tất cả ${errorCount} ca hiến máu. Vui lòng kiểm tra thông tin và thử lại.`, 
          type: "error" 
        });
      }
      
      // Clear form after successful submission
      if (successCount > 0) {
        setFormData({
          Start_Date: "",
          End_Date: "",
          Start_Time: "",
          End_Time: "",
          Max_Volume: ""
        });
      }
      
    } catch (error) {
      console.error("Error in bulk slot creation:", error);
      setMessage({ 
        text: error.message || "Đã xảy ra lỗi khi tạo ca hiến máu", 
        type: "error" 
      });
    } finally {
      setCreatingSlots(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-center text-lg font-semibold text-red-600 mb-6">
        Tạo Ca Hiến Máu
      </h2>
      
      {message.text && (
        <div className={`mb-4 p-3 rounded text-center ${
          message.type === "success" ? "bg-green-100 text-green-700" : 
          message.type === "warning" ? "bg-yellow-100 text-yellow-700" :
          "bg-red-100 text-red-700"
        }`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Ngày Bắt Đầu</label>
          <input
            type="date"
            name="Start_Date"
            value={formData.Start_Date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        {/* End Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Ngày Kết Thúc</label>
          <input
            type="date"
            name="End_Date"
            value={formData.End_Date}
            onChange={handleChange}
            className={`w-full border ${dateError ? "border-red-500" : "border-gray-300"} rounded px-3 py-2`}
            required
            min={formData.Start_Date || new Date().toISOString().split('T')[0]}
          />
          {dateError && (
            <p className="text-red-500 text-xs mt-1">{dateError}</p>
          )}
        </div>
        
        {/* Time Range Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">Khung Giờ</label>
          <select
            name="timeRange"
            value={`${formData.Start_Time}-${formData.End_Time}`}
            onChange={handleTimeRangeChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Chọn khung giờ hiến máu</option>
            <option value="07:00-11:00">07:00 - 11:00</option>
            <option value="13:00-17:00">13:00 - 17:00</option>
          </select>
        </div>

        {/* Max Volume */}
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
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || creatingSlots || !!dateError}
          className={`w-full ${
            loading || creatingSlots || dateError
              ? "bg-red-400 cursor-not-allowed" 
              : "bg-red-600 hover:bg-red-700"
          } text-white py-2 rounded transition`}
        >
          {creatingSlots ? "Đang tạo ca hiến máu..." : "Tạo Ca Hiến Máu"}
        </button>
        
        {/* Info text */}
        {formData.Start_Date && formData.End_Date && !dateError && (
          <p className="text-sm text-gray-600 text-center">
            Sẽ tạo ca hiến máu từ {new Date(formData.Start_Date).toLocaleDateString('vi-VN')} đến {new Date(formData.End_Date).toLocaleDateString('vi-VN')}
          </p>
        )}
      </form>
    </div>
  );
};

export default CreateSlot;
