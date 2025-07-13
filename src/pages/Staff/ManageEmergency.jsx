import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useApi from "../../hooks/useApi";

/**
 * Staff ► EmergencyRequestManagement
 * ------------------------------------------------------------
 *  # | Ngày tạo | Người yêu cầu | Nhóm máu cần (A+/O-) | Lượng máu (ml) | Trạng thái | Hành động
 */
const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export default function ManageEmergencyPage() {
  const { loading, getEmergencyRequests, updateEmergencyRequest } = useApi();

  // filter giữ riêng bloodGroup & rhNeeded để backend dễ lọc
  const [filter, setFilter] = useState({
    bloodGroup: "", // A / B / O / AB
    rhNeeded: "", // + / -
    status: "PENDING",
  });
  const [requests, setRequests] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  /* ─────────────── FETCH DATA ─────────────── */
  useEffect(() => {
    (async () => {
      try {
        // Loại bỏ khóa rỗng trước khi gửi
        const queryFilter = Object.fromEntries(
          Object.entries(filter).filter(([, v]) => v !== "")
        );
        const res = await getEmergencyRequests(queryFilter);
        setRequests(res || []);
      } catch (err) {
        console.error("Failed to fetch emergency requests", err);
      }
    })();
  }, [filter, refreshKey]);

  /* ─────────────── ACTIONS ─────────────── */
  const handleStatusChange = async (id, nextStatus) => {
    try {
      await updateEmergencyRequest(id, { status: nextStatus });
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  /* ─────────────── UI ─────────────── */
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-red-600 mb-6">
        Quản lý yêu cầu máu khẩn cấp
      </h1>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 items-end mb-6">
        {/* Dropdown Nhóm máu + Rh */}
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

        {/* Dropdown Trạng thái */}
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

        {/* Button refresh */}
        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="ml-auto bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm"
          disabled={loading}
        >
          {loading ? "Đang tải..." : "Làm mới"}
        </button>
      </div>

      {/* REQUEST TABLE */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Ngày tạo</th>
              <th className="px-4 py-3">Người yêu cầu</th>
              <th className="px-4 py-3">Nhóm máu cần</th>
              <th className="px-4 py-3">Lượng máu&nbsp;(ml)</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-6 text-gray-500">
                  {loading
                    ? "Đang tải dữ liệu..."
                    : "Không có yêu cầu phù hợp."}
                </td>
              </tr>
            )}

            {requests.map((req, idx) => {
              const bloodLabel = `${req.bloodGroup}${req.rhNeeded || ""}`; // A+, O-, …
              return (
                <motion.tr
                  key={req.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="border-b last:border-0"
                >
                  <td className="px-4 py-3 whitespace-nowrap">{idx + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(req.createdAt).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-4 py-3">{req.requesterName}</td>
                  <td className="px-4 py-3 font-semibold text-red-600">
                    {bloodLabel}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {req.volumeNeeded ?? req.units}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        {
                          PENDING: "text-yellow-600",
                          CONTACTED: "text-blue-600",
                          RESOLVED: "text-green-600",
                        }[req.status]
                      }
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    {req.status === "PENDING" && (
                      <button
                        onClick={() => handleStatusChange(req.id, "CONTACTED")}
                        className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white text-xs"
                      >
                        Đã liên hệ
                      </button>
                    )}
                    {req.status !== "RESOLVED" && (
                      <button
                        onClick={() => handleStatusChange(req.id, "RESOLVED")}
                        className="px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white text-xs"
                      >
                        Đã giải quyết
                      </button>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
