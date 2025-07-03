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

/*******************************************************
 * StaffStatsReport – Trang "Báo cáo thống kê"
 * -----------------------------------------------------
 * 1. Thống kê nhanh (cards)
 * 2. Biểu đồ xu hướng số ca hiến (Line)
 * 3. Phân bố nhóm máu trong kho (Pie)
 * 4. Hiến máu theo địa điểm (Bar)
 *******************************************************/

/* Đăng ký thành phần Chart.js chỉ 1 lần cho toàn app */
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
    getSummaryStats, // ➜ { todayCollected, todayDonations, totalStock, urgentRequests }
    getDailyDonations, // ➜ [{ date: "2025-07-01", count: 12 }, ...]
    getStockByGroup, // ➜ [{ group: "A", units: 150 }, ...]
    getDonationsByLocation, // ➜ [{ site: "BV Bạch Mai", count: 40 }, ...]
  } = useApi();

  /* ─────────────── STATE ─────────────── */
  const [summary, setSummary] = useState(null);
  const [daily, setDaily] = useState([]);
  const [stock, setStock] = useState([]);
  const [bySite, setBySite] = useState([]);

  /* ─────────────── FETCH ─────────────── */
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

  /* ─────────────── DATASET BUILDERS ─────────────── */
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

  /* ─────────────── UI ─────────────── */
  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-red-600 mb-8">Báo cáo thống kê</h1>

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
    </div>
  );
}
