import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useApi from "../../hooks/useApi";
import { DateFilter } from "../../components/DateFilter";
import Swal from "sweetalert2";

const DonateBlood = () => {
  const [user, setUser] = useState(null);
  const [slots, setSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [isSearching, setIsSearching] = useState(false);
  const [myRegistrations, setMyRegistrations] = useState([]);

  const { loading, error, getSlotList, registerSlot, getCurrentUser } = useApi();
  const navigate = useNavigate();
  const location = useLocation();

  // Nhận giá trị từ navigation state
  useEffect(() => {
    if (location.state?.startDate || location.state?.endDate) {
      const { startDate: navStartDate, endDate: navEndDate, shouldFilter } = location.state;

      console.log("Received from homepage:", { navStartDate, navEndDate, shouldFilter });

      // Set date range từ homepage
      setDateRange([navStartDate, navEndDate]);

      // Nếu có flag shouldFilter và đã có slots, tự động filter
      if (shouldFilter && slots.length > 0) {
        filterSlotsByDateWithParams(navStartDate, navEndDate);
      }

      // Clear navigation state sau khi sử dụng
      window.history.replaceState({}, document.title);
    }
  }, [location.state, slots]);

  // Existing useEffect for fetching data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        if (isLoggedIn) {
          const userRes = await getCurrentUser();
          setUser(userRes.data);
        }

        const slotsRes = await getSlotList();
        setSlots(slotsRes.data);
        setFilteredSlots(slotsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [getCurrentUser, getSlotList]);

  // useEffect(() => {
  //   if (user && user.user_id) {
  //     fetchMyRegistrations();
  //   }
  // }, [user]);

  // Auto-filter khi có slots và có date từ homepage
  useEffect(() => {
    if (location.state?.shouldFilter && slots.length > 0 && (location.state?.startDate || location.state?.endDate)) {
      const { startDate: navStartDate, endDate: navEndDate } = location.state;
      filterSlotsByDateWithParams(navStartDate, navEndDate);
    }
  }, [slots, location.state]);

  // const fetchMyRegistrations = async () => {
  //   try {
  //     const response = await fetch(
  //       `/api/appointments/history?userId=${user.user_id}`
  //     );
  //     const data = await response.json();
  //     setMyRegistrations(data.data || []);
  //   } catch (err) {
  //     setMyRegistrations([]);
  //   }
  // };

  // Logic tìm kiếm từ code đầu
  const filterSlotsByDateWithParams = useCallback((startDateStr, endDateStr) => {
    if (!startDateStr && !endDateStr) {
      setFilteredSlots(slots);
      return;
    }

    const filtered = slots.filter(slot => {
      const slotDate = new Date(slot.Slot_Date);
      const startFilter = startDateStr ? new Date(startDateStr) : null;
      const endFilter = endDateStr ? new Date(endDateStr) : null;

      if (startFilter && endFilter) {
        return slotDate >= startFilter && slotDate <= endFilter;
      } else if (startFilter) {
        return slotDate >= startFilter;
      } else if (endFilter) {
        return slotDate <= endFilter;
      }
      return true;
    });

    setFilteredSlots(filtered);
  }, [slots]);

  const filterSlotsByDate = useCallback(() => {
    filterSlotsByDateWithParams(startDate, endDate);
  }, [filterSlotsByDateWithParams, startDate, endDate]);

  const handleSearch = () => {
    setIsSearching(true);
    try {
      filterSlotsByDate();
    } finally {
      setIsSearching(false);
    }
  };

  const handleRegister = async (slotId) => {
    // Kiểm tra user có đăng nhập không
    if (!user || localStorage.getItem("isLoggedIn") !== "true") {
      const result = await Swal.fire({
        title: 'Lưu ý',
        text: 'Vui lòng đăng nhập để đặt lịch hiến máu.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy'
      });

      if (result.isConfirmed) {
        navigate("/login");
      }
      return;
    }
    if (user.user_role !== "member") {
      toast.error("Tài khoản của bạn không có quyền đăng ký hiến máu", {
        position: "top-right",
        autoClose: 3000
      });
      return;
    }
    if (!user.user_id) {
      toast.error("Không tìm thấy ID người dùng", {
        position: "top-right",
        autoClose: 3000
      });
      return;
    }

    try {
      const selectedSlot = slots.find(slot => slot.Slot_ID === slotId);
      if (!selectedSlot) {
        toast.error("Không tìm thấy thông tin ca hiến máu!");
        return;
      }

      // Custom confirmation popup
      const result = await Swal.fire({
        title: '<span style="color: #dc2626;">🩸 Xác nhận đăng ký hiến máu</span>',
        html: `
          <div style="text-align: left; padding: 20px;">
            <!-- Thông tin người dùng -->
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #22c55e, #16a34a); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                  <span style="color: white; font-size: 20px; font-weight: bold;">${(user.full_name || 'U').charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h4 style="color: #16a34a; margin: 0; font-size: 18px;">👤 ${user.full_name || 'Người dùng'}</h4>
                  <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">${user.email || 'Chưa cập nhật email'}</p>
                </div>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
                <div><strong>📱 SĐT:</strong> ${user.phone || 'Chưa cập nhật'}</div>
                <div><strong>🎂 Tuổi:</strong> ${user.date_of_birth ? new Date().getFullYear() - new Date(user.date_of_birth).getFullYear() : 'Chưa rõ'}</div>
                <div><strong>⚧ Giới tính:</strong> ${user.gender === 'M' ? 'Nam' : user.gender === 'F' ? 'Nữ' : 'Chưa rõ'}</div>
                <div><strong>🏠 Địa chỉ:</strong> ${user.address ? (user.address.length > 20 ? user.address.substring(0, 20) + '...' : user.address) : 'Chưa cập nhật'}</div>
              </div>
            </div>
            
            <!-- Thông tin ca hiến máu -->
            <div style="background: linear-gradient(135deg, #fef2f2 0%, #fef7f7 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <h4 style="color: #dc2626; margin: 0 0 15px 0; font-size: 16px;">📅 Chi tiết ca hiến máu</h4>
              <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #dc2626;">
                <p style="margin: 8px 0; font-size: 15px;"><strong>📆 Ngày:</strong> <span style="color: #dc2626;">${formatDateVN(selectedSlot.Slot_Date)}</span></p>
                <p style="margin: 8px 0; font-size: 15px;"><strong>🕐 Thời gian:</strong> <span style="color: #dc2626;">${formatTimeVN(selectedSlot.Start_Time)} - ${formatTimeVN(selectedSlot.End_Time)}</span></p>
                <p style="margin: 8px 0; font-size: 15px;"><strong>👥 Lượt đăng ký:</strong> <span style="color: ${parseInt(selectedSlot.Volume || 0) >= parseInt(selectedSlot.Max_Volume || 0) * 0.8 ? '#dc2626' : '#16a34a'};">${selectedSlot.Volume || 0}/${selectedSlot.Max_Volume || 0} người</span></p>
              </div>
            </div>
            
            <!-- Lưu ý quan trọng -->
            <div style="background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%); padding: 20px; border-radius: 12px; margin-bottom: 15px;">
              <h4 style="color: #1d4ed8; margin: 0 0 15px 0; display: flex; align-items: center;">
                <span style="margin-right: 8px;">⚠️</span> Điều kiện hiến máu
              </h4>
              <div style="background: white; padding: 15px; border-radius: 8px;">
                <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                  <li>Đến đúng giờ, muộn nhất 30 phút sau giờ bắt đầu</li>
                  <li>Không uống rượu bia, thuốc lá trong 24h trước</li>
                  <li>Ăn uống đầy đủ, uống nhiều nước trước khi đến</li>
                  <li>Nghỉ ngơi đầy đủ, không thức khuya</li>

                </ul>
              </div>
            </div>
            
            ${!user.phone || !user.address ? `
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; font-size: 14px; color: #92400e;">
                  <strong>📋 Lưu ý:</strong> Một số thông tin cá nhân chưa được cập nhật. 
                  Vui lòng hoàn thiện hồ sơ để quá trình hiến máu được thuận lợi hơn.
                </p>
              </div>
            ` : ''}
          </div>
        `,
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: '✅ Xác nhận đăng ký',
        cancelButtonText: '❌ Hủy bỏ',
        width: '700px',
        padding: '0'
      });

      if (result.isConfirmed) {
        try {
          await registerSlot(slotId, user.user_id);
          toast.success("Đăng ký hiến máu thành công!");

          // Refresh data sau khi đăng ký thành công
          const slotsRes = await getSlotList();
          setSlots(slotsRes.data);
          setFilteredSlots(slotsRes.data);

        } catch (registerError) {
          console.error("Register slot error:", registerError);

          // Hiển thị thông báo lỗi cụ thể từ backend
          const errorMessage = registerError.message || "Đăng ký thất bại. Vui lòng thử lại!";

          // Hiển thị toast với message từ backend
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 10000, // Hiển thị lâu hơn vì message dài
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            style: {
              whiteSpace: 'pre-wrap', // Giữ nguyên format từ backend
              fontSize: '14px',
              lineHeight: '1.5',
              maxWidth: '450px'
            }
          });

          // KHÔNG refresh data khi có lỗi
          return;
        }
      }

    } catch (error) {
      console.error("Error in handleRegister:", error);
      // Fallback error nếu có lỗi khác
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };




  // Helper format ngày tiếng Việt
  const formatDateVN = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  // Helper format giờ dạng 7h00, trả về '-' nếu không hợp lệ
  const formatTimeVN = (timeString) => {
    if (
      !timeString ||
      timeString === "00:00:00" ||
      timeString === "-" ||
      timeString === "Invalid Date"
    )
      return "-";
    const parts = timeString.split(":");
    if (parts.length < 2) return "-";
    const [h, m] = parts;
    if (!h || !m) return "-";
    return `${parseInt(h, 10)}h${m}`;
  };


  // Sắp xếp slot theo ngày tăng dần
  const sortedFilteredSlots = [...filteredSlots].sort((a, b) => {
    const dateA = new Date((a.Slot_Date || '').slice(0, 10) + 'T00:00:00').getTime();
    const dateB = new Date((b.Slot_Date || '').slice(0, 10) + 'T00:00:00').getTime();
    return dateA - dateB;
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-red-600">
        Đăng ký hiến máu
      </h1>

      <div className="mb-8 flex justify-center">
        <div className="w-full max-w-xl">
          <DateFilter
            onSearch={handleSearch}
            onDateChange={setDateRange}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>

      {/* Display states */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : filteredSlots.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow p-4">
          <p className="text-lg text-gray-600">
            {startDate || endDate ? "Không có lịch hiến máu nào trong khoảng thời gian đã chọn" : "Không có lịch hiến máu nào"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedFilteredSlots.map((slot) => {
            const isSlotFull = slot.Status !== 'A' || (parseInt(slot.Volume) >= parseInt(slot.Max_Volume));

            return (
              <div
                key={slot.Slot_ID}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition hover:shadow-lg hover:-translate-y-1"
              >
                <div className="bg-red-100 p-4">
                  <h3 className="text-xl font-semibold text-red-800">
                    Lịch hiến máu: {formatDateVN(slot.Slot_Date)}
                  </h3>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-gray-700 mb-2">
                      <span className="font-medium">Thời gian: </span>
                      {formatTimeVN(slot.Start_Time)} -{" "}
                      {formatTimeVN(slot.End_Time)}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <span className="font-medium">Số lượng đã đăng ký: </span>
                      <span
                        className={
                          parseInt(slot.Volume) >= parseInt(slot.Max_Volume)
                            ? "text-red-600 font-medium"
                            : ""
                        }
                      >
                        {slot.Volume || 0}/{slot.Max_Volume || 0}
                      </span>
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Trạng thái: </span>
                      {slot.Status === "A" ? (
                        <span className="text-green-600 font-medium">
                          Đang mở đăng ký
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium">Đã đầy</span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRegister(slot.Slot_ID)}
                    className={`w-full py-2 px-4 rounded transition duration-300 flex items-center justify-center font-semibold
                      ${isSlotFull
                        ? "bg-yellow-200 text-yellow-700 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                    title={
                      isSlotFull
                        ? "Ca này đã đầy, vui lòng chọn ca khác."
                        : ""
                    }
                  >
                    {loading ? (
                      "Đang đăng ký..."
                    ) : isSlotFull ? (
                      "Đã đầy"
                    ) : (
                      "Đăng ký"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Hiển thị lịch sử đăng ký hiến máu của bạn */}
      {user && (
        <div className="mt-10 mb-8">
          <h2 className="text-2xl font-bold text-red-600 mb-6 text-center uppercase tracking-wide drop-shadow">Lịch sử đăng ký hiến máu của bạn</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow-lg border border-gray-200">
              <thead className="bg-red-100">
                <tr>
                  <th className="px-6 py-3 text-center text-base font-semibold">Ngày</th>
                  <th className="px-6 py-3 text-center text-base font-semibold">Khung giờ</th>
                  <th className="px-6 py-3 text-center text-base font-semibold">Trạng thái</th>
                  <th className="px-6 py-3 text-center text-base font-semibold">Lý do từ chối</th>
                </tr>
              </thead>
              <tbody>
                {myRegistrations &&
                  myRegistrations.map((reg) => {
                    // Tìm slot tương ứng
                    const slot = slots.find(s => s.Slot_ID === reg.Slot_ID);
                    const startTime = slot ? slot.Start_Time : reg.Start_Time;
                    const endTime = slot ? slot.End_Time : reg.End_Time;
                    return (
                      <tr key={reg.Appointment_ID} className="border-b hover:bg-gray-50 text-center">
                        <td className="px-6 py-3">{formatDateVN(reg.Slot_Date)}</td>
                        <td className="px-6 py-3 font-mono text-sm text-blue-700">
                          {formatTimeVN(startTime)}{formatTimeVN(endTime) ? ` - ${formatTimeVN(endTime)}` : ""}
                        </td>
                        <td className="px-6 py-3">
                          {reg.Status === "P" && (
                            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold text-xs shadow">Chờ xác nhận</span>
                          )}
                          {reg.Status === "A" && (
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold text-xs shadow">Được hiến</span>
                          )}
                          {reg.Status === "R" && (
                            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-semibold text-xs shadow">Từ chối</span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-gray-700">{reg.Status === "R" && reg.Reject_Reason ? reg.Reject_Reason : "-"}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
};

export default DonateBlood;
