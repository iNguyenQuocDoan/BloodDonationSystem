import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { motion } from "framer-motion";

const bloodTypes = ["O", "A", "B", "AB"];
const canDonateTo = {
  O: ["O", "A", "B", "AB"],
  A: ["A", "AB"],
  B: ["B", "AB"],
  AB: ["AB"],
};
const descriptions = {
  O: "Nhóm O có thể hiến hồng cầu cho bất kỳ nhóm máu nào. Đó là nhóm hiến toàn cầu.",
  A: "Nhóm A có thể hiến hồng cầu cho nhóm A và nhóm AB.",
  B: "Nhóm B có thể hiến hồng cầu cho nhóm B và nhóm AB.",
  AB: "Nhóm AB chỉ có thể hiến cho nhóm AB nhưng có thể nhận từ tất cả các nhóm khác.",
};

export default function BloodCompatibilityDiagram() {
  const [active, setActive] = useState(null);
  const [paths, setPaths] = useState([]);
  const containerRef = useRef(null);
  const donorRefs = useRef([]);
  const recRefs = useRef([]);
  const [resizeTrigger, setResizeTrigger] = useState(0);

  /* ---------- Helpers ------------------------------------------------ */
  const highlightDonor = (dType) =>
    active &&
    ((active.role === "donor" && dType === active.type) ||
      (active.role === "recipient" &&
        canDonateTo[dType].includes(active.type)));

  const highlightRecipient = (rType) =>
    active &&
    ((active.role === "recipient" && rType === active.type) ||
      (active.role === "donor" && canDonateTo[active.type].includes(rType)));

  const donorDrainPercent = (dType) =>
    active && active.role === "donor" && active.type === dType
      ? (canDonateTo[dType].length / bloodTypes.length) * 100
      : 0;

  /* ---------- Draw bézier paths ------------------------------------- */
  const calculatePaths = () => {
    const cont = containerRef.current;
    if (!cont) return;
    const { left: cLeft, top: cTop } = cont.getBoundingClientRect();
    const newPaths = [];

    bloodTypes.forEach((dType, i) => {
      const dEl = donorRefs.current[i];
      if (!dEl) return;
      const dRect = dEl.getBoundingClientRect();
      const x1 = dRect.left + dRect.width / 2 - cLeft;
      const y1 = dRect.top + dRect.height - cTop;

      canDonateTo[dType].forEach((rType) => {
        const j = bloodTypes.indexOf(rType);
        const rEl = recRefs.current[j];
        if (!rEl) return;
        const rRect = rEl.getBoundingClientRect();
        const x2 = rRect.left + rRect.width / 2 - cLeft;
        const y2 = rRect.top - cTop;

        const dx = x2 - x1;
        const offsetX = Math.sign(dx) * Math.min(Math.abs(dx) * 0.3, 100);
        const cy = (y1 + y2) / 2 - 50;

        const isActive =
          active &&
          ((active.role === "donor" && active.type === dType) ||
            (active.role === "recipient" && active.type === rType));

        newPaths.push({
          d: `M${x1},${y1} C${x1 + offsetX},${cy} ${
            x2 - offsetX
          },${cy} ${x2},${y2}`,
          active: isActive,
        });
      });
    });

    setPaths(newPaths);
  };

  useLayoutEffect(calculatePaths, [active, resizeTrigger]);
  useEffect(() => {
    const onResize = () => setResizeTrigger(Date.now());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ---------- UI ----------------------------------------------------- */
  return (
    <>
      {/* Chú thích hướng dẫn */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full text-center mb-4 px-2"
      >
        <span className="text-gray-700 text-sm sm:text-base md:text-lg font-medium">
          “Chọn nhóm máu để xem bạn có thể hiến cho nhóm nào và nhận từ nhóm
          nào.”
        </span>
      </motion.div>

      {/* Khung sơ đồ */}
      <div
        ref={containerRef}
        className="relative w-full h-[300px] sm:h-[340px] md:h-[400px] lg:h-[460px] bg-gray-50 px-1 sm:px-4"
      >
        {/* Donor row */}
        <div className="absolute top-3 left-0 right-0 flex items-center z-10 px-1">
          <div className="hidden sm:flex items-center justify-end w-35">
            <span className="text-black font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap">
              NHÓM MÁU CHO
            </span>
          </div>
          <div className="flex-1 flex justify-around gap-x-1 sm:gap-x-3">
            {bloodTypes.map((type, i) => {
              const isDonor = highlightDonor(type);
              const drain = donorDrainPercent(type);
              return (
                <motion.div
                  key={type}
                  ref={(el) => (donorRefs.current[i] = el)}
                  onClick={() =>
                    setActive((prev) =>
                      prev?.type === type && prev.role === "donor"
                        ? null
                        : { type, role: "donor" }
                    )
                  }
                  className="cursor-pointer z-10"
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative w-12 h-16 sm:w-14 sm:h-20 border rounded-lg shadow-md overflow-hidden bg-white">
                    <motion.div
                      className="absolute bottom-0 left-0 w-full bg-red-500"
                      initial={{ height: "100%" }}
                      animate={{ height: isDonor ? `${100 - drain}%` : "100%" }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                    <div className="relative flex items-center justify-center h-full">
                      <span
                        className={`font-bold text-base sm:text-lg ${
                          isDonor ? "text-black" : "text-gray-700"
                        }`}
                      >
                        {type}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recipient row */}
        <div className="absolute bottom-3 left-0 right-0 flex items-center z-10 px-1">
          <div className="hidden sm:flex items-center justify-end w-35">
            <span className="text-black font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap">
              NHÓM MÁU NHẬN
            </span>
          </div>
          <div className="flex-1 flex justify-around gap-x-1 sm:gap-x-3">
            {bloodTypes.map((type, i) => {
              const isRec = highlightRecipient(type);
              return (
                <div
                  key={type}
                  ref={(el) => (recRefs.current[i] = el)}
                  className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 overflow-hidden border rounded-full bg-white select-none"
                >
                  <motion.div
                    className="absolute bottom-0 left-0 w-full bg-red-500"
                    initial={{ height: 0 }}
                    animate={{ height: isRec ? "100%" : "0%" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                  <div className="relative flex items-center justify-center h-full">
                    <span
                      className={`font-bold text-xs sm:text-sm ${
                        isRec ? "text-white" : "text-gray-600"
                      }`}
                    >
                      {type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bézier connections + animation */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {paths.map((p, i) => (
            <motion.path
              key={`path-${i}`}
              d={p.d}
              stroke={p.active ? "#EF4444" : "#D1D5DB"}
              strokeWidth={p.active ? 3 : 1.5}
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: p.active ? 1 : 0.2 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          ))}
          {active?.role === "donor" &&
            paths.map(
              (p, i) =>
                p.active && (
                  <motion.circle
                    key={`drop-donor-${active.type}-${i}`}
                    r={4}
                    fill="#EF4444"
                    style={{
                      offsetPath: `path('${p.d}')`,
                      offsetRotate: "auto",
                    }}
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    transition={{ duration: 1.2, ease: "easeInOut", repeat: 0 }}
                  />
                )
            )}
          {active?.role === "recipient" &&
            paths.map(
              (p, i) =>
                p.active && (
                  <motion.circle
                    key={`drop-recipient-${active.type}-${i}`}
                    r={4}
                    fill="#EF4444"
                    style={{
                      offsetPath: `path('${p.d}')`,
                      offsetRotate: "auto",
                    }}
                    initial={{ offsetDistance: "100%" }}
                    animate={{ offsetDistance: "0%" }}
                    transition={{ duration: 1.2, ease: "easeInOut", repeat: 0 }}
                  />
                )
            )}
        </svg>

        {/* Mô tả nhóm máu */}
        {active && (
          <div
            className="absolute left-0 right-0 bottom-1 px-2"
            style={{ transform: "translateY(32px)" }}
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center text-gray-600 text-sm sm:text-base md:text-lg"
            >
              {descriptions[active.type]}
            </motion.p>
          </div>
        )}
      </div>
    </>
  );
}
