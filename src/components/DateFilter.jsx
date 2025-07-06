import { FaCalendarAlt } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { addMonths, subMonths } from 'date-fns';

export function DateFilter({ onSearch, onDateChange, startDate, endDate, modernStyle, searchDisabled }) {
  const [showPicker, setShowPicker] = useState(false);
  const [range, setRange] = useState({
    startDate: startDate ? new Date(startDate) : null,
    endDate: endDate ? new Date(endDate) : null,
    key: 'selection',
  });
  const pickerRef = useRef();

  // Cập nhật khi props thay đổi
  useEffect(() => {
    setRange({
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      key: 'selection',
    });
  }, [startDate, endDate]);

  // Đóng picker khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    }
    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPicker]);

  const displayValue = (range.startDate && range.endDate && range.startDate < range.endDate)
    ? `${format(range.startDate, 'dd/MM/yyyy')} - ${format(range.endDate, 'dd/MM/yyyy')}`
    : "";

  const handleRangeChange = (ranges) => {
    const sel = ranges.selection;
    setRange(sel);
    if (sel.startDate && sel.endDate && sel.startDate < sel.endDate) {
      onDateChange([
        format(sel.startDate, 'yyyy-MM-dd'),
        format(sel.endDate, 'yyyy-MM-dd')
      ]);
      setShowPicker(false);
    }
  };

  const customMonthRenderer = (month, shortMonth, longMonth, date, decreaseMonth, increaseMonth) => (
    <div className="flex items-center justify-between px-2 py-1">
      <button type="button" onClick={decreaseMonth} className="text-xl px-2">{'<'}</button>
      <span className="font-semibold">{longMonth} {date.getFullYear()}</span>
      <button type="button" onClick={increaseMonth} className="text-xl px-2">{'>'}</button>
    </div>
  );

  return (
    <div className={modernStyle ? "bg-white rounded-lg shadow p-6 border border-blue-300" : "bg-white rounded-lg shadow p-6 mb-6"}>
      <div className="flex items-center mb-4">
        <FaCalendarAlt className={modernStyle ? "text-blue-600 text-2xl mr-2" : "text-[#D32F2F] text-2xl mr-2"} />
        <span className={modernStyle ? "font-semibold text-lg text-gray-800" : "font-semibold text-lg text-gray-800"}>Bạn cần đặt lịch vào thời gian nào?</span>
      </div>
      <div className="relative">
        <input
          type="text"
          readOnly
          value={displayValue}
          placeholder="Từ ngày - Đến ngày"
          className={modernStyle ? "border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 w-full" : "border rounded px-2 py-2 w-full"}
          onClick={() => setShowPicker(true)}
        />
        {showPicker && (
          <div ref={pickerRef} className="absolute z-20 bg-white shadow-lg rounded mt-2 left-0">
            <DateRange
              editableDateInputs={true}
              onChange={handleRangeChange}
              moveRangeOnFirstSelection={false}
              ranges={[range]}
              maxDate={new Date('2100-12-31')}
              locale={vi}
              rangeColors={["#D32F2F"]}
              monthDisplayFormat="MMMM yyyy"
              renderMonthAndYear={customMonthRenderer}
              showMonthAndYearPickers={false}
              showDateDisplay={false}
              showPreview={false}
            />
          </div>
        )}
      </div>
      <button onClick={onSearch} 
        disabled={searchDisabled || !(range.startDate && range.endDate && range.startDate < range.endDate)}
        className={
          (modernStyle
            ? "w-full mt-4 bg-blue-100 text-blue-700 py-2 rounded font-semibold hover:bg-blue-200 transition"
            : "w-full mt-4 bg-[#D32F2F] text-white py-2 rounded font-semibold"
          ) +
          (searchDisabled || !(range.startDate && range.endDate && range.startDate < range.endDate) ? " cursor-not-allowed opacity-60" : "")
        }
        title={!(range.startDate && range.endDate && range.startDate < range.endDate) ? "Vui lòng chọn đủ từ ngày và đến ngày để tìm kiếm lịch hiến máu" : ""}
      >Tìm kiếm</button>
    </div>
  );
}

export default DateFilter; 