import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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

const ConfirmBloodPage = () => {
  const [confirmList, setConfirmList] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchConfirmList();
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
        body: JSON.stringify({ Appointment_ID: selectedId, Status: "A" }),
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
        }),
      });
      await fetchConfirmList();
    } finally {
      setLoading(false);
      setRejectReason("");
      setSelectedId(null);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-center text-[#D32F2F] mb-6">
          Xác nhận nhóm máu người dùng
        </h1>
        <div className="bg-white shadow-md rounded overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-[#F1F1F1]">
              <tr>
                <th className="px-4 py-3 text-left text-[#D32F2F]">ID</th>
                <th className="px-4 py-3 text-left text-[#D32F2F]">
                  Người dùng
                </th>
                <th className="px-4 py-3 text-left text-[#D32F2F]">Khai báo</th>
                <th className="px-4 py-3 text-left text-[#D32F2F]">Xác thực</th>
                <th className="px-4 py-3 text-left text-[#D32F2F]">
                  Khung giờ
                </th>
                <th className="px-4 py-3 text-left text-[#D32F2F]">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left text-[#D32F2F]">
                  Hành Động
                </th>
                <th className="px-4 py-3 text-left text-[#D32F2F]">
                  Lý do từ chối
                </th>
              </tr>
            </thead>
            <tbody className="border-t">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    Đang tải...
                  </td>
                </tr>
              ) : confirmList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                confirmList.map((item) => (
                  <tr key={item.Appointment_ID}>
                    <td className="px-4 py-3">{item.User_ID || item.id}</td>
                    <td className="px-4 py-3">{item.User_Name || item.name}</td>
                    <td className="px-4 py-3">
                      {item.Declared_BloodType || item.bloodType}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        defaultValue={item.Verified_BloodType || item.bloodType}
                        className="appearance-none pr-6 py-[0.02rem] rounded border border-gray-300 bg-white"
                      >
                        <option>A</option>
                        <option>O</option>
                        <option>B</option>
                        <option>AB</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {formatTimeVN(item.Start_Time)} -{" "}
                      {formatTimeVN(item.End_Time)}
                    </td>
                    <td className="px-4 py-3">
                      {item.Status === "P" && (
                        <span className="text-yellow-600">Chờ xác nhận</span>
                      )}
                      {item.Status === "A" && (
                        <span className="text-green-600">Được hiến</span>
                      )}
                      {item.Status === "R" && (
                        <span className="text-red-600">Từ chối</span>
                      )}
                    </td>
                    <td className="px-4 py-3 gap-x-2">
                      <button
                        className="bg-[#D32F2F] text-white px-4 py-1 rounded mr-2"
                        onClick={() => handleConfirm(item.Appointment_ID)}
                        disabled={item.Status !== "P"}
                      >
                        Xác nhận
                      </button>
                      <button
                        className="bg-[#D32F2F] text-white px-4 py-1 rounded"
                        onClick={() => handleReject(item.Appointment_ID)}
                        disabled={item.Status !== "P"}
                      >
                        Từ chối
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      {item.Status === "R" ? item.Reject_Reason : "-"}
                    </td>
                  </tr>
                ))
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
            <textarea
              className="w-full border rounded p-2 mb-4"
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập lý do..."
            />
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
    </>
  );
};
export default ConfirmBloodPage;
