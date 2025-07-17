import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useApi from "../../hooks/useApi";

const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export default function ManageEmergencyPage() {
  const { loading, getEmergencyRequestList, getProfileER, getPotentialDonorPlus, sendEmergencyEmail } = useApi();

  const [filter, setFilter] = useState({
    bloodGroup: "",
    rhNeeded: "",
    status: "PENDING",
  });
  const [requests, setRequests] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // State cho popup thông tin người yêu cầu
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Thêm state cho popup danh sách ưu tiên
  const [potentialList, setPotentialList] = useState([]);
  const [showPotentialPopup, setShowPotentialPopup] = useState(false);
  const [checkedDonors, setCheckedDonors] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getEmergencyRequestList();
        setRequests(res.data || []);
      } catch (err) {
        console.error("Failed to fetch emergency requests", err);
      }
    })();
  }, [filter, refreshKey]);

  const handleStatusChange = async (id, nextStatus) => {
    // ...implement logic...
    setRefreshKey((k) => k + 1);
  };

  const handleViewRequester = async (req) => {
    try {
      const res = await getProfileER(req.Requester_ID);
      setSelectedProfile(res.data[0] || null);
    } catch (err) {
      setSelectedProfile({ error: "Không lấy được thông tin người yêu cầu" });
    }
  };

  const handleViewDonor = async (req) => {
    try {
      const res = await getProfileER(req.Donor_ID);
      setSelectedProfile(res.data[0] || null);
    } catch (err) {
      setSelectedProfile({ error: "Không lấy được thông tin người yêu cầu" });
    }
  };

  // Hàm lấy danh sách potential donor
  const handleShowPotentialList = async (emergencyId) => {
    try {
      const res = await getPotentialDonorPlus(emergencyId); // bạn cần thêm hàm này vào useApi.jsx
      setPotentialList(res.data || []);
      setShowPotentialPopup(true);
      setCheckedDonors([]); // reset checked
    } catch (err) {
      setPotentialList([]);
      setShowPotentialPopup(true);
    }
  };

  // Hàm xử lý check
  const handleCheckDonor = (donorId) => {
    setCheckedDonors((prev) =>
      prev.includes(donorId)
        ? prev.filter((id) => id !== donorId)
        : [...prev, donorId]
    );
  };

  // Hàm xử lý nút Add (sau này call API)
  const handleAddDonor = (donor) => {
    // TODO: call API add donor vào yêu cầu
    alert(`Thêm ${donor.User_Name} vào yêu cầu!`);
  };

  // Hàm gửi email (sau này call API)
  const handleSendEmail = async () => {
    if (checkedDonors.length === 0) {
      alert("Vui lòng chọn ít nhất một người để gửi email!");
      return;
    }
    for (const donorId of checkedDonors) {
      const donor = potentialList.find(d => d.User_ID === donorId);
      if (donor) {
        try {
          await sendEmergencyEmail(donor.email, donor.userName);
        } catch (err) {
          console.error(`Gửi email thất bại cho ${donor.userName}`, err);
        }
      }
    }
    alert("Đã gửi email cho các người được chọn!");
    setShowPotentialPopup(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-red-600 mb-6">
        Quản lý yêu cầu máu khẩn cấp
      </h1>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 items-end mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Nhóm máu (kèm Rh)
          </label>
          <select
            value={
              filter.bloodGroup && filter.rhNeeded
                ? `${filter.bloodGroup}${filter.rhNeeded}`
                : ""
            }
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") {
                setFilter({ ...filter, bloodGroup: "", rhNeeded: "" });
              } else {
                const group = val.replace(/[+-]/, "");
                const rh = val.endsWith("+") ? "+" : "-";
                setFilter({ ...filter, bloodGroup: group, rhNeeded: rh });
              }
            }}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Tất cả</option>
            {BLOOD_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Trạng thái</label>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Tất cả</option>
            <option value="PENDING">Chờ xử lý</option>
            <option value="CONTACTED">Đã liên hệ</option>
            <option value="RESOLVED">Đã giải quyết</option>
          </select>
        </div>
        <button
          className="ml-auto bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm"
        >
          Xem ngân hàng máu
        </button>
      </div>

      {/* REQUEST TABLE */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">Tên</th>
              {/* con mắt hiện popup xem thông tin người yêu cầu*/}
              <th className="px-4 py-3">Nhóm máu cần</th>
              <th className="px-4 py-3">Lượng máu cần (ml)</th>
              <th className="px-4 py-3">Cần khi nào</th>
              <th className="px-4 py-3">Độ ưu tiên</th>
              <th className="px-4 py-3">Nguồn cung cấp</th>
              <th className="px-4 py-3">Người ưu tiên</th>
              <th className="px-4 py-3">Địa điểm hiến máu</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center p-6 text-gray-500">
                  {loading
                    ? "Đang tải dữ liệu..."
                    : "Không có yêu cầu phù hợp."}
                </td>
              </tr>
            )}
            {requests.map((req, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="border-b last:border-0"
              >
                <td className="px-4 py-3 flex items-center justify-between gap-2">
                  {req.User_Name}
                  <button
                    className="ml-auto text-blue-600 hover:text-blue-800"
                    title="Xem thông tin người yêu cầu"
                    onClick={() => handleViewRequester(req)}
                  >
                    <i className="fa fa-eye" />
                  </button>
                </td>
                <td className="px-4 py-3">{req.BloodType}</td>
                <td className="px-4 py-3">{req.Volume}</td>
                <td className="px-4 py-3">
                  {req.Needed_Before
                    ? new Date(req.Needed_Before).toLocaleDateString("vi-VN")
                    : "—"}
                </td>
                <td className="px-4 py-3">{req.Priority ?? "—"}</td>
                <td className="px-4 py-3">{req.sourceType ?? "—"}</td>
                <td className="px-4 py-3">
                  {req.Donor_ID
                    ? (
                      <button
                        className="px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white text-xs"
                        onClick={() => handleViewDonor(req)}
                      >
                        Xem hồ sơ
                      </button>
                    )
                    : (
                      <button
                        className="px-3 py-1 rounded bg-purple-500 hover:bg-purple-600 text-white text-xs"
                        onClick={() => handleShowPotentialList(req.Emergency_ID)}
                      >
                        Danh sách ưu tiên
                      </button>
                    )
                  }
                </td>
                <td className="px-4 py-3">{req.Place ?? "—"}</td>
                <td className="px-4 py-3">{req.Status}</td>
                <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                  {req.Status === "Pending" && (
                    <button
                      onClick={() => handleStatusChange(req.Potential_ID, "CONTACTED")}
                      className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white text-xs"
                    >
                      Đã liên hệ
                    </button>
                  )}
                  {req.Status !== "Completed" && (
                    <button
                      onClick={() => handleStatusChange(req.Potential_ID, "Completed")}
                      className="px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white text-xs"
                    >
                      Đã giải quyết
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup hiển thị profile */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedProfile(null)}
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-4">Thông tin hồ sơ</h2>
            {selectedProfile.error ? (
              <div className="text-red-500">{selectedProfile.error}</div>
            ) : (
              <div className="space-y-2">
                <div><b>Tên:</b> {selectedProfile.User_Name}</div>
                <div><b>Địa chỉ:</b> {selectedProfile.Full_Address ?? "—"}</div>
                <div><b>Số điện thoại:</b> {selectedProfile.Phone ?? "—"}</div>
                <div><b>Email:</b> {selectedProfile.Email ?? "—"}</div>
                <div><b>Giới tính:</b>  {selectedProfile.Gender === "M"
                  ? "Nam"
                  : selectedProfile.Gender === "F"
                    ? "Nữ"
                    : "—"}</div>
                <div><b>Năm sinh:</b> {selectedProfile.Date_Of_Birth ?? "—"}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Popup danh sách ưu tiên */}
      {showPotentialPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 min-w-[600px] max-w-4xl w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPotentialPopup(false)}
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-4">Danh sách người ưu tiên</h2>
            <table className="min-w-full text-sm mb-4">
              <thead>
                <tr>
                  <th></th>
                  <th>Tên</th>
                  <th>Nhóm máu</th>
                  <th>Địa chỉ</th>
                  <th>Email</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {potentialList.map((donor) => (
                  <tr key={donor.User_ID}>
                    <td>
                      <input
                        type="checkbox"
                        checked={checkedDonors.includes(donor.User_ID)}
                        onChange={() => handleCheckDonor(donor.User_ID)}
                      />
                    </td>
                    <td>{donor.userName}</td>
                    <td>{donor.bloodType}</td>
                    <td>{donor.address}</td>
                    <td>{donor.email}</td>
                    <td>
                      <button
                        className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                        onClick={() => handleAddDonor(donor)}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              onClick={handleSendEmail}
            >
              Send Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
