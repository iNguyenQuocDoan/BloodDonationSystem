import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import VanillaTilt from "vanilla-tilt";
// import BloodCompatibilityDiagram from "../../components/custom/BloodCompatibilityDiagram";
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
        className="fixed bottom-[100px] right-5 p-3 bg-[#D32F2F] text-white rounded-full shadow-lg hover:bg-red-600 transition hover:animate-bounce"
        aria-label="Scroll to top"
      >
        ↑
      </button>
    )
  );
};

const Homepage = () => {
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
          <div className="py-6">
            <p className="text-center text-[#D32F2F] py-3 bg-[#FFE6E6] rounded-lg animate-fadein">
              Chúng tôi đã ghi nhận:{" "}
              <strong>1.234 tấm lòng – 3.567 người được cứu</strong>
            </p>
            <div className="mt-8 text-center">
              <h2 className="text-2xl text-[#D32F2F] font-bold animate-slidein">
                Mỗi giọt máu trao đi – Thắp lên tia hy vọng.
              </h2>
              <p className="mt-4 animate-fadein-slow">
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
          </div>

          {/* Stories */}
          {[...Array(2)].map((_, idx) => (
            <div
              key={idx}
              data-aos="fade-up"
              className="mt-12 bg-[#f9f9f9] p-6 rounded-md border-l-4 border-[#D32F2F] shadow-md transition-all duration-500 hover:shadow-2xl animate-fadein"
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
            <h4 className="text-center text-xl text-[#D32F2F] animate-slidein">
              Bạn có đủ điều kiện hiến máu?
            </h4>
            <div className="mt-6 bg-[#E57373] p-6 rounded-lg shadow-md">
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
                    className="tilt-card bg-[#D32F2F] text-white p-4 rounded-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer animate-fadein"
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
            <h4 className="text-center text-xl text-[#D32F2F] mb-4 animate-slidein">
              Bảng tương thích nhóm máu
            </h4>
            <div className="overflow-x-auto rounded-md shadow transition-all duration-500 hover:shadow-lg animate-fadein">
              <table className="w-full text-center">
                <thead className="bg-[#FAFAFA]">
                  <tr>
                    <th className="py-3">Nhóm máu</th>
                    <th className="py-3">Có thể nhận</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["O", "O, A, B, AB"],
                    ["A", "A, AB"],
                    ["B", "B, AB"],
                    ["AB", "AB"],
                  ].map(([t, r], i) => (
                    <tr
                      key={t}
                      className={
                        "transition-colors duration-200 hover:bg-[#fdeaea] " +
                        (i % 2 ? "bg-gray-50" : "")
                      }
                    >
                      <td className="py-2 font-medium">{t}</td>
                      <td className="py-2">{r}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Diagram */}
          {/* <section data-aos="fade-up" className="mt-12 mb-12">
            <h4 className="text-center text-xl text-[#D32F2F] mb-6 animate-slidein">
              Sơ đồ tương thích nhóm máu
            </h4>
            <div className="bg-white p-6 rounded-lg shadow transition-all duration-500 hover:shadow-lg animate-fadein">
              <BloodCompatibilityDiagram />
            </div>
          </section> */}

          {/* Image Grid */}
          <section data-aos="fade-up" className="py-12">
            <h4 className="text-center text-xl text-[#D32F2F] mb-6 animate-slidein">
              Hiến máu nhân đạo – Lan tỏa yêu thương
            </h4>
            <div className="grid md:grid-cols-4 grid-cols-2 gap-5">
              {["Gruop", "mobile", "emergency", "thanks"].map((img) => (
                <div
                  key={img}
                  className="tilt-card rounded-md overflow-hidden shadow transition-transform duration-300 hover:scale-110 animate-fadein"
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
          <h2 className="text-center text-lg text-[#D32F2F] hover:underline mb-10 animate-fadein">
            <Link to="/faq">Bạn đang thắc mắc? Xem FAQ tại đây!</Link>
          </h2>
        </div>
      </div>

      {/* Scroll To Top Button */}
      <ScrollToTopButton />
    </div>
  );
};

export default Homepage;
