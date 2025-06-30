import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useApi from "../../hooks/useApi";
import { FaCalendarAlt, FaSearch } from "react-icons/fa";
import React from "react";

const DonateBlood = () => {
  const [user, setUser] = useState(null);
  const [slots, setSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [isSearching, setIsSearching] = useState(false);
  const { loading, error, getSlotList, registerSlot, getCurrentUser } = useApi();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Fetch slots data on component mount
  useEffect(() => {
    fetchSlots();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      getCurrentUser().then(res => setUser(res.data)).catch(() => setUser(null));
    }
  }, [getCurrentUser]);

  const fetchSlots = async () => {
    try {
      const response = await getSlotList();
      const slotsData = response.data || [];
      setSlots(slotsData);
      setFilteredSlots(slotsData);
    } catch (error) {
      if (
        error.message?.includes("Unexpected end of JSON input") ||
        error.message?.includes("Failed to execute 'json'")
      ) {
        toast.error("Không nhận phản hồi từ server");
      } else {
        toast.error(error.message || "Không thể tải danh sách lịch hiến máu");
      }
    }
  };

  // Tối ưu hóa hàm filterSlotsByDate với useCallback
  const filterSlotsByDate = useCallback(() => {
    if (!startDate && !endDate) {
      setFilteredSlots(slots);
      return;
    }

    const filtered = slots.filter((slot) => {
      if (!slot.Slot_Date) return false;

      const slotDate = new Date(slot.Slot_Date);
      slotDate.setHours(0, 0, 0, 0); // Loại bỏ thời gian để so sánh chỉ theo ngày

      const compareStartDate = startDate ? new Date(startDate) : null;
      const compareEndDate = endDate ? new Date(endDate) : null;

      if (compareStartDate) compareStartDate.setHours(0, 0, 0, 0);
      if (compareEndDate) compareEndDate.setHours(0, 0, 0, 0);

      // Simplified logic with early returns
      if (compareStartDate && compareEndDate) {
        return slotDate >= compareStartDate && slotDate <= compareEndDate;
      }
      if (compareStartDate) {
        return slotDate >= compareStartDate;
      }
      if (compareEndDate) {
        return slotDate <= compareEndDate;
      }

      return true;
    });

    setFilteredSlots(filtered);
  }, [slots, startDate, endDate]);

  const handleSearch = () => {
    setIsSearching(true);
    try {
      filterSlotsByDate();
    } finally {
      setIsSearching(false);
    }
  };
  const handleRegisterClick = (slot) => {
    setSelectedSlot(slot);
    setShowConfirm(true);
  };

  const handleConfirmRegister = async () => {
    setShowConfirm(false);
    if (!user) {
      toast.error("Không tìm thấy thông tin người dùng");
      return;
    }
    if (user.user_role !== 'member') {
      toast.error("Tài khoản của bạn không có quyền đăng ký hiến máu");
      return;
    }
    if (!user.user_id) {
      toast.error("Không tìm thấy ID người dùng");
      return;
    }
    try {
      await registerSlot(selectedSlot.Slot_ID, user.user_id);
      toast.success("Đăng ký hiến máu thành công!");
      fetchSlots();
    } catch (error) {
      // Kiểm tra lỗi duplicate key
      if (
        error?.response?.data?.includes("UNIQUE KEY constraint") ||
        error?.message?.includes("UNIQUE KEY constraint")
      ) {
        toast.error("Bạn đã đăng ký lịch hiến máu này rồi!");
      } else if (
        error.message?.includes("Unexpected end of JSON input") ||
        error.message?.includes("Failed to execute 'json'")
      ) {
        toast.error("Không nhận phản hồi từ server");
      } else {
        toast.error(error.message || "Đăng ký thất bại!");
      }
    }
  };

  // Format helpers
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  }, []);

  const formatTime = useCallback((timeString) => {
    if (!timeString) return "";
    return timeString.substring(0, 5); // Get HH:MM part
  }, []);

  // Memoize the empty state message
  const emptyStateMessage = useMemo(() => {
    return "Không tìm thấy lịch hiến máu nào trong khoảng thời gian đã chọn.";
  }, []);
  console.log(user)
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-red-600">Đăng ký hiến máu</h1>

      {/* Date Range Picker - Optimized UI */}
      <div className="mb-8 overflow-hidden rounded-lg shadow">
        <div className="flex flex-col md:flex-row">
          <div className="flex items-center p-4 md:p-5 bg-white md:border-r border-gray-200 md:whitespace-nowrap">
            <FaCalendarAlt className="mr-3 text-red-600" />
            <span className="font-medium text-gray-700">Bạn cần đặt lịch vào thời gian nào?</span>
          </div>

          <div className="flex flex-1">
            <div className="flex-1">
              {/* Input thứ nhất (startDate) */}
              <div className="relative flex-1">
                <div className="absolute left-10 top-0 bg-gray-50 text-xs font-medium text-gray-500 px-1 py-0.5 rounded">
                  Từ ngày
                </div>
                <input
                  type="date"
                  value={startDate ? startDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    const newDate = e.target.value ? new Date(e.target.value) : null;
                    setDateRange([newDate, endDate]);
                  }}
                  className="w-full h-full pl-10 pt-6 pb-2 border-0 focus:outline-none"
                />
              </div>

              {/* Input thứ hai (endDate) */}
              <div className="relative flex-1">
                <div className="absolute left-10 top-0 bg-gray-50 text-xs font-medium text-gray-500 px-1 py-0.5 rounded">
                  Đến ngày
                </div>
                <input
                  type="date"
                  value={endDate ? endDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    const newDate = e.target.value ? new Date(e.target.value) : null;
                    setDateRange([startDate, newDate]);
                  }}
                  className="w-full h-full pl-10 pt-6 pb-2 border-0 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-red-600 text-white px-8 py-4 flex items-center justify-center min-w-[120px] disabled:bg-blue-400"
            >Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      {/* Display states */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : error && !error.includes("UNIQUE KEY constraint") ? (
        <div className="text-center text-red-500 py-8 bg-white rounded-lg shadow p-4">
          <p className="text-lg">
            {error.includes("Unexpected end of JSON input") || error.includes("Failed to execute 'json'")
              ? "Không nhận phản hồi từ server"
              : error}
          </p>
        </div>
      ) : filteredSlots.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow p-4">
          <p className="text-lg text-gray-600">{emptyStateMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSlots.map((slot) => {
            const isSlotFull = slot.Status !== 'A' || (parseInt(slot.Volume) >= parseInt(slot.Max_Volume));

            return (
              <div key={slot.Slot_ID} className="bg-white rounded-lg shadow-md overflow-hidden transform transition hover:shadow-lg hover:-translate-y-1">
                <div className="bg-red-100 p-4">
                  <h3 className="text-xl font-semibold text-red-800">
                    Lịch hiến máu: {formatDate(slot.Slot_Date)}
                  </h3>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-gray-700 mb-2">
                      <span className="font-medium">Thời gian: </span>
                      {formatTime(slot.Start_Time)} - {formatTime(slot.End_Time)}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <span className="font-medium">Số lượng đã đăng ký: </span>
                      <span className={parseInt(slot.Volume) >= parseInt(slot.Max_Volume) ? "text-red-600 font-medium" : ""}>
                        {slot.Volume || 0}/{slot.Max_Volume || 0}
                      </span>
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Trạng thái: </span>
                      {slot.Status === 'A' ?
                        <span className="text-green-600 font-medium">Đang mở đăng ký</span> :
                        <span className="text-red-600 font-medium">Đã đầy</span>
                      }
                    </p>
                  </div>

                  <button
                    onClick={() => handleRegisterClick(slot)}
                    disabled={loading || isSlotFull}
                    className={`w-full py-2 px-4 rounded transition duration-300 
                      ${isSlotFull
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700 text-white'}`}
                  >
                    {loading ? 'Đang đăng ký...' : isSlotFull ? 'Đã đầy' : 'Đăng ký'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && selectedSlot && user && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-[#D32F2F] mb-4">Xác nhận đăng ký hiến máu</h2>

            {/* Thông tin người dùng */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Thông tin người đăng ký</h3>
              <p><strong>Họ tên:</strong> {user.user_name || "Chưa có"}</p>
              <p><strong>Số điện thoại:</strong> {user.phone || "Chưa có"}</p>
              <p><strong>Email:</strong> {user.email || "Chưa có"}</p>
              <p><strong>Nhóm máu:</strong> {user.blood_group || "Chưa có"}</p>
            </div>

            {/* Thông tin slot */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Thông tin lịch hiến máu</h3>
              <p><strong>Ngày:</strong> {formatDate(selectedSlot.Slot_Date)}</p>
              <p><strong>Thời gian:</strong> {formatTime(selectedSlot.Start_Time)} - {formatTime(selectedSlot.End_Time)}</p>
              <p><strong>Số lượng đã đăng ký:</strong> {selectedSlot.Volume}/{selectedSlot.Max_Volume}</p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={() => setShowConfirm(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded bg-[#D32F2F] text-white hover:bg-[#b71c1c]"
                onClick={handleConfirmRegister}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonateBlood;
