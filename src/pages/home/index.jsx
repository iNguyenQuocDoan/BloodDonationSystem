import { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import VanillaTilt from "vanilla-tilt";

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

  return (
    <>
      {/* Hiệu ứng máu rơi + zoom ảnh */}
      <style>{`
        @keyframes drip {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(100px); opacity: 0; }
        }
        .drip {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #D32F2F;
          border-radius: 50%;
          animation: drip 2.5s infinite;
          top: 20px;
          left: 50%;
        }
        @keyframes zoomSlow {
          from { transform: scale(1); }
          to   { transform: scale(1.1); }
        }
        .zoom-bg {
          animation: zoomSlow 40s linear infinite;
        }
      `}</style>

      {/* Hero section */}
      <div className="relative bg-black w-full h-[650px] overflow-hidden">
        <div className="drip"></div>
        <img
          src="/image/DonateBloodBanner.jpg"
          alt="DaiVietBlood"
          className="absolute inset-0 w-full h-full object-cover opacity-35 zoom-bg"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />
        <div className="container mx-auto h-full flex flex-col items-center justify-center text-center z-10 relative px-4">
          <h1
            data-aos="zoom-in"
            className="text-white font-bold text-3xl md:text-[40px]"
          >
            Một giọt máu cho đi – Thắp sáng hy vọng
          </h1>
          <p
            data-aos="fade-up"
            className="text-white text-[18px] md:text-[22px] mt-3 max-w-2xl"
          >
            DaiVietBlood kết nối những tấm lòng nhân ái với những người đang cần
            máu gấp, mở ra một hành trình sẻ chia an toàn, đơn giản và đáng tin
            cậy. Mỗi giọt máu không chỉ cứu sống một con người mà còn lan tỏa
            tinh thần yêu thương, trách nhiệm và đoàn kết trong cộng đồng.
          </p>
        </div>
      </div>

      {/* Thống kê & CTA */}
      <div className="container mx-auto px-4 py-6">
        <p
          data-aos="fade-up"
          className="text-center text-[#D32F2F] py-4 bg-[#FFE6E6] border rounded-[10px] shadow text-[20px]"
        >
          <strong className="text-[24px] tracking-wide">1.234</strong> tấm lòng
          nhân ái – mang hy vọng đến cho{" "}
          <strong className="text-[24px] tracking-wide">3.567</strong> cuộc đời.
        </p>

        <h2
          data-aos="fade-up"
          className="text-center text-[34px] text-[#D32F2F] font-bold mt-10"
        >
          Mỗi giọt máu trao đi – Thắp lên tia hy vọng.
        </h2>
        <p data-aos="fade-up" className="text-center text-[20px] mt-6">
          Chung tay hiến máu – Trao sự sống, gieo hy vọng cho cộng đồng.
        </p>
        <div data-aos="fade-up" className="flex justify-center">
          <Link
            to="/donate"
            className="inline-block mt-6 px-8 py-2 rounded-[6px] bg-[#D32F2F] text-white shadow-lg transition-transform duration-150 hover:scale-105 active:scale-95"
          >
            Góp giọt máu hồng
          </Link>
        </div>

        {/* Câu chuyện */}
        {[...Array(2)].map((_, idx) => (
          <div
            key={idx}
            data-aos="fade-up"
            className="mt-12 bg-[#f9f9f9] py-8 px-6 rounded-md border-l-[6px] border-[#D32F2F] max-w-4xl mx-auto shadow-sm"
          >
            <h3 className="text-[#D32F2F] text-[22px] font-semibold mb-4">
              Những câu chuyện có thể giả, nhưng những cuộc đời được cứu là
              thật.
            </h3>
            <p className="text-gray-700 italic text-[18px] mb-6">
              {idx === 0
                ? '"Nhờ DaiVietBlood, tôi đã nhận được nguồn máu loại O khi cần nhất – và giờ tôi đã hoàn toàn bình phục."'
                : '"Nhờ DaiVietBlood, tôi đã nhanh chóng tìm được người hiến máu phù hợp..."'}
            </p>
            <p className="text-right text-gray-800 font-medium text-[16px]">
              – {idx === 0 ? "Nguyen Cong Minh" : "Chu Phuc Minh Vuong"}
            </p>
          </div>
        ))}
      </div>

      {/* Điều kiện hiến máu */}
      <section className="container mx-auto px-4 mt-12" data-aos="fade-up">
        <h4 className="text-[22px] text-[#D32F2F] text-center">
          Bạn có đủ điều kiện hiến máu – Trao đi sự sống?
        </h4>
        <div className="w-full mt-6 py-8 px-6 bg-[#E57373] max-w-4xl mx-auto shadow-sm rounded-[7px]">
          <h5 className="text-center text-white text-[22px] font-medium">
            Điều kiện hiến máu – Ai có thể trao đi sự sống?
          </h5>
          <div className="grid md:grid-cols-4 grid-cols-2 gap-4 mt-6">
            {[
              {
                title: "Độ tuổi & Cân nặng:",
                lines: ["18–60 tuổi", "Nữ ≥ 45kg, Nam ≥ 50kg"],
              },
              {
                title: "Tình trạng sức khỏe:",
                lines: [
                  "Không bệnh truyền nhiễm",
                  "Không dùng chất kích thích",
                ],
              },
              {
                title: "Tần suất hiến máu:",
                lines: ["Nữ: mỗi 3 tháng", "Nam: mỗi 2 tháng"],
              },
              {
                title: "Phụ nữ:",
                lines: ["Không mang thai", "Không trong kỳ kinh nguyệt"],
              },
            ].map((item, i) => (
              <div
                key={i}
                className="tilt-card text-white bg-[#D32F2F] p-4 rounded-[15px] hover:-translate-y-1 hover:shadow-2xl transition-all"
              >
                <p className="font-semibold text-[16px] mb-2">{item.title}</p>
                {item.lines.map((line, j) => (
                  <p key={j} className="text-[15px] leading-snug">
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bảng nhóm máu */}
      <section className="container mx-auto px-4 mt-12" data-aos="fade-up">
        <h4 className="text-[26px] text-[#D32F2F] text-center font-semibold mb-4">
          Bảng tương thích nhóm máu
        </h4>
        <div className="bg-white rounded-[5px] shadow-md overflow-x-auto max-w-4xl mx-auto">
          <table className="min-w-full text-base text-center border-collapse">
            <thead className="bg-[#FAFAFA] border-b">
              <tr>
                <th className="px-6 py-4 text-[#D32F2F] font-semibold text-[16px]">
                  Nhóm máu
                </th>
                <th className="px-6 py-4 text-[#D32F2F] font-semibold text-[16px]">
                  Nhóm máu có thể nhận
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["O", "O, A, B, AB", "(Người hiến máu toàn cầu)"],
                ["A", "A, AB"],
                ["B", "B, AB"],
                ["AB", "AB", "(Người nhận máu toàn cầu)"],
              ].map(([type, receive, note], i) => (
                <tr
                  key={type}
                  className={i % 2 ? "bg-gray-50 border-b" : "border-b"}
                >
                  <td className="px-6 py-3 font-medium text-[15px]">{type}</td>
                  <td className="px-6 py-3 text-[15px]">
                    {receive}
                    {note && (
                      <>
                        <br />
                        <span className="text-gray-500 text-sm">{note}</span>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Image grid */}
      <section className="py-12" data-aos="fade-up">
        <h4 className="text-[22px] text-[#D32F2F] text-center mb-6">
          Hiến máu nhân đạo – Lan tỏa yêu thương, cứu sống những cuộc đời.
        </h4>
        <div className="flex justify-center">
          <div className="grid md:grid-cols-4 grid-cols-2 gap-5">
            {["Gruop", "mobile", "emergency", "thanks"].map((img) => (
              <div
                key={img}
                className="tilt-card overflow-hidden rounded-[5px] shadow sm:h-[160px] h-[130px] sm:w-[270px] w-[180px] transition-transform duration-200 hover:scale-105"
              >
                <img
                  src={`/image/${img}.png`}
                  alt="DaiVietBlood"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ link */}
      <h2 className="text-[22px] text-center hover:underline text-[#D32F2F] mb-10">
        <Link to="/faq">
          Bạn đang thắc mắc? Chúng tôi sẵn sàng giải đáp! FAQ
        </Link>
      </h2>
    </>
  );
};

export default Homepage;
