import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useApi from "../../hooks/useApi";
import { FaCalendarAlt, FaSearch } from "react-icons/fa";
import { DateFilter } from "../../components/DateFilter";

const DonateBlood = () => {
  const [user, setUser] = useState(null);
  const [slots, setSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [isSearching, setIsSearching] = useState(false);
  const { loading, error, getSlotList, registerSlot, getCurrentUser, updateUser, getBloodTypes } =
    useApi();
  const navigate = useNavigate();
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [touched, setTouched] = useState(false);
  const [registerStage, setRegisterStage] = useState(0); // 0: Thông tin cá nhân, 1: Khai báo y tế
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [registerForm, setRegisterForm] = useState({
    User_Name: "",
    YOB: "",
    Address: "",
    Phone: "",
    Gender: "",
    BloodType_ID: "",
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: ""
  });
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [medicalQuestions, setMedicalQuestions] = useState([
    {
      id: "q1",
      question: "1. Bạn đã từng hiến máu chưa?",
      options: ["Có", "Không"],
      type: "radio",
    },
    {
      id: "q2",
      question: "2. Trong 6 tháng qua, bạn có xăm hình hoặc xỏ khuyên không?",
      options: ["Có", "Không"],
      type: "radio",
    },
    {
      id: "q3",
      question: "3. Bạn có đang mắc các bệnh truyền nhiễm (viêm gan B/C, HIV, giang mai, sốt rét, lao, v.v.) không?",
      options: ["Có", "Không"],
      type: "radio",
    },
    {
      id: "q4",
      question: "4. Bạn có đang sử dụng thuốc điều trị bệnh mãn tính (tim mạch, tiểu đường, huyết áp, v.v.) không?",
      options: ["Có", "Không"],
      type: "radio",
    },
    {
      id: "q5",
      question: "5. Trong 7 ngày qua, bạn có bị sốt, cảm cúm, hoặc nhiễm trùng không?",
      options: ["Có", "Không"],
      type: "radio",
    },
    {
      id: "q6",
      question: "6. Trong 12 tháng qua, bạn có phẫu thuật lớn hoặc truyền máu không?",
      options: ["Có", "Không"],
      type: "radio",
    },
  ]);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [bloodTypes, setBloodTypes] = useState([]);

  // Fetch slots data on component mount
  useEffect(() => {
    fetchSlots();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      getCurrentUser()
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, [getCurrentUser]);

  useEffect(() => {
    if (user && user.user_id) {
      fetchMyRegistrations();
    }
  }, [user]);

  // Khi load trang lần đầu, nếu có donate_date_range thì giữ nguyên, nếu không thì hiển thị tất cả slot
  useEffect(() => {
    const saved = localStorage.getItem('donate_date_range');
    if (saved) {
      try {
        const [start, end] = JSON.parse(saved);
        setDateRange([start, end]);
        // Khi có filter, filter luôn slot
        setTimeout(() => filterSlotsByDate(), 0);
      } catch {}
    } else {
      setDateRange([null, null]);
      setFilteredSlots(slots);
    }
    // eslint-disable-next-line
  }, []);

  // Lưu date range vào localStorage mỗi khi thay đổi
  useEffect(() => {
    if (startDate && endDate) {
      localStorage.setItem('donate_date_range', JSON.stringify([startDate, endDate]));
    }
  }, [startDate, endDate]);

  useEffect(() => {
    getBloodTypes().then(res => {
      if (res && res.data) setBloodTypes(res.data);
    });
  }, [getBloodTypes]);

  const fetchSlots = async () => {
    try {
      const response = await getSlotList();
      const slotsData = response.data || [];
      console.log("[DEBUG][FE] Slot list:", slotsData);
      setSlots(slotsData);
      // Nếu có filter ngày trong localStorage thì filter luôn
      const saved = localStorage.getItem('donate_date_range');
      if (saved) {
        try {
          const [start, end] = JSON.parse(saved);
          if (start && end) {
            // Filter lại slot theo khoảng ngày
            const toInt = (d) => {
              if (!d) return null;
              if (typeof d === 'object' && d instanceof Date) {
                const y = d.getFullYear();
                const m = (d.getMonth() + 1).toString().padStart(2, '0');
                const day = d.getDate().toString().padStart(2, '0');
                return parseInt(`${y}${m}${day}`);
              }
              const str = d.trim().slice(0, 10);
              if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(str)) return null;
              const [y, m, day] = str.split('-');
              if (!y || !m || !day) return null;
              return parseInt(`${y}${m}${day}`);
            };
            const startInt = toInt(start);
            const endInt = toInt(end);
            const filtered = slotsData.filter((slot) => {
              if (!slot.Slot_Date) return false;
              const slotInt = toInt(slot.Slot_Date);
              if (!slotInt) return false;
              return slotInt >= startInt && slotInt <= endInt;
            });
            setFilteredSlots(filtered);
            return;
          }
        } catch {}
      }
      setFilteredSlots(slotsData);
    } catch (error) {
      toast.error(error.message || "Không thể tải danh sách lịch hiến máu");
    }
  };

  const fetchMyRegistrations = async () => {
    try {
      const response = await fetch(
        `/api/appointments/history?userId=${user.user_id}`
      );
      const data = await response.json();
      setMyRegistrations(data.data || []);
    } catch (err) {
      setMyRegistrations([]);
    }
  };

  // Tối ưu hóa hàm filterSlotsByDate với useCallback
  const filterSlotsByDate = useCallback(() => {
    if (!startDate && !endDate) {
      setFilteredSlots(slots);
      return;
    }
    // Helper kiểm tra ngày hợp lệ và chuyển về số nguyên yyyymmdd
    const toInt = (d) => {
      if (!d) return null;
      // Nếu là object Date thì format về yyyy-MM-dd
      if (typeof d === 'object' && d instanceof Date) {
        const y = d.getFullYear();
        const m = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return parseInt(`${y}${m}${day}`);
      }
      const str = d.trim().slice(0, 10);
      if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(str)) return null;
      const [y, m, day] = str.split('-');
      if (!y || !m || !day) return null;
      return parseInt(`${y}${m}${day}`);
    };
    const startInt = startDate ? toInt(startDate) : null;
    const endInt = endDate ? toInt(endDate) : null;
    const filtered = slots.filter((slot) => {
      if (!slot.Slot_Date) return false;
      const slotInt = toInt(slot.Slot_Date);
      if (!slotInt) return false;
      // Chỉ lấy slot nằm hoàn toàn trong khoảng (bao gồm cả ngày đầu và cuối)
      if (startInt && endInt) return slotInt >= startInt && slotInt <= endInt;
      if (startInt) return slotInt >= startInt;
      if (endInt) return slotInt <= endInt;
      return true;
    });
    setFilteredSlots(filtered);
  }, [slots, startDate, endDate]);

  const handleSearch = () => {
    setIsSearching(true);
    try {
      filterSlotsByDate();
      setTouched(false);
      // Lưu lại filter vào localStorage
      if (startDate && endDate) {
        localStorage.setItem('donate_date_range', JSON.stringify([startDate, endDate]));
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleRegister = async (slotId) => {
    if (!user) {
      toast.error("Không tìm thấy thông tin người dùng");
      return;
    }
    if (user.user_role !== "member") {
      toast.error("Tài khoản của bạn không có quyền đăng ký hiến máu");
      return;
    }
    if (!user.user_id) {
      toast.error("Không tìm thấy ID người dùng");
      return;
    }
    // Nếu đã đăng ký 1 ca, chỉ cho phép đăng ký lại đúng ca đó
    if (myRegistrations && myRegistrations.length > 0) {
      const isRegistered = myRegistrations.some(
        (reg) => reg.Slot_ID === slotId
      );
      if (!isRegistered) {
        toast.info(
          "Bạn chỉ được đăng ký hiến máu 1 lần trong 1 tháng kể từ lần đăng ký trước. Nếu muốn đổi ca, hãy liên hệ quản trị viên."
        );
        return;
      }
    }
    await registerSlot(slotId, user.user_id);
    toast.success("Đăng ký hiến máu thành công!");
    fetchSlots(); // Refresh slots after successful registration
  };

  // Helper kiểm tra user đã đăng ký hiến máu trong vòng 1 tháng gần nhất chưa
  const hasRecentRegistration = useMemo(() => {
    if (!myRegistrations || myRegistrations.length === 0) return false;
    // Lấy ngày đăng ký gần nhất
    const latest = myRegistrations.reduce((max, reg) => {
      const d = new Date(reg.Slot_Date);
      return d > max ? d : max;
    }, new Date("1970-01-01"));
    // Kiểm tra nếu ngày gần nhất cách hiện tại < 30 ngày
    const now = new Date();
    const diffDays = (now - latest) / (1000 * 60 * 60 * 24);
    return diffDays < 30;
  }, [myRegistrations]);

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
    return addMonths(new Date(latestRegistration.Slot_Date), 1);
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
  // Helper format giờ dạng 7h00, trả về rỗng nếu không hợp lệ
  const formatTimeVN = (timeString) => {
    if (!timeString) return "";
    // Nếu là object Date
    if (typeof timeString === 'object' && timeString instanceof Date) {
      const h = timeString.getHours().toString().padStart(2, '0');
      const m = timeString.getMinutes().toString().padStart(2, '0');
      return `${parseInt(h, 10)}h${m}`;
    }
    // Nếu là string
    if (
      timeString === "00:00:00" ||
      timeString === "-" ||
      timeString === "Invalid Date"
    )
      return "";
    const parts = timeString.split(":");
    if (parts.length < 2) return "";
    const [h, m] = parts;
    if (!h || !m) return "";
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

  // Khi user thay đổi ngày, cho phép search lại
  const handleDateChange = (range) => {
    setDateRange(range);
    setTouched(true);
  };

  // Sắp xếp slot theo ngày tăng dần
  const sortedFilteredSlots = [...filteredSlots].sort((a, b) => {
    const dateA = new Date((a.Slot_Date || '').slice(0, 10) + 'T00:00:00').getTime();
    const dateB = new Date((b.Slot_Date || '').slice(0, 10) + 'T00:00:00').getTime();
    return dateA - dateB;
  });

  const handleEdit = (appointmentId) => {
    // Implement the logic to handle editing the appointment
    console.log("Editing appointment:", appointmentId);
  };

  // Trong handleOpenRegisterModal, reset stage về 0
  const handleOpenRegisterModal = (slot) => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để đăng ký hiến máu");
      return;
    }
    setSelectedSlot(slot);
    setRegisterForm({
      User_Name: user.user_name || "",
      YOB: user.yob ? user.yob.slice(0, 10) : "",
      Address: user.address || "",
      Phone: user.phone || "",
      Gender: user.gender || "",
      BloodType_ID: user.bloodtype_id || "",
      q1: "",
      q2: "",
      q3: "",
      q4: "",
      q5: "",
      q6: ""
    });
    setRegisterStage(0);
    setShowRegisterModal(true);
  };

  // Khi xác nhận đăng ký
  const handleRegisterConfirm = async () => {
    setRegisterLoading(true);
    try {
      // Nếu thông tin cá nhân thay đổi, gọi updateUser trước
      const original = {
        User_Name: user.user_name || "",
        YOB: user.yob ? user.yob.slice(0, 10) : "",
        Address: user.address || "",
        Phone: user.phone || "",
        Gender: user.gender || "",
        BloodType_ID: user.bloodtype_id || "",
      };
      const changed = Object.keys(original).some(key => registerForm[key] !== original[key]);
      if (changed) {
        await updateUser({
          user_name: registerForm.User_Name,
          yob: registerForm.YOB,
          address: registerForm.Address,
          phone: registerForm.Phone,
          gender: registerForm.Gender,
          bloodtype_id: registerForm.BloodType_ID,
          user_id: user.user_id
        });
      }
      // Gọi API đăng ký slot (lưu vào DB) và gửi thêm khai báo y tế
      await registerSlot(selectedSlot.Slot_ID, user.user_id, {
        Health_Declaration: medicalQuestions.reduce((acc, q) => {
          acc[q.question] = registerForm[q.id];
          return acc;
        }, {})
      });
      setShowRegisterModal(false);
      setShowSuccessModal(true);
      fetchSlots(); // Cập nhật lại danh sách slot
      if (typeof fetchMyRegistrations === 'function') fetchMyRegistrations();
    } catch (err) {
      toast.error("Đăng ký thất bại. Vui lòng thử lại.");
      // KHÔNG đóng popup đăng ký nếu lỗi
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm({
      ...registerForm,
      [name]: value,
    });
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
            onDateChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            searchDisabled={!touched}
          />
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
                    onClick={() => handleOpenRegisterModal(slot)}
                    disabled={disableRegister}
                    className={`w-full py-2 px-4 rounded transition duration-300 flex items-center justify-center font-semibold
                      ${
                        isSlotFull
                          ? "bg-yellow-200 text-yellow-700 cursor-not-allowed"
                          : isRegistered
                          ? "bg-blue-200 text-blue-700 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                    title={
                      isRegistered
                        ? "Bạn đã đăng ký ca này."
                        : isSlotFull
                        ? "Ca này đã đầy, vui lòng chọn ca khác."
                        : ""
                    }
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Đã đăng ký
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

      {/* Hiển thị danh sách ca đã đăng ký của tôi */}
      {/* PHẦN NÀY ĐÃ ĐƯỢC LÀM ĐẸP Ở DƯỚI, XÓA HOÀN TOÀN ĐỂ KHÔNG BỊ THỪA */}

      {/* Hiển thị lịch sử đăng ký hiến máu của bạn */}
      {user && (
        <div className="mt-10 mb-8">
          <h2 className="text-2xl font-bold text-red-600 mb-6 text-center uppercase tracking-wide drop-shadow">Lịch sử đăng ký hiến máu của bạn</h2>
          {myRegistrations && myRegistrations.length === 0 ? (
            <div className="text-center text-gray-500 py-8 bg-white rounded-lg shadow-md">Bạn chưa đăng ký hiến máu nào.</div>
          ) : (
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
          )}
        </div>
      )}

      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">{registerStage === 0 ? "Thông tin cá nhân" : "Khai báo y tế"}</h2>
            {registerStage === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Họ và tên</label>
                  <input name="User_Name" value={registerForm.User_Name} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Năm sinh</label>
                  <input name="YOB" type="date" value={registerForm.YOB} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Địa chỉ</label>
                  <input name="Address" value={registerForm.Address} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Số điện thoại</label>
                  <input name="Phone" value={registerForm.Phone} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Giới tính</label>
                  <select name="Gender" value={registerForm.Gender} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none">
                    <option value="">Chọn</option>
                    <option value="M">Nam</option>
                    <option value="F">Nữ</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1">Nhóm máu</label>
                  <select
                    name="BloodType_ID"
                    value={registerForm.BloodType_ID}
                    onChange={e => setRegisterForm(f => ({ ...f, BloodType_ID: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                  >
                    <option value="">Chọn nhóm máu</option>
                    {bloodTypes.map(bt => (
                      <option key={bt.BloodType_ID} value={bt.BloodType_ID}>{bt.Blood_group}{bt.RHFactor}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            {registerStage === 1 && (
              <div className="max-h-72 overflow-y-auto pr-2 space-y-4">
                {medicalQuestions.map((q, idx) => (
                  <div key={q.id} className="bg-blue-50 rounded-xl p-4 flex items-start gap-3 shadow-sm border border-blue-100">
                    <div className="flex-shrink-0 mt-1 text-blue-400">
                      <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z' /></svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-blue-900 mb-2 text-base">{q.question}</div>
                      <div className="flex gap-8">
                        {q.options.map((opt) => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer text-blue-800 hover:text-blue-600 text-base">
                            <input
                              type="radio"
                              name={q.id}
                              value={opt}
                              checked={registerForm[q.id] === opt}
                              onChange={handleFormChange}
                              className="w-5 h-5 accent-blue-500"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between mt-8">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold"
                onClick={() => {
                  if (registerStage === 0) setShowRegisterModal(false);
                  else setRegisterStage(0);
                }}
              >
                {registerStage === 0 ? "Hủy" : "Quay lại"}
              </button>
              {registerStage === 0 ? (
                <button
                  className="px-4 py-2 rounded bg-blue-600 text-white font-semibold"
                  onClick={() => setRegisterStage(1)}
                  disabled={!(registerForm.User_Name && registerForm.YOB && registerForm.Address && registerForm.Phone && registerForm.Gender && registerForm.BloodType_ID)}
                >
                  Tiếp tục
                </button>
              ) : (
                <button
                  className="px-4 py-2 rounded bg-green-600 text-white font-semibold flex items-center justify-center min-w-[100px]"
                  onClick={handleRegisterConfirm}
                  disabled={!medicalQuestions.every((q) => registerForm[q.id]) || registerLoading}
                >
                  {registerLoading ? (
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                  ) : null}
                  Hoàn tất
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-2xl font-bold text-green-600 mb-4">Đăng ký hiến máu thành công!</div>
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white font-semibold"
              onClick={() => setShowSuccessModal(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonateBlood;
