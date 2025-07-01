import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DonateBlood from './DonateBlood';
import { DateFilter } from '../../components/DateFilter';
import { FAQPage } from './FAQ';

const Homepage = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/donate', { state: { startDate, endDate } });
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          {/* Section 1 */}
          <div className="relative bg-[#000000] w-full h-[400px]">
            <div className=""></div>
            <img
              src="/image/DonateBloodBanner.jpg"
              alt="DaiVietBlood"
              className="object-cover w-full h-full opacity-35 relative"
            ></img>
            <div className="container mx-auto ">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <h1 className="font-[700] text-white md:text-[35px] text-[30px] flex-1">
                  Một giọt máu cho đi – Thắp sáng hy vọng
                </h1>
                <p className="text-white md:text-[16px] text-[15px] mt-[10px]">
                  DaiVietBlood kết nối những tấm lòng nhân ái với những người đang
                  cần máu gấp, mở ra một hành trình sẻ chia an toàn, đơn giản và
                  đáng tin cậy. Mỗi giọt máu không chỉ cứu sống một con người mà còn
                  lan tỏa tinh thần yêu thương, trách nhiệm và đoàn kết trong cộng
                  đồng.
                </p>
              </div>
            </div>
          </div>
          <div className="py-[24px]">
            <div className="">
              <p className="text-center text-[#D32F2F] py-[15.5px] bg-[#FFE6E6] border rounded-[10px]">
                Chúng tôi đã ghi nhận: <strong> 1.234 tấm lòng nhân ái – mang hy vọng đến cho 3.567 cuộc đời. </strong>cuộc đời
              </p>
            </div>
            <div className="mt-[38px]">
              <h2 className="text-center text-[30px] text-[#D32F2F] font-[700]">
                Mỗi giọt máu trao đi – Thắp lên tia hy vọng.
              </h2>
              <p className="text-center text-[18px] mt-[25px]">
                Chung tay hiến máu – Trao sự sống, gieo hy vọng cho cộng đồng.
              </p>
              <div className="flex justify-center mt-4">
                <div className="w-full max-w-xl">
                  <DateFilter
                    onSearch={handleSearch}
                    onDateChange={setDateRange}
                    startDate={startDate}
                    endDate={endDate}
                  />
                </div>
              </div>
            </div>

            <div className="mt-[45px] ">
              <div className="bg-[#f9f9f9] w-full py-[32px] px-[24px] rounded-md border-l-[6px] border-[#D32F2F] max-w-4xl mx-auto shadow-sm">
                <h3 className="text-[#D32F2F] text-[20px] font-semibold mb-[16px]">
                  Những câu chuyện có thể giả, nhưng những cuộc đời được cứu là
                  thật.
                </h3>
                <p className="text-gray-700 italic text-[16px] mb-[24px]">
                  "Nhờ DaiVietBlood, tôi đã nhận được nguồn máu loại O khi cần
                  nhất—và giờ tôi đã hoàn toàn bình phục."
                </p>
                <p className="text-right text-gray-800 font-medium text-[15px]">
                  – Nguyen Cong Minh
                </p>
              </div>
            </div>

            <div className="mt-[45px] ">
              <div className="bg-[#f9f9f9] w-full py-[32px] px-[24px] rounded-md border-l-[6px] border-[#D32F2F] max-w-4xl mx-auto shadow-sm">
                <h3 className="text-[#D32F2F] text-[20px] font-semibold mb-[16px]">
                  Những câu chuyện có thể giả, nhưng những cuộc đời được cứu là
                  thật.
                </h3>
                <p className="text-gray-700 italic text-[16px] mb-[24px]">
                  "Nhờ DaiVietBlood, tôi đã nhanh chóng tìm được người hiến máu
                  phù hợp. Chính sự sẻ chia ấy đã giúp tôi vượt qua thời điểm khó
                  khăn nhất và giờ đây tôi đã khỏe mạnh trở lại."
                </p>
                <p className="text-right text-gray-800 font-medium text-[15px]">
                  – Chu Phuc Minh Vuong
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function FAQPageWrapper() {
  const navigate = useNavigate();
  return <FAQPage onAnyClick={() => navigate('/faq')} />;
}

export default Homepage;
