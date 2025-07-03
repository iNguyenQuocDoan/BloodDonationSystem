import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useApi from "../../hooks/useApi";

/**
 * Staff ► EmergencyRequestManagement
 * ------------------------------------------------------------
 *  • Hiển thị danh sách yêu cầu máu khẩn cấp (paginated)
 *  • Cho phép filter theo nhóm máu / trạng thái
 *  • Hành động: Xác nhận đã liên hệ, Đã giải quyết
 * ------------------------------------------------------------
 *  API hook (useApi) cần hỗ trợ:
 *   - getEmergencyRequests(filter?)
 *   - updateEmergencyRequest(id, { status })
 */
export default function ManageEmergencyPage() {
  const { loading, getEmergencyRequests, updateEmergencyRequest } = useApi();

  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState({ bloodGroup: "", status: "PENDING" });
  const [refreshKey, setRefreshKey] = useState(0); // trigger refetch

  /* ─────────────────────── FETCH DATA ─────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await getEmergencyRequests(filter);
        setRequests(res || []);
      } catch (err) {
        console.error("Failed to fetch emergency requests", err);
      }
    })();
  }, [filter, refreshKey]);

  /* ─────────────────────── ACTIONS ─────────────────────── */
  const handleStatusChange = async (id, nextStatus) => {
    try {
      await updateEmergencyRequest(id, { status: nextStatus });
      setRefreshKey((k) => k + 1); // refetch
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  /* ─────────────────────── UI ─────────────────────── */
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-red-600 mb-6">
        Quản lý yêu cầu máu khẩn cấp
      </h1>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 items-end mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Nhóm máu</label>
          <select
            value={filter.bloodGroup}
            onChange={(e) =>
              setFilter({ ...filter, bloodGroup: e.target.value })
            }
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Tất cả</option>
            {["O", "A", "B", "AB"].map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
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
              <th className="px-4 py-3">Nhóm máu</th>
              <th className="px-4 py-3">Số lượng (đv)</th>
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
            {requests.map((req, idx) => (
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
                  {req.bloodGroup}
                </td>
                <td className="px-4 py-3 text-center">{req.units}</td>
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
                <td className="px-4 py-3 text-right space-x-2">
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
