import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Pie, Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import useApi from "../../hooks/useApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/*******************************************************
 * StaffStatsReport – Trang "Báo cáo thống kê"
 *******************************************************/

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const {
    loading,
    getSummaryStats,
    getDailyDonations,
    getStockByGroup,
    getDonationsByLocation,
    createReport,
    getLatestReport,
    updateReport,
  } = useApi();

  // State cho thống kê
  const [summary, setSummary] = useState(null);
  const [daily, setDaily] = useState([]);
  const [stock, setStock] = useState([]);
  const [bySite, setBySite] = useState([]);

  // State cho popup modal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
  const [modalData, setModalData] = useState({
    title: "",
    description: "",
    volumeIn: "",
    volumeOut: "",
    note: "",
    summaryBloodId: "",
    reportDetailId: "",
  });
  const [modalError, setModalError] = useState("");
  const [modalConfirm, setModalConfirm] = useState(false);

  // Fetch thống kê
  useEffect(() => {
    (async () => {
      try {
        const [s, d, st, site] = await Promise.all([
          getSummaryStats(),
          getDailyDonations(30),
          getStockByGroup(),
          getDonationsByLocation(),
        ]);
        setSummary(s);
        setDaily(d);
        setStock(st);
        setBySite(site);
      } catch (err) {
        console.error("Load stats failed", err);
      }
    })();
  }, []);

  // Mở popup tạo báo cáo
  const openCreateModal = () => {
    setModalMode("create");
    setModalData({
      title: "",
      description: "",
      volumeIn: "",
      volumeOut: "",
      note: "",
      summaryBloodId: "",
      reportDetailId: "",
    });
    setModalError("");
    setModalConfirm(false);
    setShowModal(true);
  };

  // Mở popup chỉnh sửa báo cáo
  const openEditModal = async () => {
    try {
      const reportRes = await getLatestReport();
      const data = reportRes.data || {};
      const detail = (data.Details && data.Details[0]) || {};
      setModalMode("edit");
      setModalData({
        title: data.Title || "",
        description: data.Description || "",
        volumeIn: detail.VolumeIn || "",
        volumeOut: detail.VolumeOut || "",
        note: detail.Note || "",
        summaryBloodId: data.SummaryBlood_ID,
        reportDetailId: detail.Report_Detail_ID,
      });
      setModalError("");
      setModalConfirm(false);
      setShowModal(true);
    } catch (err) {
      toast.error("Không thể lấy báo cáo: " + (err.message || ""));
    }
  };

  // Validate và xác nhận lưu/tạo báo cáo
  const handleModalSubmit = async () => {
    const { title, description, volumeIn, volumeOut, note } = modalData;
    // Validate
    if (!title || !description || !note) {
      setModalError("Vui lòng nhập đầy đủ tiêu đề, mô tả và ghi chú!");
      return;
    }
    if (volumeIn && (isNaN(volumeIn) || Number(volumeIn) <= 0)) {
      setModalError("Lượng máu nhận phải là số > 0!");
      return;
    }
    if (volumeOut && (isNaN(volumeOut) || Number(volumeOut) <= 0)) {
      setModalError("Lượng máu sử dụng phải là số > 0!");
      return;
    }
    setModalError("");
    setModalConfirm(true); // Hiện popup xác nhận
  };

  // Xác nhận lưu/tạo báo cáo
  const handleModalConfirm = async () => {
    const { title, description, volumeIn, volumeOut, note, summaryBloodId, reportDetailId } = modalData;
    const payload = {
      title,
      description,
      details: [
        {
          volumeIn: volumeIn ? Number(volumeIn) : undefined,
          volumeOut: volumeOut ? Number(volumeOut) : undefined,
          note,
        },
      ],
    };

    // Kiểm tra thay đổi chỉ khi cập nhật
    if (modalMode === "edit") {
      const reportRes = await getLatestReport();
      const data = reportRes.data || {};
      const detail = (data.Details && data.Details[0]) || {};

      const isSame =
        (title === (data.Title || "")) &&
        (description === (data.Description || "")) &&
        (note === (detail.Note || "")) &&
        (String(volumeIn) === String(detail.VolumeIn || "")) &&
        (String(volumeOut) === String(detail.VolumeOut || ""));

      if (isSame) {
        setModalError("Bạn cần thay đổi ít nhất 1 trường!");
        setModalConfirm(false);
        return;
      }
    }

    try {
      if (modalMode === "create") {
        await createReport(payload);
        toast.success("Đã tạo báo cáo!");
      } else {
        await updateReport(summaryBloodId, reportDetailId, payload);
        toast.success("Đã cập nhật báo cáo!");
      }
      setShowModal(false);
      setModalConfirm(false);
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra!");
      setModalConfirm(false);
    }
  };

  // Dataset builders
  const lineData = {
    labels: daily.map((d) =>
      new Date(d.date).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      })
    ),
    datasets: [
      {
        label: "Số ca hiến",
        data: daily.map((d) => d.count),
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const pieData = {
    labels: stock.map((s) => s.group),
    datasets: [
      {
        data: stock.map((s) => s.units),
        backgroundColor: [
          "#EF4444",
          "#F87171",
          "#FDBA74",
          "#FCD34D",
          "#34D399",
        ],
      },
    ],
  };

  const barData = {
    labels: bySite.map((s) => s.site),
    datasets: [
      {
        label: "Số ca hiến",
        data: bySite.map((s) => s.count),
      },
    ],
  };

  // UI
  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-red-600 mb-8">Báo cáo thống kê</h1>

      {/* Nút tạo/chỉnh sửa báo cáo */}
      <div className="flex gap-4 mb-8">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
          onClick={openCreateModal}
        >
          Tạo báo cáo
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded font-semibold"
          onClick={openEditModal}
        >
          Chỉnh sửa báo cáo
        </button>
      </div>

      {/* Modal popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-[480px] max-w-full shadow-lg relative">
            <h2 className="text-xl font-bold mb-4 text-center">
              {modalMode === "create" ? "Tạo báo cáo mới" : "Chỉnh sửa báo cáo"}
            </h2>
            <form className="flex flex-col gap-3">
              <label className="font-semibold text-gray-700">
                Tiêu đề báo cáo
                <input
                  className="border rounded px-3 py-2 mt-1 w-full"
                  placeholder="Tiêu đề báo cáo"
                  value={modalData.title}
                  onChange={e => setModalData({ ...modalData, title: e.target.value })}
                />
              </label>
              <label className="font-semibold text-gray-700">
                Mô tả
                <textarea
                  className="border rounded px-3 py-2 mt-1 w-full"
                  placeholder="Mô tả"
                  value={modalData.description}
                  onChange={e => setModalData({ ...modalData, description: e.target.value })}
                />
              </label>
              <label className="font-semibold text-gray-700">
                Lượng máu nhận (ml)
                <input
                  className="border rounded px-3 py-2 mt-1 w-full"
                  type="number"
                  placeholder="Lượng máu nhận (ml)"
                  value={modalData.volumeIn}
                  onChange={e => setModalData({ ...modalData, volumeIn: e.target.value })}
                />
              </label>
              <label className="font-semibold text-gray-700">
                Lượng máu sử dụng (ml)
                <input
                  className="border rounded px-3 py-2 mt-1 w-full"
                  type="number"
                  placeholder="Lượng máu sử dụng (ml)"
                  value={modalData.volumeOut}
                  onChange={e => setModalData({ ...modalData, volumeOut: e.target.value })}
                />
              </label>
              <label className="font-semibold text-gray-700">
                Ghi chú
                <input
                  className="border rounded px-3 py-2 mt-1 w-full"
                  placeholder="Ghi chú"
                  value={modalData.note}
                  onChange={e => setModalData({ ...modalData, note: e.target.value })}
                />
              </label>
              {modalError && <div className="text-red-600 text-sm">{modalError}</div>}
            </form>
            <div className="flex gap-3 mt-6 justify-center">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded font-semibold"
                onClick={handleModalSubmit}
              >
                {modalMode === "create" ? "Tạo báo cáo" : "Lưu chỉnh sửa"}
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded font-semibold"
                onClick={() => setShowModal(false)}
              >
                Hủy
              </button>
            </div>
            {/* Popup xác nhận */}
            {modalConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-60">
                <div className="bg-white rounded-lg p-6 w-[340px] shadow-lg flex flex-col items-center">
                  <div className="text-lg font-semibold mb-4">
                    {modalMode === "create"
                      ? "Bạn chắc chắn muốn tạo báo cáo này?"
                      : "Bạn chắc chắn muốn lưu chỉnh sửa báo cáo này?"}
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded font-semibold"
                      onClick={handleModalConfirm}
                    >
                      Đồng ý
                    </button>
                    <button
                      className="bg-gray-400 text-white px-4 py-2 rounded font-semibold"
                      onClick={() => setModalConfirm(false)}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUMMARY CARDS */}
      {summary ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Đơn vị thu hôm nay", value: summary.todayCollected },
            { label: "Tổng ca hiến trong ngày", value: summary.todayDonations },
            { label: "Tổng kho máu", value: summary.totalStock },
            { label: "Yêu cầu khẩn cấp", value: summary.urgentRequests },
          ].map((c, idx) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white shadow rounded-lg p-4 flex flex-col"
            >
              <span className="text-sm text-gray-500 mb-1">{c.label}</span>
              <span className="text-xl font-bold text-gray-800">{c.value}</span>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-10">Đang tải thống kê...</p>
      )}

      {/* CHARTS GRID */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Donation Trend */}
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-lg font-semibold mb-4">
            Xu hướng hiến máu (30 ngày)
          </h2>
          {daily.length ? (
            <Line data={lineData} />
          ) : (
            <p className="text-gray-500">Không có dữ liệu</p>
          )}
        </div>

        {/* Stock Distribution */}
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-lg font-semibold mb-4">
            Phân bố nhóm máu trong kho
          </h2>
          {stock.length ? (
            <Pie data={pieData} />
          ) : (
            <p className="text-gray-500">Không có dữ liệu</p>
          )}
        </div>

        {/* By Location */}
        <div className="bg-white p-6 shadow rounded-lg lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Ca hiến theo địa điểm</h2>
          {bySite.length ? (
            <Bar data={barData} options={{ indexAxis: "y" }} />
          ) : (
            <p className="text-gray-500">Không có dữ liệu</p>
          )}
        </div>
      </div>
      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
}
