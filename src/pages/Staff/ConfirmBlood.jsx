import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useApi from "../../hooks/useApi";

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

// Danh sách ID staff/admin cố định
const specialIds = ["U001", "U002"];

// Hàm chuẩn hóa User_ID về dạng Uxxx (chữ hoa, đủ 3 số)
const normalizeUserId = (id) => {
  const m = (id || "").match(/u?(\d{1,3})/i);
  if (!m) return id || "";
  return `U${m[1].padStart(3, "0")}`;
};

const ConfirmBloodPage = () => {
  const [confirmList, setConfirmList] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const { getSlotList } = useApi();
  const [slotList, setSlotList] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [viewDeclaration, setViewDeclaration] = useState(null);
  const [showDeclarationModal, setShowDeclarationModal] = useState(false);
  const [bloodTypeMap, setBloodTypeMap] = useState({}); // Lưu nhóm máu staff chọn

  // Fetch danh sách xác nhận từ BE
  const fetchConfirmList = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/appointments/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log(
        "[DEBUG][FE] Dữ liệu nhận từ API /api/appointments/list:",
        data
      ); // DEBUG
      setConfirmList(data.data || []);
      if (!data.data || data.data.length === 0) {
        console.warn("[BUG][FE] API trả về rỗng hoặc không có dữ liệu!");
      }
    } catch (err) {
      setConfirmList([]);
      console.error("[BUG][FE] Lỗi fetch API /api/appointments/list:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch danh sách slot từ BE
  const fetchSlotList = async () => {
    try {
      const res = await getSlotList();
      setSlotList(res.data || []);
    } catch (err) {
      setSlotList([]);
      console.error("[BUG][FE] Lỗi fetch API /api/getSlotList:", err);
    }
  };

  useEffect(() => {
    fetchConfirmList();
    fetchSlotList();
  }, []);

  const handleConfirm = (id) => {
    setSelectedId(id);
    setShowApproveModal(true);
  };
  const handleApproveSubmit = async () => {
    setShowApproveModal(false);
    setLoading(true);
    try {
      await fetch("/api/appointments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Appointment_ID: selectedId,
          Status: "A",
          Verified_BloodType: bloodTypeMap[selectedId] // Lưu nhóm máu staff chọn
        }),
      });
      await fetchConfirmList();
    } finally {
      setLoading(false);
      setSelectedId(null);
    }
  };
  const handleApproveClose = () => {
    setShowApproveModal(false);
    setSelectedId(null);
  };

  const handleReject = (id) => {
    setSelectedId(id);
    setShowRejectModal(true);
  };
  const handleRejectModalClose = () => {
    setShowRejectModal(false);
    setRejectReason("");
    setSelectedId(null);
  };
  const handleRejectModalSubmit = () => {
    setShowRejectConfirm(true);
  };
  const handleRejectConfirmClose = () => {
    setShowRejectConfirm(false);
  };
  const handleRejectConfirmSubmit = async () => {
    setShowRejectModal(false);
    setShowRejectConfirm(false);
    setLoading(true);
    try {
      await fetch("/api/appointments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Appointment_ID: selectedId,
          Status: "R",
          Reject_Reason: rejectReason,
          Verified_BloodType: bloodTypeMap[selectedId]
        }),
      });
      await fetchConfirmList();
    } finally {
      setLoading(false);
      setRejectReason("");
      setSelectedId(null);
      setEditingId(null);
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setShowEditConfirm(true);
  };
  const handleEditConfirm = async () => {
    setShowEditConfirm(false);
    if (!editingId) return;
    setLoading(true);
    setConfirmList((prev) => prev.map(item =>
      item.Appointment_ID === editingId ? { ...item, Status: "P" } : item
    ));
    try {
      await fetch("/api/appointments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Appointment_ID: editingId,
          Status: "P",
          Verified_BloodType: bloodTypeMap[editingId] // Lưu nhóm máu staff chọn khi chỉnh sửa
        }),
      });
      await fetchConfirmList();
    } finally {
      setLoading(false);
      setEditingId(null);
    }
  };
  const handleEditCancel = () => {
    setShowEditConfirm(false);
    setEditingId(null);
  };

  // Hàm lấy khung giờ từ slot, đồng bộ cho các ID có cùng slot
  const getSlotTime = (slotId, userId, item) => {
    const id = normalizeUserId(userId);
    if (specialIds.includes(id)) return "-";
    const slot = slotList.find((s) => s.Slot_ID === slotId);
    if (slot) {
      const start = formatTimeVN(slot.Start_Time);
      const end = formatTimeVN(slot.End_Time);
      return `${start} - ${end}`;
    }
    // Fallback: lấy từ item nếu có
    if (item && item.Start_Time && item.End_Time) {
      const start = formatTimeVN(item.Start_Time);
      const end = formatTimeVN(item.End_Time);
      return `${start} - ${end}`;
    }
    return "-";
  };

  // Tạo danh sách member đã được đánh lại số thứ tự
  const getDisplayId = (item, memberIndexMap) => {
    const id = normalizeUserId(item.User_ID || item.id);
    if (specialIds.includes(id)) return id;
    // Member: lấy số thứ tự từ map
    const idx = memberIndexMap.get(item.Appointment_ID);
    return `U${(idx + 1).toString().padStart(3, "0")}`;
  };

  const rejectReasons = [
    "Không đủ điều kiện sức khỏe",
    "Không đạt yêu cầu về tuổi/cân nặng",
    "Đang mắc bệnh truyền nhiễm",
    "Đã hiến máu gần đây",
    "Thông tin khai báo không trung thực",
    "Lý do khác"
  ];

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-center text-[#D32F2F] mb-6">
          Xác nhận nhóm máu người dùng
        </h1>
        {/* Ô search theo ID */}
        <div className="mb-4 flex justify-end">
          <div className="relative w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4-4m0 0A7 7 0 104 4a7 7 0 0013 13z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Nhập mã ID (U001, U010...)"
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-full focus:outline-none focus:border-[#D32F2F] shadow-sm transition-all"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
            />
          </div>
        </div>
        <div className="bg-white shadow-md rounded overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-[#F1F1F1]">
              <tr>
                <th className="px-3 py-2 text-center text-[#D32F2F]">ID</th>
                <th className="px-3 py-2 text-center text-[#D32F2F]">Người dùng</th>
                <th className="px-3 py-2 text-center text-[#D32F2F]">Nhóm máu</th>
                <th className="px-3 py-2 text-center text-[#D32F2F]">Khai báo</th>
                <th className="px-3 py-2 text-center text-[#D32F2F]">Xác thực</th>
                <th className="px-3 py-2 text-center text-[#D32F2F]">Khung giờ</th>
                <th className="px-3 py-2 text-center text-[#D32F2F]">Trạng thái</th>
                <th className="px-3 py-2 text-center text-[#D32F2F]">Hành động</th>
                <th className="px-2 py-2 text-center text-[#D32F2F] w-32">Lý do từ chối</th>
              </tr>
            </thead>
            <tbody className="border-t min-h-[300px] align-middle">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-24 text-lg text-gray-400 align-middle">
                    Đang tải...
                  </td>
                </tr>
              ) : confirmList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-24 text-lg text-gray-400 align-middle">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                (() => {
                  // Tạo map: Appointment_ID -> số thứ tự member (bỏ qua staff/admin)
                  const memberIndexMap = new Map();
                  let memberIdx = 0;
                  confirmList
                    .slice()
                    .sort((a, b) => {
                      const getNum = (id) => {
                        const m = (id || "").match(/U(\d+)/i);
                        return m ? parseInt(m[1], 10) : 99999;
                      };
                      return getNum(a.User_ID || a.id) - getNum(b.User_ID || b.id);
                    })
                    .forEach(item => {
                      const id = normalizeUserId(item.User_ID || item.id);
                      if (!specialIds.includes(id)) {
                        memberIndexMap.set(item.Appointment_ID, memberIdx++);
                      }
                    });
                  // Render lại bảng
                  return confirmList
                    .slice()
                    .sort((a, b) => {
                      const getNum = (id) => {
                        const m = (id || "").match(/U(\d+)/i);
                        return m ? parseInt(m[1], 10) : 99999;
                      };
                      return getNum(a.User_ID || a.id) - getNum(b.User_ID || b.id);
                    })
                    .filter(item =>
                      getDisplayId(item, memberIndexMap)
                        .toLowerCase()
                        .includes(searchId.toLowerCase())
                    )
                    .map((item) => (
                      <tr key={item.Appointment_ID} className="hover:bg-[#FFF5F5] transition-all border-b border-gray-100">
                        <td className="px-3 py-2 text-center font-semibold">{getDisplayId(item, memberIndexMap)}</td>
                        <td className="px-3 py-2 text-center">{item.User_Name || item.name}</td>
                        <td className="px-3 py-2 text-center">
                          <select
                            value={
                              bloodTypeMap[item.Appointment_ID] ?? item.Verified_BloodType ?? (item.Status === "R" ? item.Blood_group : "")
                            }
                            onChange={e => setBloodTypeMap(prev => ({
                              ...prev,
                              [item.Appointment_ID]: e.target.value
                            }))}
                            className="appearance-none pr-6 py-[0.02rem] rounded border border-gray-300 bg-white text-center"
                            disabled={editingId !== item.Appointment_ID}
                          >
                            <option value="A">A</option>
                            <option value="O">O</option>
                            <option value="B">B</option>
                            <option value="AB">AB</option>
                          </select>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-200"
                            onClick={() => {
                              setViewDeclaration(item.Health_Declaration || item.healthDeclaration || null);
                              setShowDeclarationModal(true);
                            }}
                          >
                            Xem khai báo
                          </button>
                        </td>
                        <td className="px-3 py-2 text-center font-bold text-[#D32F2F]">
                          {item.Verified_BloodType || "-"}
                        </td>
                        <td className="px-3 py-2 text-center">{getSlotTime(item.Slot_ID, item.User_ID || item.id, item)}</td>
                        <td className="px-3 py-2 text-center">
                          {item.Status === "P" && (
                            <span className="inline-block px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-xs">Chờ xác nhận</span>
                          )}
                          {item.Status === "A" && (
                            <span className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-800 font-semibold text-xs">Được hiến</span>
                          )}
                          {item.Status === "R" && (
                            <span className="inline-block px-2 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-xs">Từ chối</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {editingId === item.Appointment_ID ? (
                            <div className="flex flex-row justify-center items-center gap-2">
                              <button
                                className="bg-green-500 text-white px-2 py-1 rounded font-semibold text-xs shadow-sm hover:bg-green-600 transition-all"
                                onClick={async () => {
                                  setShowEditConfirm(false);
                                  setLoading(true);
                                  await fetch("/api/appointments/confirm", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                      Appointment_ID: item.Appointment_ID,
                                      Status: "A",
                                      Verified_BloodType: bloodTypeMap[item.Appointment_ID]
                                    }),
                                  });
                                  await fetchConfirmList();
                                  setEditingId(null);
                                }}
                              >
                                Xác nhận
                              </button>
                              <button
                                className="bg-red-500 text-white px-2 py-1 rounded font-semibold text-xs shadow-sm hover:bg-red-600 transition-all"
                                onClick={() => {
                                  setSelectedId(item.Appointment_ID);
                                  setShowRejectModal(true);
                                }}
                              >
                                Từ chối
                              </button>
                              <button
                                className="bg-gray-400 text-white px-2 py-1 rounded font-semibold text-xs shadow-sm hover:bg-gray-500 transition-all"
                                onClick={() => setEditingId(null)}
                              >
                                Hủy
                              </button>
                            </div>
                          ) : (
                            <button
                              className="bg-blue-500 text-white px-3 py-1.5 rounded-md font-semibold shadow-sm hover:bg-blue-700 transition-all duration-150 w-20 text-center text-sm"
                              onClick={() => setEditingId(item.Appointment_ID)}
                            >
                              Chỉnh sửa
                            </button>
                          )}
                        </td>
                        <td className="px-2 py-2 text-center whitespace-pre-line break-words max-w-xs">{item.Status === "R" ? item.Reject_Reason : "-"}</td>
                      </tr>
                    ));
                })()
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal xác nhận đồng ý */}
      {showApproveModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              Bạn chắc chắn muốn xác nhận cho người này hiến máu?
            </h2>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={handleApproveClose}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={handleApproveSubmit}
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal nhập lý do từ chối */}
      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Nhập lý do từ chối</h2>
            <select
              className="w-full border rounded p-2 mb-2"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
            >
              <option value="">-- Chọn lý do --</option>
              {rejectReasons.map((reason, idx) => (
                <option key={idx} value={reason}>{reason}</option>
              ))}
            </select>
            {rejectReason === "Lý do khác" && (
              <textarea
                className="w-full border rounded p-2 mb-4"
                rows={3}
                value={rejectReason === "Lý do khác" ? "" : rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Nhập lý do..."
              />
            )}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={handleRejectModalClose}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={handleRejectModalSubmit}
                disabled={!rejectReason.trim()}
              >
                Từ chối
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal xác nhận lại khi từ chối */}
      {showRejectConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              Bạn chắc chắn muốn từ chối ca hiến máu này?
            </h2>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={handleRejectConfirmClose}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={handleRejectConfirmSubmit}
              >
                Đồng ý từ chối
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal xác nhận chỉnh sửa */}
      {showEditConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Bạn có chắc muốn chuyển về trạng thái chờ xác nhận để chỉnh sửa không?</h2>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={handleEditCancel}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleEditConfirm}
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeclarationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[400px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4 text-center text-red-700">Khai báo y tế</h2>
            <div className="bg-blue-50 rounded-lg p-4 mb-2">
              {(() => {
                let declaration = viewDeclaration;
                if (typeof declaration === 'string') {
                  try {
                    declaration = JSON.parse(declaration);
                  } catch {}
                }
                if (!declaration || typeof declaration !== 'object') {
                  return <div className="text-gray-500 text-center">Không có dữ liệu khai báo y tế.</div>;
                }
                return (
                  <ul className="space-y-3">
                    {Object.entries(declaration).map(([question, answer], idx) => (
                      <li key={idx} className="bg-white rounded shadow p-3 flex flex-col">
                        <span className="font-medium text-gray-800 mb-1">{question}</span>
                        <span className="text-blue-700 font-semibold">{answer}</span>
                      </li>
                    ))}
                  </ul>
                );
              })()}
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                onClick={() => setShowDeclarationModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ConfirmBloodPage;
