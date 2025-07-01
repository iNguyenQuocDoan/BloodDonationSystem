import { FaCalendarAlt } from "react-icons/fa";

export function DateFilter({ onSearch, onDateChange, startDate, endDate, modernStyle }) {
  return (
    <div className={modernStyle ? "bg-white rounded-lg shadow p-6 border border-blue-300" : "bg-white rounded-lg shadow p-6 mb-6"}>
      <div className="flex items-center mb-4">
        <FaCalendarAlt className={modernStyle ? "text-blue-600 text-2xl mr-2" : "text-[#D32F2F] text-2xl mr-2"} />
        <span className={modernStyle ? "font-semibold text-lg text-gray-800" : "font-semibold text-lg text-gray-800"}>Bạn cần đặt lịch vào thời gian nào?</span>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-gray-500 text-sm">Từ ngày</label>
        <input type="date" value={startDate || ''} onChange={e => onDateChange([e.target.value, endDate])} className={modernStyle ? "border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" : "border rounded px-2 py-1"} />
        <label className="text-gray-500 text-sm">Đến ngày</label>
        <input type="date" value={endDate || ''} onChange={e => onDateChange([startDate, e.target.value])} className={modernStyle ? "border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" : "border rounded px-2 py-1"} />
      </div>
      <button onClick={onSearch} 
        disabled={!startDate && !endDate}
        className={
          (modernStyle
            ? "w-full mt-4 bg-blue-100 text-blue-700 py-2 rounded font-semibold hover:bg-blue-200 transition"
            : "w-full mt-4 bg-[#D32F2F] text-white py-2 rounded font-semibold"
          ) +
          ((!startDate && !endDate) ? " cursor-not-allowed" : "")
        }
        title={!startDate && !endDate ? "Vui lòng chọn ít nhất một ngày để tìm kiếm lịch hiến máu" : ""}
      >Tìm kiếm</button>
    </div>
  );
}

export default DateFilter; 