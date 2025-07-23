import React, { useState, useEffect, useCallback, useMemo } from "react";
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

  const { loading, error, getSlotList, registerSlot, getCurrentUser, historyAppointmentsByUser, historyPatientByUser, cancelAppointmentByUser } = useApi();
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

  useEffect(() => {
    // Chỉ gọi khi đã đăng nhập và user là member
    if (localStorage.getItem("isLoggedIn") === "true" && user && user.user_role === "member") {
      const fetchHistory = async () => {
        try {
          const res = await historyAppointmentsByUser();
          setMyRegistrations(res.data || []);
        } catch {
          setMyRegistrations([]);
        }
      };
      fetchHistory();
    } else {
      setMyRegistrations([]);
    }
  }, [historyAppointmentsByUser, user]);

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

  // Helper chuyển trạng thái BE sang tiếng Việt
  const getStatusLabel = (status) => {
    switch (status) {
      case "Pending":
        return "Đang chờ chấp thuận";
      case "Processing":
        return "Được hiến";
      case "Completed":
        return "Đã hiến xong";
      case "Canceled":
        return "Từ chối";
      default:
        return status;
    }
  };

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
      toast.error("Tài khoản của bạn không có quyền đăng ký hiến máu"), {
        position: "top-right",
        autoClose: 3000
      }
      return;
    }
    if (!user.user_id) {
      toast.error("Không tìm thấy ID người dùng"), {
        position: "top-right",
        autoClose: 3000
      }
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
            
            ${!user.phone || !user.address || !user.full_name ? `
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
        await registerSlot(slotId, user.user_id);
        toast.success("Đăng ký hiến máu thành công!");

        // Refresh data sau khi đăng ký thành công
        const slotsRes = await getSlotList();
        setSlots(slotsRes.data);
        setFilteredSlots(slotsRes.data);

        // Thêm dòng này để reload lại lịch sử đăng ký
        const regRes = await historyAppointmentsByUser();
        setMyRegistrations(regRes.data || []);
      }

    } catch (error) {
      console.error("Error registering slot:", error);
      toast.error(error?.message || "Đăng ký thất bại. Vui lòng thử lại!");
    }
  };


  // Helper: Tìm ca đăng ký gần nhất
  const latestRegistration = useMemo(() => {
    if (!myRegistrations || myRegistrations.length === 0) return null;
    return myRegistrations.reduce((max, reg) => {
      const d = new Date(reg.Slot_Date);
      return d > new Date(max.Slot_Date) ? reg : max;
    }, myRegistrations[0]);
  }, [myRegistrations]);

  // Helper: Cộng 1 tháng cho ngày
  function addMonths(date, months) {
    const d = new Date(date);
    const day = d.getDate();
    d.setMonth(d.getMonth() + months);
    // Xử lý trường hợp tháng mới không có ngày đó (ví dụ 31/1 + 1 tháng = 28/2)
    if (d.getDate() < day) {
      d.setDate(0);
    }
    return d;
  }

  // Helper: Ngày có thể đăng ký lại
  const nextRegisterDate = useMemo(() => {
    if (!latestRegistration) return null;
    return addMonths(new Date(latestRegistration.Slot_Date), 3);
  }, [latestRegistration]);

  // Helper: User chỉ được đăng ký ca có ngày >= ngày được phép đăng ký lại
  const canRegisterSlot = useCallback(
    (slotDate) => {
      if (!nextRegisterDate) return true;
      return new Date(slotDate) >= nextRegisterDate;
    },
    [nextRegisterDate]
  );

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

  const formatTimeVN = (timeString) => {
    if (!timeString) return "-";
    // Nếu có chữ T (ISO format)
    if (timeString.includes("T")) {
      const tIndex = timeString.indexOf("T");
      const timePart = timeString.slice(tIndex + 1, tIndex + 6); // "13:00"
      const [h, m] = timePart.split(":");
      if (!h || !m) return "-";
      return `${parseInt(h, 10)}h${m}`;
    }
    // Nếu là dạng "07:00:00"
    const [h, m] = timeString.split(":");
    if (!h || !m) return "-";
    return `${parseInt(h, 10)}h${m}`;
  };

  // Memoize the empty state message
  const emptyStateMessage = useMemo(() => {
    return slots.length === 0
      ? "Hiện tại chưa có lịch hiến máu nào được mở."
      : "Không tìm thấy lịch hiến máu nào trong khoảng thời gian đã chọn.";
  }, [slots.length]);

  // Helper: Kiểm tra user đã đăng ký bất kỳ ca nào chưa
  const hasAnyRegistration = useMemo(() => {
    return myRegistrations && myRegistrations.length > 0;
  }, [myRegistrations]);

  // Sắp xếp slot theo ngày tăng dần
  const sortedFilteredSlots = [...filteredSlots].sort((a, b) => {
    const dateA = new Date((a.Slot_Date || '').slice(0, 10) + 'T00:00:00').getTime();
    const dateB = new Date((b.Slot_Date || '').slice(0, 10) + 'T00:00:00').getTime();
    return dateA - dateB;
  });

  // State cho popup xem hồ sơ bệnh án
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [patientInfo, setPatientInfo] = useState(null);
  const [patientLoading, setPatientLoading] = useState(false);

  // Hàm xem hồ sơ bệnh án
  const handleViewPatient = async (appointmentId) => {
    setPatientLoading(true);
    setShowPatientModal(true);
    try {
      const res = await historyPatientByUser(appointmentId);
      setPatientInfo(res.data || null);
    } catch {
      setPatientInfo(null);
    } finally {
      setPatientLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    const confirm = await Swal.fire({
      title: "Xác nhận hủy lịch?",
      text: "Bạn chắc chắn muốn hủy lịch hiến máu này? Hành động này không thể hoàn tác.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hủy lịch",
      cancelButtonText: "Đóng",
      confirmButtonColor: "#dc2626"
    });
    if (!confirm.isConfirmed) return;
    try {
      await cancelAppointmentByUser(appointmentId);
      toast.success("Đã hủy lịch thành công!");
      // Reload lại lịch sử
      const res = await historyAppointmentsByUser();
      setMyRegistrations(res.data || []);
      // Reload lại danh sách slot
      const slotsRes = await getSlotList();
      setSlots(slotsRes.data);
      setFilteredSlots(slotsRes.data);
    } catch (err) {
      toast.error(err?.message || "Hủy lịch thất bại!");
    }
  };

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

            // Kiểm tra user đã đăng ký slot này chưa
            const isRegistered =
              myRegistrations &&
              myRegistrations.some((reg) => reg.Slot_ID === slot.Slot_ID);
            if (window && window.console) {
              console.log(
                "[DEBUG][FE] Slot:",
                slot.Slot_ID,
                "| isRegistered:",
                isRegistered,
                "| myRegistrations:",
                myRegistrations
              );
              console.log(
                "[DEBUG][FE] Slot:",
                slot.Slot_ID,
                "| Start_Time:",
                slot.Start_Time,
                "| End_Time:",
                slot.End_Time
              );
            }

            // Tìm ca đăng ký gần nhất
            const isLatestSlot =
              latestRegistration && slot.Slot_ID === latestRegistration.Slot_ID;
            // Ngày có thể đăng ký lại
            const canRegister = canRegisterSlot
              ? canRegisterSlot(slot.Slot_Date)
              : true;
            // Disable nếu đã đăng ký, slot đầy, hoặc chưa đủ 1 tháng
            const disableRegister = loading || isSlotFull || isRegistered;

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
                      {slot.Start_Time && slot.End_Time
                        ? `${formatTimeVN(slot.Start_Time)} - ${formatTimeVN(slot.End_Time)}`
                        : "-"}
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
                  {/* ==== PHẦN HIỂN THỊ DANH SÁCH SLOT ====
                  Thay đổi nút ở đây: Nếu đã đăng ký thì thành nút Hủy đăng ký, nếu chưa thì là Đăng ký */}
                  <button
                    disabled={isSlotFull || loading || (!isRegistered && !canRegister)}
                    className={`w-full py-2 px-4 rounded transition duration-300 flex items-center justify-center font-semibold
                      ${isSlotFull
                        ? "bg-yellow-200 text-yellow-700 cursor-not-allowed"
                        : isRegistered
                          ? "bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300"
                          : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                    title={
                      isRegistered
                        ? "Bạn đã đăng ký ca này. Nhấn để hủy đăng ký."
                        : isSlotFull
                          ? "Ca này đã đầy, vui lòng chọn ca khác."
                          : ""
                    }
                    onClick={() => {
                      if (isRegistered) {
                        const appointment = myRegistrations.find(reg => reg.Slot_ID === slot.Slot_ID);
                        if (appointment) handleCancelAppointment(appointment.Appointment_ID);
                      } else {
                        handleRegister(slot.Slot_ID);
                      }
                    }}
                  >
                    {isRegistered ? (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Hủy đăng ký
                      </>
                    ) : loading ? (
                      "Đang đăng ký..."
                    ) : isSlotFull ? (
                      "Đã đầy"
                    ) : (
                      "Đăng ký"
                    )}
                  </button>
                  {/* Chỉ hiển thị ngày có thể đăng ký lại ở ca gần nhất và chỉ khi ca đó là ca đã đăng ký gần nhất */}
                  {!canRegister && isLatestSlot && nextRegisterDate && (
                    <div className="text-center text-blue-700 mt-2 text-sm">
                      Bạn có thể đăng ký lại sau ngày:{" "}
                      <span className="font-semibold">
                        {nextRegisterDate.toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Hiển thị lịch sử đăng ký hiến máu của bạn */}
      {/* XÓA đoạn sau khỏi return:
      {localStorage.getItem("isLoggedIn") === "true" && user && (
        <div className="mt-10 mb-8">
          <h2 className="text-2xl font-bold text-red-600 mb-6 text-center uppercase tracking-wide drop-shadow">
            Lịch sử đăng ký hiến máu của bạn
          </h2>
          {myRegistrations.length === 0 ? (
            <div className="text-center text-gray-500 py-8 bg-white rounded-lg shadow-md">
              Bạn chưa đăng ký hiến máu nào.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl shadow-lg border border-gray-200">
                <thead className="bg-red-100">
                  <tr>
                    <th className="px-6 py-3 text-center text-base font-semibold">Ngày</th>
                    <th className="px-6 py-3 text-center text-base font-semibold">Khung giờ</th>
                    <th className="px-6 py-3 text-center text-base font-semibold">Lượng máu (ml)</th>
                    <th className="px-6 py-3 text-center text-base font-semibold">Trạng thái</th>
                    <th className="px-6 py-3 text-center text-base font-semibold">Hồ sơ bệnh án</th>
                    <th className="px-6 py-3 text-center text-base font-semibold">Lý do từ chối</th>
                  </tr>
                </thead>
                <tbody>
                  {myRegistrations.map((reg) => {
                    // Màu cho trạng thái
                    let statusColor = "text-gray-700 bg-gray-50";
                    if (reg.Status === "Pending") statusColor = "text-yellow-700 bg-yellow-50";
                    else if (reg.Status === "Processing") statusColor = "text-blue-700 bg-blue-50";
                    else if (reg.Status === "Completed") statusColor = "text-green-700 bg-green-50";
                    else if (reg.Status === "Canceled") statusColor = "text-red-700 bg-red-50";

                    return (
                      <tr
                        key={reg.Appointment_ID}
                        className="border-b hover:bg-gray-100 text-center transition"
                      >
                        <td className="px-6 py-3 font-medium">{formatDateVN(reg.Slot_Date)}</td>
                        <td className="px-6 py-3 font-mono text-blue-700">
                          {reg.Start_Time && reg.End_Time
                            ? `${formatTimeVN(reg.Start_Time)} - ${formatTimeVN(reg.End_Time)}`
                            : "-"}
                        </td>
                        <td className="px-6 py-3 font-semibold">
                          {reg.Status === "Completed" && reg.Volume
                            ? (
                              <span className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-full">
                                {reg.Volume} ml
                              </span>
                            )
                            : (
                              <span className="text-gray-400">-</span>
                            )
                          }
                        </td>
                        <td className={`px-6 py-3 font-semibold rounded ${statusColor}`}>
                          {getStatusLabel(reg.Status)}
                        </td>
                        <td className="px-6 py-3">
                          <button
                            className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-medium shadow-sm hover:bg-blue-100 hover:border-blue-300 transition"
                            onClick={() => handleViewPatient(reg.Appointment_ID)}
                          >
                            Xem hồ sơ
                          </button>
                        </td>
                        <td className="px-6 py-3">
                          {reg.Status === "Canceled" && reg.Reason_Reject ? (
                            <span
                              className="inline-block bg-red-50 text-red-700 px-3 py-1 rounded-full"
                              title={reg.Reason_Reject}
                            >
                              {reg.Reason_Reject.length > 30
                                ? reg.Reason_Reject.slice(0, 30) + "..."
                                : reg.Reason_Reject}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="text-xs text-gray-500 mt-2 text-right pr-2">
                * Lượng máu chỉ hiển thị khi trạng thái là <span className="text-green-700 font-semibold">Đã hiến xong</span>
              </div>
            </div>
          )}
        </div>
      )} */}

      {/* Popup xem hồ sơ bệnh án */}
      {showPatientModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[400px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4 text-center text-blue-700">Hồ sơ bệnh án</h2>
            {patientLoading ? (
              <div className="text-center text-gray-500 py-8">Đang tải...</div>
            ) : patientInfo ? (
              <>
                <div className="mb-3">
                  <span className="font-semibold">Mô tả:</span>
                  <div className="text-gray-800 mt-1">{patientInfo.Description || <span className="italic text-gray-400">Chưa có mô tả</span>}</div>
                </div>
                <div className="mb-3">
                  <span className="font-semibold">Trạng thái:</span>
                  <div className="text-gray-800 mt-1">{patientInfo.Status || <span className="italic text-gray-400">Chưa cập nhật</span>}</div>
                </div>
                {/* Có thể bổ sung thêm trường khác nếu BE trả về */}
              </>
            ) : (
              <div className="text-center text-gray-400 py-8">Không có dữ liệu bệnh án.</div>
            )}
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                onClick={() => setShowPatientModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonateBlood;