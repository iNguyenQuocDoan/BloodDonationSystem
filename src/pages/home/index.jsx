import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import VanillaTilt from "vanilla-tilt";
import BloodCompatibilityDiagram from "../../components/custom/BloodCompatibilityDiagram";
import DonateBlood from "./DonateBlood";
import { DateFilter } from "../../components/DateFilter";
import { FAQPage } from "./FAQ";

// ScrollToTopButton Component
const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    visible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-[140px] right-5 w-12 h-12 bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group z-[1000]"
        aria-label="Scroll to top"
        title="Cuộn lên đầu trang"
        style={{ right: "20px" }} // Đồng bộ với các nút khác
      >
        <svg
          className="w-5 h-5 transform group-hover:-translate-y-0.5 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M7 11l5-5m0 0l5 5m-5-5v12"
          />
        </svg>
      </button>
    )
  );
};

const Homepage = () => {
  const [withRh, setWithRh] = useState(false); // State cho bảng
  const [diagramWithRh, setDiagramWithRh] = useState(false); // State cho sơ đồ
  const [showDonation, setShowDonation] = useState(true); // State cho chế độ hiến/nhận (true = hiến, false = nhận)

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    // Apply tilt
    const tiltCards = document.querySelectorAll(".tilt-card");
    VanillaTilt.init(tiltCards, {
      max: 10,
      speed: 400,
      glare: true,
      "max-glare": 0.3,
    });
  }, []);

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
    <div className="container mx-auto mt-8 relative">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          {/* Section 1 */}
          <div className="relative bg-[#000000] w-full h-[400px] overflow-hidden">
            <img
              src="/image/DonateBloodBanner.jpg"
              alt="DaiVietBlood"
              className="object-cover w-full h-full opacity-35 transition-all duration-700 scale-100 hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h1 className="font-bold text-white md:text-4xl text-3xl animate-slidein">
                  Một giọt máu cho đi – Thắp sáng hy vọng
                </h1>
                <p className="text-white md:text-lg text-base mt-2 animate-fadein-slow">
                  DaiVietBlood kết nối những tấm lòng nhân ái với những người
                  đang cần máu gấp, mở ra một hành trình sẻ chia an toàn, đơn
                  giản và đáng tin cậy.
                </p>
              </div>
            </div>
          </div>

          {/* Statistics & Search */}
          <section data-aos="fade-up" className="py-6">
            <p className="text-center text-[#D32F2F] py-3 bg-[#FFE6E6] rounded-lg">
              Chúng tôi đã ghi nhận:{" "}
              <strong>1.234 tấm lòng – 3.567 người được cứu</strong>
            </p>
            <div className="mt-8 text-center">
              <h2 className="text-3xl font-bold text-[#D32F2F]">
                Mỗi giọt máu trao đi – Thắp lên tia hy vọng.
              </h2>
              <p className="mt-4">
                Chung tay hiến máu – Trao sự sống, gieo hy vọng cho cộng đồng.
              </p>
              <div className="flex justify-center mt-4">
                <div className="w-full max-w-xl">
                  <DateFilter
                    onSearch={handleSearch}
                    onDateChange={setDateRange}
                    startDate={startDate}
                    endDate={endDate}
                    modernStyle={true}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Stories */}
          {[...Array(2)].map((_, idx) => (
            <div
              key={idx}
              data-aos="fade-up"
              className="mt-12 bg-[#f9f9f9] p-6 rounded-md border-l-4 border-[#D32F2F] shadow-md transition-all duration-500 hover:shadow-2xl"
            >
              <h3 className="text-[#D32F2F] text-xl font-semibold mb-4">
                "
                {idx === 0
                  ? "Nhờ DaiVietBlood, tôi đã nhận được máu loại O khi cần nhất."
                  : "Tôi đã nhanh chóng tìm được người hiến máu phù hợp..."}
                "
              </h3>
              <p className="text-right font-medium">
                – {idx === 0 ? "Nguyen Cong Minh" : "Chu Phuc Minh Vuong"}
              </p>
            </div>
          ))}

          {/* Eligibility */}
          <section data-aos="fade-up" className="mt-12">
            <h4 className="text-center text-3xl font-bold text-[#D32F2F] mb-6">
              Bạn có đủ điều kiện hiến máu?
            </h4>
            <div className="bg-[#E57373] p-6 rounded-lg shadow-md">
              <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
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
                  <div
                    key={i}
                    className="tilt-card bg-[#D32F2F] text-white p-4 rounded-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                  >
                    <p className="font-semibold mb-2">{item.title}</p>
                    {item.lines.map((l, j) => (
                      <p key={j}>{l}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Compatibility Table */}
          <section data-aos="fade-up" className="mt-12">
            <h4 className="text-center text-3xl font-bold text-[#D32F2F] mb-4">
              Bảng tương thích nhóm máu
            </h4>

            {/* Nút chuyển chế độ cho bảng */}
            <div className="flex justify-center gap-3 mb-6">
              {/* Nút chế độ hiến/nhận */}
              <div className="flex bg-gray-100 rounded-lg p-1 mr-4">
                <button
                  onClick={() => setShowDonation(true)}
                  className={`px-3 py-2 rounded-md font-semibold transition-all duration-300 ${
                    showDonation
                      ? "bg-[#D32F2F] text-white shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Hiến
                </button>
                <button
                  onClick={() => setShowDonation(false)}
                  className={`px-3 py-2 rounded-md font-semibold transition-all duration-300 ${
                    !showDonation
                      ? "bg-[#D32F2F] text-white shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Nhận
                </button>
              </div>

              {/* Nút chế độ cơ bản/chi tiết */}
              <button
                onClick={() => setWithRh(false)}
                className={`px-4 py-2 rounded-lg border font-semibold transition-all duration-300 ${
                  !withRh
                    ? "bg-[#D32F2F] text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Chế độ cơ bản
              </button>
              <button
                onClick={() => setWithRh(true)}
                className={`px-4 py-2 rounded-lg border font-semibold transition-all duration-300 ${
                  withRh
                    ? "bg-[#D32F2F] text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Chế độ chi tiết
              </button>
            </div>

            <div className="rounded-md shadow transition-all duration-500 hover:shadow-lg overflow-hidden">
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
            </div>
          </section>

          {/* Diagram */}
          <section data-aos="fade-up" className="mt-12 mb-12">
            <h4 className="text-center text-4xl font-bold text-[#D32F2F] mb-6">
              Sơ đồ tương thích nhóm máu
            </h4>
            <div className="max-w-5xl mx-auto p-4">
              {/* Nút chuyển chế độ cho sơ đồ */}
              <div className="flex justify-center gap-3 mb-6">
                <button
                  onClick={() => setDiagramWithRh(false)}
                  className={`px-6 py-3 rounded-lg border-2 font-semibold transition-all duration-300 ${
                    !diagramWithRh
                      ? "bg-[#D32F2F] text-white border-[#D32F2F] shadow-lg transform scale-105"
                      : "bg-white text-[#D32F2F] border-[#D32F2F] hover:bg-gray-50"
                  }`}
                >
                  Chế độ cơ bản
                </button>
                <button
                  onClick={() => setDiagramWithRh(true)}
                  className={`px-6 py-3 rounded-lg border-2 font-semibold transition-all duration-300 ${
                    diagramWithRh
                      ? "bg-[#D32F2F] text-white border-[#D32F2F] shadow-lg transform scale-105"
                      : "bg-white text-[#D32F2F] border-[#D32F2F] hover:bg-gray-50"
                  }`}
                >
                  Chế độ chi tiết
                </button>
              </div>

              {/* Container cho sơ đồ với overflow hidden */}
              <div className="w-full overflow-hidden rounded-lg">
                <BloodCompatibilityDiagram
                  key={diagramWithRh ? "rh-mode" : "basic-mode"}
                  withRh={diagramWithRh}
                />
              </div>
            </div>
          </section>

          {/* Image Grid */}
          <section data-aos="fade-up" className="py-12">
            <h4 className="text-center text-3xl font-bold text-[#D32F2F] mb-6">
              Hiến máu nhân đạo – Lan tỏa yêu thương
            </h4>
            <div className="grid md:grid-cols-4 grid-cols-2 gap-5">
              {["Gruop", "mobile", "emergency", "thanks"].map((img) => (
                <div
                  key={img}
                  className="tilt-card rounded-md overflow-hidden shadow transition-transform duration-300 hover:scale-110"
                >
                  <img
                    src={`/image/${img}.png`}
                    alt={img}
                    className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* FAQ link */}
          <section data-aos="fade-up" className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#D32F2F] hover:underline">
              <Link to="/faq">Bạn đang thắc mắc? Xem FAQ tại đây!</Link>
            </h2>
          </section>
        </div>
      </div>

      {/* Scroll To Top Button */}
      <ScrollToTopButton />
    </div>
  );
};

export default Homepage;
