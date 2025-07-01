import React, { useState } from "react";
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

/* Đăng ký các thành phần Chart.js */
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

/* ==================== DỮ LIỆU DEMO ==================== */
const demoStats = [
  { label: "Đơn vị thu hôm nay", value: 42 },
  { label: "Tổng ca hiến trong ngày", value: 5 },
  { label: "Người hiến mới / tuần", value: 23 },
  { label: "Yêu cầu khẩn cấp", value: 3 },
  { label: "Tổng kho máu (đv)", value: 560 },
];

const demoLine = [
  { month: "Th1", units: 260 },
  { month: "Th2", units: 310 },
  { month: "Th3", units: 180 },
  { month: "Th4", units: 330 },
  { month: "Th5", units: 420 },
  { month: "Th6", units: 390 },
  { month: "Th7", units: 480 },
];

const demoPie = [
  { name: "A", value: 180 },
  { name: "B", value: 140 },
  { name: "O", value: 160 },
  { name: "AB", value: 80 },
];

/* Histogram: tổng người hiến mỗi tháng */
const demoHist = [
  { month: "Th1", donors: 35 },
  { month: "Th2", donors: 41 },
  { month: "Th3", donors: 28 },
  { month: "Th4", donors: 47 },
  { month: "Th5", donors: 54 },
  { month: "Th6", donors: 46 },
  { month: "Th7", donors: 60 },
];

const COLORS = ["#F72585", "#FF8A00", "#FF6B6B", "#FFC300"];

const AdminDashboard = () => {
  const [stats] = useState(demoStats);
  const [lineData] = useState(demoLine);
  const [pieData] = useState(demoPie);
  const [histData] = useState(demoHist);

  /* ---------- Line chart ---------- */
  const lineChartData = {
    labels: lineData.map((d) => d.month),
    datasets: [
      {
        label: "Đơn vị máu",
        data: lineData.map((d) => d.units),
        borderWidth: 3,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };
  const lineOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

  /* ---------- Pie chart ---------- */
  const pieChartData = {
    labels: pieData.map((p) => p.name),
    datasets: [
      {
        data: pieData.map((p) => p.value),
        backgroundColor: COLORS,
        hoverOffset: 6,
      },
    ],
  };
  const pieOptions = {
    responsive: true,
    plugins: { legend: { position: "bottom" } },
  };

  /* ---------- Histogram (Bar) ---------- */
  const barChartData = {
    labels: histData.map((h) => h.month),
    datasets: [
      {
        label: "Người hiến",
        data: histData.map((h) => h.donors),
        backgroundColor: "#3B82F6", // tailwind blue-500
      },
    ],
  };
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false, // cần để lấp đầy khung cố định cao
    plugins: { legend: { position: "bottom" } },
    scales: { y: { beginAtZero: true } },
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* ===== THỐNG KÊ NHANH ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-lg bg-white shadow flex flex-col items-center py-6"
          >
            <span className="text-sm font-medium text-gray-600 text-center px-2">
              {s.label}
            </span>
            <p className="mt-2 text-3xl font-bold text-red-600">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ===== 2 BIỂU ĐỒ ĐẦU ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line chart */}
        <div className="rounded-lg bg-white shadow p-4">
          <h3 className="text-center font-semibold mb-4">
            Lượng máu thu theo tháng
          </h3>
          <Line data={lineChartData} options={lineOptions} height={300} />
        </div>

        {/* Pie chart + số lượng còn lại */}
        <div className="rounded-lg bg-white shadow p-4">
          <h3 className="text-center font-semibold mb-4">
            Tồn kho theo nhóm máu
          </h3>
          <Pie data={pieChartData} options={pieOptions} height={300} />
          {/* Số đơn vị còn lại */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {pieData.map((p, idx) => (
              <p
                key={p.name}
                className="flex items-center justify-center text-gray-700"
              >
                <span
                  className="inline-block w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                {p.name}: <span className="font-semibold">{p.value}</span> đv
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* ===== HISTOGRAM ===== */}
      <div className="rounded-lg bg-white shadow p-4 mt-6">
        <h3 className="text-center font-semibold mb-4">
          Tổng số người hiến theo tháng
        </h3>
        {/* Khung cao 64 (≈256 px) */}
        <div className="h-64">
          <Bar data={barChartData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
