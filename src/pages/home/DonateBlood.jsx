import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useApi from "../../hooks/useApi";
import { FaCalendarAlt, FaSearch } from "react-icons/fa";

const DonateBlood = () => {
  const [slots, setSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [isSearching, setIsSearching] = useState(false);
  const { loading, error, getSlotList, registerSlot } = useApi();
  const navigate = useNavigate();

  // Fetch slots data on component mount
  useEffect(() => {
    fetchSlots();
  }, []);


  const fetchSlots = async () => {
    try {
      const response = await getSlotList();
      const slotsData = response.data || [];
      setSlots(slotsData);
      setFilteredSlots(slotsData);
    } catch (error) {
      toast.error(error.message || "Không thể tải danh sách lịch hiến máu");
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

  const handleRegister = async (slotId) => {
    try {
      // Check login status
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      if (!isLoggedIn) {
        toast.warning("Vui lòng đăng nhập để đăng ký hiến máu");
        navigate("/login", { state: { from: "/donate" } });
        return;
      }

      // Get and validate user data
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        toast.error("Không tìm thấy thông tin người dùng");
        return;
      }

      const user = JSON.parse(userStr);

      // Check user role
      if (user.user_role !== 'member') {
        toast.error("Tài khoản của bạn không có quyền đăng ký hiến máu");
        return;
      }

      // Validate user_id
      if (!user.user_id) {
        toast.error("Không tìm thấy ID người dùng");
        console.error("User object missing user_id:", user);
        return;
      }

      // Call API and handle success
      await registerSlot(slotId, user.user_id);
      toast.success("Đăng ký hiến máu thành công!");
      fetchSlots(); // Refresh slots after successful registration
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Đăng ký thất bại");
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
    return slots.length === 0
      ? "Hiện tại chưa có lịch hiến máu nào được mở."
      : "Không tìm thấy lịch hiến máu nào trong khoảng thời gian đã chọn.";
  }, [slots.length]);

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
              <div  className="relative flex-1">
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
      ) : error ? (
        <div className="text-center text-red-500 py-8 bg-white rounded-lg shadow p-4">
          <p className="text-lg">{error}</p>
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
                    onClick={() => handleRegister(slot.Slot_ID)}
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
    </div>
  );
};

export default DonateBlood;
