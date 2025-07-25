import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import VanillaTilt from "vanilla-tilt";
import BloodCompatibilityDiagram from "../../components/custom/BloodCompatibilityDiagram";
import DonateBlood from "./DonateBlood";
import { DateFilter } from "../../components/DateFilter";
import { FAQPage } from "./FAQ";
import {
  triggerHapticFeedback,
  playButtonSound,
} from "../../utils/buttonEffects";

// Helper function to check if current path is auth related
const isAuthRoute = (pathname) => {
  const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/profile",
    "/auth/",
  ];
  return authRoutes.some((route) => pathname.includes(route));
};

// ScrollToTopButton Component
const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false); // State để theo dõi chatbot
  const location = useLocation(); // Get current location

  // Kiểm tra xem có phải là trang auth không
  const isAuthPage = isAuthRoute(location.pathname);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollTop = window.pageYOffset;

      if (scrollTop > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    // Lắng nghe custom event từ chatbot
    const handleChatbotToggle = (event) => {
      setChatbotOpen(event.detail.isOpen);
    };

    // Chỉ thêm event listener nếu không phải là trang auth
    if (!isAuthPage) {
      window.addEventListener("scroll", toggleVisibility);
      window.addEventListener("chatbotToggle", handleChatbotToggle);
    }

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      window.removeEventListener("chatbotToggle", handleChatbotToggle);
    };
  }, [isAuthPage]); // Thêm isAuthPage vào dependency array

  const scrollToTop = () => {
    // Thêm hiệu ứng âm thanh và haptic
    triggerHapticFeedback("light");
    playButtonSound();

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Nếu là trang auth hoặc không visible, không hiển thị nút
  if (isAuthPage || !visible || chatbotOpen) {
    return null;
  }

  return (
    <motion.button
      onClick={scrollToTop}
      className={`fixed-button-base scroll-to-top-btn w-12 h-12 bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] text-white rounded-full shadow-lg flex items-center justify-center group z-[1002] 
                md:bottom-[240px] md:right-[15px] 
                max-[480px]:bottom-[200px] max-[480px]:right-[10px]`}
      aria-label="Scroll to top"
      title="Cuộn lên đầu trang"
      style={{ right: "20px" }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        y: [0, -5, 0],
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        scale: { duration: 0.3 },
        opacity: { duration: 0.3 },
        y: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      whileHover={{
        scale: 1.1,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        initial={{ y: 0 }}
        animate={{ y: [-2, 2, -2] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M7 11l5-5m0 0l5 5m-5-5v12"
        />
      </motion.svg>
    </motion.button>
  );
};

const Homepage = () => {
  const [withRh, setWithRh] = useState(false); // State cho bảng
  const [diagramWithRh, setDiagramWithRh] = useState(false); // State cho sơ đồ
  const [showDonation, setShowDonation] = useState(true); // State cho chế độ hiến/nhận (true = hiến, false = nhận)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const bannerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut",
      },
    },
  };

  useEffect(() => {
    // Apply tilt
    const tiltCards = document.querySelectorAll(".tilt-card");
    VanillaTilt.init(tiltCards, {
      max: 15,
      speed: 400,
      glare: true,
      "max-glare": 0.5,
    });

    return () => {
      // Cleanup tilt instances
      tiltCards.forEach((element) => {
        if (element.vanillaTilt) {
          element.vanillaTilt.destroy();
        }
      });
    };
  }, [withRh, diagramWithRh]); // Re-init when states change

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const navigate = useNavigate();

  const handleSearch = () => {
    // Chuyển sang trang DonateBlood với startDate và endDate
    navigate("/donate", {
      state: {
        startDate: startDate,
        endDate: endDate,
        shouldFilter: true, // Flag để tự động filter
      },
    });
  };

  return (
    <motion.div
      className="container mx-auto mt-8 relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          {/* Section 1 */}
          <motion.div
            className="relative bg-[#000000] w-full h-[400px] overflow-hidden rounded-lg"
            variants={bannerVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.img
              src="/image/DonateBloodBanner.jpg"
              alt="DaiVietBlood"
              className="object-cover w-full h-full opacity-35"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-center"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <motion.h1
                  className="font-bold text-white md:text-4xl text-3xl mb-4"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  Một giọt máu cho đi – Thắp sáng hy vọng
                </motion.h1>
                <motion.p
                  className="text-white md:text-lg text-base mt-2"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                >
                  DaiVietBlood kết nối những tấm lòng nhân ái với những người
                  đang cần máu gấp, mở ra một hành trình sẻ chia an toàn, đơn
                  giản và đáng tin cậy.
                </motion.p>
              </motion.div>
            </div>
          </motion.div>

          {/* Statistics & Search */}
          <motion.section variants={itemVariants} className="py-6">
            <motion.p
              className="text-center text-[#D32F2F] py-3 bg-[#FFE6E6] rounded-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              Chúng tôi đã ghi nhận:{" "}
              <motion.strong
                initial={{ color: "#D32F2F" }}
                animate={{ color: ["#D32F2F", "#B71C1C", "#D32F2F"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                hàng nghìn ca hiến máu thành công
              </motion.strong>
            </motion.p>
            <motion.div
              className="mt-8 text-center"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
            >
              <motion.h2
                className="text-3xl font-bold text-[#D32F2F]"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.6, duration: 0.6, type: "spring" }}
              >
                Mỗi giọt máu trao đi – Thắp lên tia hy vọng.
              </motion.h2>
              <motion.p
                className="mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.6 }}
              >
                Chung tay hiến máu – Trao sự sống, gieo hy vọng cho cộng đồng.
              </motion.p>
              <motion.div
                className="flex justify-center mt-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2, duration: 0.6 }}
              >
                <div className="w-full max-w-xl">
                  <DateFilter
                    onSearch={handleSearch}
                    onDateChange={setDateRange}
                    startDate={startDate}
                    endDate={endDate}
                    modernStyle={true}
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.section>

          {/* Stories */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.3,
                },
              },
            }}
          >
            {[...Array(2)].map((_, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover="hover"
                className="mt-12 bg-[#f9f9f9] p-6 rounded-md border-l-4 border-[#D32F2F] shadow-md cursor-pointer"
              >
                <motion.h3
                  className="text-[#D32F2F] text-xl font-semibold mb-4"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  "
                  {idx === 0
                    ? "Nhờ DaiVietBlood, tôi đã nhận được máu loại O khi cần nhất."
                    : "Tôi đã nhanh chóng tìm được người hiến máu phù hợp..."}
                  "
                </motion.h3>
                <motion.p
                  className="text-right font-medium"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  – {idx === 0 ? "Nguyen Cong Minh" : "Chu Phuc Minh Vuong"}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>

          {/* Eligibility */}
          <motion.section variants={itemVariants} className="mt-12">
            <motion.h4
              className="text-center text-3xl font-bold text-[#D32F2F] mb-6"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
            >
              Bạn có đủ điều kiện hiến máu?
            </motion.h4>
            <motion.div
              className="bg-[#E57373] p-6 rounded-lg shadow-md"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.div
                className="grid md:grid-cols-4 grid-cols-2 gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.2,
                    },
                  },
                }}
              >
                {[
                  {
                    title: "Độ tuổi & Cân nặng",
                    lines: ["18–60 tuổi", "Nữ ≥45kg, Nam ≥50kg"],
                  },
                  {
                    title: "Sức khỏe",
                    lines: [
                      "Không bệnh truyền nhiễm",
                      "Không dùng chất kích thích",
                    ],
                  },
                  {
                    title: "Tần suất",
                    lines: ["Nữ: mỗi 3 tháng", "Nam: mỗi 2 tháng"],
                  },
                  {
                    title: "Phụ nữ",
                    lines: ["Không mang thai", "Không trong kỳ kinh nguyệt"],
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { y: 20, opacity: 0, scale: 0.8 },
                      visible: {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        transition: {
                          duration: 0.6,
                          ease: "easeOut",
                        },
                      },
                    }}
                    whileHover={{
                      scale: 1.05,
                      y: -10,
                      rotateY: 10,
                      boxShadow:
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="tilt-card bg-[#D32F2F] text-white p-4 rounded-md cursor-pointer"
                  >
                    <motion.p
                      className="font-semibold mb-2"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {item.title}
                    </motion.p>
                    {item.lines.map((l, j) => (
                      <motion.p
                        key={j}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 + j * 0.1 }}
                      >
                        {l}
                      </motion.p>
                    ))}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.section>

          {/* Compatibility Table */}
          <motion.section variants={itemVariants} className="mt-12">
            <motion.h4
              className="text-center text-3xl font-bold text-[#D32F2F] mb-4"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
            >
              Bảng tương thích nhóm máu
            </motion.h4>

            {/* Nút chuyển chế độ cho bảng */}
            <motion.div
              className="flex justify-center gap-3 mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {/* Nút chế độ hiến/nhận */}
              <motion.div
                className="flex bg-gray-100 rounded-lg p-1 mr-4"
                whileHover={{ scale: 1.02 }}
              >
                <motion.button
                  onClick={() => setShowDonation(true)}
                  className={`px-3 py-2 rounded-md font-semibold transition-all duration-300 ${
                    showDonation
                      ? "bg-[#D32F2F] text-white shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Hiến
                </motion.button>
                <motion.button
                  onClick={() => setShowDonation(false)}
                  className={`px-3 py-2 rounded-md font-semibold transition-all duration-300 ${
                    !showDonation
                      ? "bg-[#D32F2F] text-white shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Nhận
                </motion.button>
              </motion.div>

              {/* Nút chế độ cơ bản/chi tiết */}
              <motion.button
                onClick={() => setWithRh(false)}
                className={`px-4 py-2 rounded-lg border font-semibold transition-all duration-300 ${
                  !withRh
                    ? "bg-[#D32F2F] text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Chế độ cơ bản
              </motion.button>
              <motion.button
                onClick={() => setWithRh(true)}
                className={`px-4 py-2 rounded-lg border font-semibold transition-all duration-300 ${
                  withRh
                    ? "bg-[#D32F2F] text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Chế độ chi tiết
              </motion.button>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`table-${withRh}-${showDonation}`}
                className="rounded-md shadow overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <table className="w-full table-fixed">
                  <thead className="bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] text-white">
                    <tr>
                      <th className="py-4 px-4 w-1/3 text-left font-bold text-sm sm:text-base transition-all duration-300">
                        Nhóm máu
                      </th>
                      <th className="py-4 px-4 w-2/3 text-left font-bold text-sm sm:text-base transition-all duration-300">
                        {showDonation ? "Có thể hiến cho" : "Có thể nhận từ"}
                      </th>
                    </tr>
                  </thead>
                  <tbody key={`table-${withRh}-${showDonation}`}>
                    {withRh
                      ? // Bảng ABO + Rh
                        showDonation
                        ? // Chế độ hiến
                          [
                            ["O-", "O-, O+, A-, A+, B-, B+, AB-, AB+"],
                            ["O+", "O+, A+, B+, AB+"],
                            ["A-", "A-, A+, AB-, AB+"],
                            ["A+", "A+, AB+"],
                            ["B-", "B-, B+, AB-, AB+"],
                            ["B+", "B+, AB+"],
                            ["AB-", "AB-, AB+"],
                            ["AB+", "AB+"],
                          ].map(([t, r], i) => (
                            <tr
                              key={`rh-donate-${t}`}
                              className={
                                "transition-all duration-300 hover:bg-[#fdeaea] hover:shadow-sm border-b border-gray-100 " +
                                (i % 2 ? "bg-gray-50/50" : "bg-white")
                              }
                              style={{
                                animation: `fadeInUp 0.5s ease-out ${
                                  i * 0.1
                                }s both`,
                              }}
                            >
                              <td className="py-4 px-4 font-bold text-[#D32F2F] transition-all duration-300 hover:text-[#B71C1C] text-left text-lg">
                                {t}
                              </td>
                              <td className="py-4 px-4 transition-all duration-300 hover:text-gray-800 hover:font-medium text-left">
                                <div className="flex flex-wrap gap-2">
                                  {r.split(", ").map((bloodType, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-red-200 transition-colors duration-200"
                                    >
                                      {bloodType}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))
                        : // Chế độ nhận
                          [
                            ["O-", "O-"],
                            ["O+", "O-, O+"],
                            ["A-", "O-, A-"],
                            ["A+", "O-, O+, A-, A+"],
                            ["B-", "O-, B-"],
                            ["B+", "O-, O+, B-, B+"],
                            ["AB-", "O-, A-, B-, AB-"],
                            ["AB+", "O-, O+, A-, A+, B-, B+, AB-, AB+"],
                          ].map(([t, r], i) => (
                            <tr
                              key={`rh-receive-${t}`}
                              className={
                                "transition-all duration-300 hover:bg-[#fdeaea] hover:shadow-sm border-b border-gray-100 " +
                                (i % 2 ? "bg-gray-50/50" : "bg-white")
                              }
                              style={{
                                animation: `fadeInUp 0.5s ease-out ${
                                  i * 0.1
                                }s both`,
                              }}
                            >
                              <td className="py-4 px-4 font-bold text-[#D32F2F] transition-all duration-300 hover:text-[#B71C1C] text-left text-lg">
                                {t}
                              </td>
                              <td className="py-4 px-4 transition-all duration-300 hover:text-gray-800 hover:font-medium text-left">
                                <div className="flex flex-wrap gap-2">
                                  {r.split(", ").map((bloodType, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors duration-200"
                                    >
                                      {bloodType}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))
                      : // Bảng ABO thường
                      showDonation
                      ? // Chế độ hiến
                        [
                          ["O", "O, A, B, AB"],
                          ["A", "A, AB"],
                          ["B", "B, AB"],
                          ["AB", "AB"],
                        ].map(([t, r], i) => (
                          <tr
                            key={`abo-donate-${t}`}
                            className={
                              "transition-all duration-300 hover:bg-[#fdeaea] hover:shadow-sm border-b border-gray-100 " +
                              (i % 2 ? "bg-gray-50/50" : "bg-white")
                            }
                            style={{
                              animation: `fadeInUp 0.5s ease-out ${
                                i * 0.1
                              }s both`,
                            }}
                          >
                            <td className="py-4 px-4 font-bold text-[#D32F2F] transition-all duration-300 hover:text-[#B71C1C] text-left text-lg">
                              {t}
                            </td>
                            <td className="py-4 px-4 transition-all duration-300 hover:text-gray-800 hover:font-medium text-left">
                              <div className="flex flex-wrap gap-2">
                                {r.split(", ").map((bloodType, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-red-200 transition-colors duration-200"
                                  >
                                    {bloodType}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))
                      : // Chế độ nhận
                        [
                          ["O", "O"],
                          ["A", "O, A"],
                          ["B", "O, B"],
                          ["AB", "O, A, B, AB"],
                        ].map(([t, r], i) => (
                          <tr
                            key={`abo-receive-${t}`}
                            className={
                              "transition-all duration-300 hover:bg-[#fdeaea] hover:shadow-sm border-b border-gray-100 " +
                              (i % 2 ? "bg-gray-50/50" : "bg-white")
                            }
                            style={{
                              animation: `fadeInUp 0.5s ease-out ${
                                i * 0.1
                              }s both`,
                            }}
                          >
                            <td className="py-4 px-4 font-bold text-[#D32F2F] transition-all duration-300 hover:text-[#B71C1C] text-left text-lg">
                              {t}
                            </td>
                            <td className="py-4 px-4 transition-all duration-300 hover:text-gray-800 hover:font-medium text-left">
                              <div className="flex flex-wrap gap-2">
                                {r.split(", ").map((bloodType, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors duration-200"
                                  >
                                    {bloodType}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </motion.div>
            </AnimatePresence>
          </motion.section>

          {/* Diagram */}
          <motion.section variants={itemVariants} className="mt-12 mb-12">
            <motion.h4
              className="text-center text-4xl font-bold text-[#D32F2F] mb-6"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
            >
              Sơ đồ tương thích nhóm máu
            </motion.h4>
            <motion.div
              className="max-w-5xl mx-auto p-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {/* Nút chuyển chế độ cho sơ đồ */}
              <motion.div
                className="flex justify-center gap-3 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <motion.button
                  onClick={() => setDiagramWithRh(false)}
                  className={`px-6 py-3 rounded-lg border-2 font-semibold transition-all duration-300 ${
                    !diagramWithRh
                      ? "bg-[#D32F2F] text-white border-[#D32F2F] shadow-lg transform scale-105"
                      : "bg-white text-[#D32F2F] border-[#D32F2F] hover:bg-gray-50"
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Chế độ cơ bản
                </motion.button>
                <motion.button
                  onClick={() => setDiagramWithRh(true)}
                  className={`px-6 py-3 rounded-lg border-2 font-semibold transition-all duration-300 ${
                    diagramWithRh
                      ? "bg-[#D32F2F] text-white border-[#D32F2F] shadow-lg transform scale-105"
                      : "bg-white text-[#D32F2F] border-[#D32F2F] hover:bg-gray-50"
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Chế độ chi tiết
                </motion.button>
              </motion.div>

              {/* Container cho sơ đồ với overflow hidden */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={diagramWithRh ? "rh-mode" : "basic-mode"}
                  className="w-full overflow-hidden rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <BloodCompatibilityDiagram withRh={diagramWithRh} />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.section>

          {/* Image Grid */}
          <motion.section variants={itemVariants} className="py-12">
            <motion.h4
              className="text-center text-3xl font-bold text-[#D32F2F] mb-6"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
            >
              Hiến máu nhân đạo – Lan tỏa yêu thương
            </motion.h4>
            <motion.div
              className="grid md:grid-cols-4 grid-cols-2 gap-5"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {["Gruop", "mobile", "emergency", "thanks"].map((img) => (
                <motion.div
                  key={img}
                  className="tilt-card rounded-md overflow-hidden shadow cursor-pointer"
                  variants={{
                    hidden: { y: 20, opacity: 0, scale: 0.8 },
                    visible: {
                      y: 0,
                      opacity: 1,
                      scale: 1,
                      transition: {
                        duration: 0.6,
                        ease: "easeOut",
                      },
                    },
                  }}
                  whileHover={{
                    scale: 1.1,
                    y: -10,
                    rotateY: 5,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.img
                    src={`/image/${img}.png`}
                    alt={img}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* FAQ link */}
          <motion.section variants={itemVariants} className="text-center mb-10">
            <motion.h2
              className="text-2xl font-bold text-[#D32F2F] hover:underline"
              whileHover={{ scale: 1.05, color: "#B71C1C" }}
              transition={{ duration: 0.3 }}
            >
              <Link to="/faq">Bạn đang thắc mắc? Xem FAQ tại đây!</Link>
            </motion.h2>
          </motion.section>
        </div>
      </div>

      {/* Scroll To Top Button */}
      {/* <ScrollToTopButton /> */}
    </motion.div>
  );
};

export default Homepage;
