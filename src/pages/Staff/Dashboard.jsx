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

const bloodTypeMapping = {
  "A+": "BT001", "A-": "BT002", "B+": "BT003", "B-": "BT004",
  "AB+": "BT005", "AB-": "BT006", "O+": "BT007", "O-": "BT008"
};
const bloodTypeList = Object.keys(bloodTypeMapping);

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
    getAllBloodUnit,
    createBloodUnit,
    updateBloodUnit,
  } = useApi();

  // State cho thống kê
  const [summary, setSummary] = useState(null);
  const [daily, setDaily] = useState([]);
  const [stock, setStock] = useState([]);
  const [bySite, setBySite] = useState([]);

  // State cho popup modal báo cáo
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

  // State cho popup quản lý lô máu
  const [showBloodUnitModal, setShowBloodUnitModal] = useState(false);
  const [bloodUnits, setBloodUnits] = useState([]);
  const [showCreateBloodUnit, setShowCreateBloodUnit] = useState(false);
  const [newBloodUnit, setNewBloodUnit] = useState({ BloodType: "", Volume: "", Expiration_Date: "" });
  const [editBloodUnit, setEditBloodUnit] = useState(null);

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

  // Quản lý lô máu
  const fetchBloodUnits = async () => {
    try {
      const res = await getAllBloodUnit();
      setBloodUnits(res.data || []);
    } catch (err) {
      toast.error(err?.message || "Không lấy được danh sách lô máu!");
    }
  };

  const handleShowBloodUnits = async () => {
    await fetchBloodUnits();
    setShowBloodUnitModal(true);
  };

  const handleCreateBloodUnit = async () => {
    const { BloodType, Volume, Expiration_Date } = newBloodUnit;
    if (!BloodType || !Volume || !Expiration_Date) {
      toast.error("Vui lòng nhập đủ thông tin!");
      return;
    }
    const BloodType_ID = bloodTypeMapping[BloodType];
    if (!BloodType_ID) {
      toast.error("Nhóm máu không hợp lệ!");
      return;
    }
    try {
      await createBloodUnit(BloodType_ID, Number(Volume), Expiration_Date);
      toast.success("Tạo lô máu thành công!");
      setShowCreateBloodUnit(false);
      setNewBloodUnit({ BloodType: "", Volume: "", Expiration_Date: "" });
      await fetchBloodUnits();
    } catch (err) {
      toast.error(err?.message || "Tạo lô máu thất bại!");
    }
  };

  const handleUpdateBloodUnit = async () => {
    const { BloodUnit_ID, Status, Expiration_Date } = editBloodUnit;
    if (!Status && !Expiration_Date) {
      toast.error("Cần nhập Status hoặc Expiration_Date!");
      return;
    }
    try {
      await updateBloodUnit(BloodUnit_ID, Status, Expiration_Date);
      toast.success("Cập nhật thành công!");
      setEditBloodUnit(null);
      await fetchBloodUnits();
    } catch (err) {
      toast.error(err?.message || "Cập nhật thất bại!");
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
      

        {/* Stock Distribution */}
        <div className="bg-white p-6 shadow rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              Phân bố nhóm máu trong kho
            </h2>
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
              onClick={handleShowBloodUnits}
            >
              Quản lý lô máu
            </button>
          </div>
          {stock.length ? (
            <Pie data={pieData} />
          ) : (
            <p className="text-gray-500">Không có dữ liệu</p>
          )}
        </div>

        {/* By Location */}

      </div>

      {/* Popup quản lý lô máu */}
      {showBloodUnitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[800px] max-w-full relative border-2 border-red-200">
            <div className="flex items-center mb-6 gap-3">
              <i className="fa fa-tint text-red-500 text-2xl" />
              <h2 className="text-2xl font-bold text-red-600 flex-1">Quản lý lô máu</h2>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold shadow"
                onClick={() => setShowCreateBloodUnit(true)}
              >
                + Tạo lô máu mới
              </button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-[700px] w-full text-sm mb-4">
                <thead>
                  <tr className="bg-gradient-to-r from-red-100 to-pink-100 text-red-700">
                    <th className="py-2 px-3">Nhóm máu</th>
                    <th className="py-2 px-3">Lượng máu</th>
                    <th className="py-2 px-3">Ngày thu</th>
                    <th className="py-2 px-3">Hạn dùng</th>
                    <th className="py-2 px-3">Trạng thái</th>
                    <th className="py-2 px-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {bloodUnits.map((item) => (
                    <tr key={item.BloodUnit_ID} className="hover:bg-pink-50 transition">
                      <td className="py-2 px-3">{item.BloodGroup}</td>
                      <td className="py-2 px-3">{item.Volume}</td>
                      <td className="py-2 px-3">{item.Collected_Date?.slice(0,10)}</td>
                      <td className="py-2 px-3">{item.Expiration_Date?.slice(0,10)}</td>
                      <td className="py-2 px-3">
                        <span className={
                          item.Status === "Available" ? "text-green-600 font-semibold" :
                          item.Status === "Expired" ? "text-gray-500 font-semibold" :
                          "text-orange-600 font-semibold"
                        }>
                          {item.Status === "Available" && "Còn sử dụng"}
                          {item.Status === "Expired" && "Hết hạn"}
                          {item.Status === "Used" && "Hết máu"}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <button
                          className="text-blue-600 underline font-semibold"
                          onClick={() => setEditBloodUnit({
                            BloodUnit_ID: item.BloodUnit_ID,
                            Status: item.Status,
                            Expiration_Date: item.Expiration_Date?.slice(0,10) || ""
                          })}
                        >
                          Sửa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold"
                onClick={() => setShowBloodUnitModal(false)}
              >
                Đóng
              </button>
            </div>

            {/* Popup tạo lô máu */}
            {showCreateBloodUnit && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-60">
                <div className="bg-white rounded-xl p-8 w-[350px] shadow-xl relative border-2 border-green-200">
                  <h3 className="font-bold mb-4 text-lg text-green-700">Tạo lô máu mới</h3>
                  <div className="flex flex-col gap-3">
                    <label>
                      Nhóm máu
                      <select
                        className="border rounded px-2 py-1 w-full mt-1"
                        value={newBloodUnit.BloodType}
                        onChange={e => setNewBloodUnit({ ...newBloodUnit, BloodType: e.target.value })}
                      >
                        <option value="">Chọn nhóm máu</option>
                        {bloodTypeList.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Lượng máu (ml)
                      <input
                        className="border rounded px-2 py-1 w-full mt-1"
                        type="number"
                        value={newBloodUnit.Volume}
                        onChange={e => setNewBloodUnit({ ...newBloodUnit, Volume: e.target.value })}
                        placeholder="Nhập lượng máu"
                      />
                    </label>
                    <label>
                      Hạn dùng
                      <input
                        className="border rounded px-2 py-1 w-full mt-1"
                        type="date"
                        value={newBloodUnit.Expiration_Date}
                        onChange={e => setNewBloodUnit({ ...newBloodUnit, Expiration_Date: e.target.value })}
                      />
                    </label>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-3 font-semibold"
                      onClick={handleCreateBloodUnit}
                    >
                      Tạo
                    </button>
                    <button
                      className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold mt-2"
                      onClick={() => setShowCreateBloodUnit(false)}
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Popup sửa lô máu */}
            {editBloodUnit && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-60">
                <div className="bg-white rounded-xl p-8 w-[350px] shadow-xl relative border-2 border-blue-200">
                  <h3 className="font-bold mb-4 text-lg text-blue-700">Cập nhật lô máu</h3>
                  <div className="flex flex-col gap-3">
                    <label>
                      Trạng thái
                      <select
                        className="border rounded px-2 py-1 w-full mt-1"
                        value={editBloodUnit.Status}
                        onChange={e => setEditBloodUnit({ ...editBloodUnit, Status: e.target.value })}
                      >
                        <option value="Available">Còn sử dụng được</option>
                        <option value="Expired">Hết hạn sử dụng</option>
                        <option value="Used">Hết máu</option>
                      </select>
                    </label>
                    <label>
                      Hạn dùng
                      <input
                        className="border rounded px-2 py-1 w-full mt-1"
                        type="date"
                        value={editBloodUnit.Expiration_Date}
                        onChange={e => setEditBloodUnit({ ...editBloodUnit, Expiration_Date: e.target.value })}
                      />
                    </label>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-3 font-semibold"
                      onClick={handleUpdateBloodUnit}
                    >
                      Lưu
                    </button>
                    <button
                      className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold mt-2"
                      onClick={() => setEditBloodUnit(null)}
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
}
