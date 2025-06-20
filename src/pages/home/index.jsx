import { useState } from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <>
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
      <div className="container mx-auto">
        <div className="py-[24px]">
          <div className="">
            <p className="text-center text-[#D32F2F] py-[15.5px] bg-[#FFE6E6] border rounded-[10px]">
              Chúng tôi đã ghi nhận:{" "}
              <strong>
                {" "}
                1.234 tấm lòng nhân ái – mang hy vọng đến cho 3.567 cuộc đời.{" "}
              </strong>
              cuộc đời
            </p>
          </div>

          <div className="mt-[38px]">
            <h2 className="text-center text-[30px] text-[#D32F2F] font-[700]">
              Mỗi giọt máu trao đi – Thắp lên tia hy vọng.
            </h2>
            <p className="text-center text-[18px] mt-[25px]">
              Chung tay hiến máu – Trao sự sống, gieo hy vọng cho cộng đồng.
            </p>
            <div className="flex justify-center">
              <button className="mx-auto text-white mt-[25px] px-[24px] py-[8px] rounded-[6px] bg-[#D32F2F]">
                <Link to="/donateBlood">Góp giọt máu hồng</Link>
              </button>
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
      {/*End Section 1 */}
      {/* Section 2 */}
      <div className="container mx-auto mt-[48px]">
        <h4 className="text-[20px] text-[#D32F2F] text-center">
          Bạn có đủ điều kiện hiến máu – Trao đi sự sống?
        </h4>
        <div className="w-full h-full mt-[24px] py-[32px] px-[24px] bg-[#E57373] max-w-4xl mx-auto shadow-sm rounded-[7px] ">
          <h5 className="text-center text-white text-[20px] font-[500]">
            Điều kiện hiến máu – Ai có thể trao đi sự sống?
          </h5>
          <div className="grid md:grid-cols-4 grid-cols-2 gap-x-[10px] h-full">
            <div className="text-white bg-[#D32F2F] w-full h-[172px] mt-[24px]  shadow-sm rounded-[15px]">
              <p className="mt-[20px] ml-[15px] xl:text-[16px] text-[12px]">
                Độ tuổi & Cân nặng :{" "}
              </p>
              <p className="mt-[10px] ml-[15px]  xl:text-[13px] text-[12px]">
                Độ tuổi: từ 18 đến 60 tuổi
              </p>
              <p className="mt-[10px] ml-[15px]  xl:text-[13px] text-[12px]">
                Cân nặng: Nữ ≥ 45kg, Nam ≥ 50kg.
              </p>
            </div>

            <div className="text-white bg-[#D32F2F] w-full h-[172px] mt-[24px]  shadow-sm rounded-[15px]">
              <p className="mt-[20px] ml-[15px] xl:text-[16px] text-[12px] ">
                {" "}
                Tình trạng sức khỏe :{" "}
              </p>
              <p className="mt-[10px] ml-[15px] xl:text-[13px] text-[12px]">
                Không mắc các bệnh truyền nhiễm qua đường máu.
              </p>
              <p className="mt-[10px] ml-[15px]  xl:text-[13px] text-[12px]">
                Huyết áp ổn định – Không sử dụng thuốc hay chất kích thích.
              </p>
            </div>

            <div className="text-white bg-[#D32F2F] w-full h-[172px] mt-[24px]  shadow-sm rounded-[15px]">
              <p className="mt-[20px] ml-[15px] xl:text-[16px] text-[12px] ">
                Tần suất hiến máu :{" "}
              </p>
              <p className="mt-[10px] ml-[15px]  xl:text-[13px] text-[12px]">
                Nữ: Mỗi 3 tháng.
              </p>
              <p className="mt-[10px] ml-[15px]  xl:text-[13px] text-[12px]">
                Nam: Mỗi 2 tháng.
              </p>
            </div>

            <div className="text-white bg-[#D32F2F] w-full h-[172px] mt-[24px]  shadow-sm rounded-[15px]">
              <p className="mt-[20px] ml-[15px] xl:text-[15px] text-[12px]">
                Điều kiện sức khỏe dành cho phụ nữ khi hiến máu
              </p>
              <p className="mt-[10px] ml-[15px]  xl:text-[13px] text-[12px]">
                Không mang thai hoặc đang trong kỳ kinh nguyệt để đảm bảo sức
                khỏe khi hiến máu.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* End Section 2 */}
      {/*  Section 3 */}
      <div className="container mx-auto mt-[48px]">
        <h4 className="text-[20px] text-[#D32F2F] text-center mb-[24px]">
          Nhóm máu tương thích
        </h4>

        <div className="container mx-auto px-4 mt-[48px]">
          <h4 className="text-[24px] text-[#D32F2F] text-center font-semibold mb-[16px]">
            Bảng tương thích nhóm máu
          </h4>

          <div className="bg-white rounded-[5px] shadow-md overflow-x-auto max-w-4xl mx-auto">
            <table className="min-w-full text-sm text-center border-collapse">
              <thead className="bg-[#FAFAFA] border-b">
                <tr>
                  <th className="px-6 py-4 text-[#D32F2F] font-semibold">
                    Nhóm máu
                  </th>
                  <th className="px-6 py-4 text-[#D32F2F] font-semibold">
                    Nhóm máu có thể nhận
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-6 py-3 font-medium">O</td>
                  <td className="px-6 py-3">
                    O, A, B, AB <br />
                    <span className="text-gray-500 text-xs">
                      (Người hiến máu toàn cầu)
                    </span>
                  </td>
                </tr>
                <tr className="bg-gray-50 border-b">
                  <td className="px-6 py-3 font-medium">A</td>
                  <td className="px-6 py-3">A, AB</td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-3 font-medium">B</td>
                  <td className="px-6 py-3">B, AB</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-3 font-medium">AB</td>
                  <td className="px-6 py-3">
                    AB <br />
                    <span className="text-gray-500 text-xs">
                      (Người nhận máu toàn cầu)
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* End Section 3 */}
      {/* Section 4 */}
      <div className="py-[48px]">
        <div className="container mx-auto ">
          <h4 className="text-[20px] text-[#D32F2F] text-center mb-[24px] ">
            Hiến máu nhân đạo – Lan tỏa yêu thương, cứu sống những cuộc đời.
          </h4>
          <div className="flex justify-center items-center">
            <div className="grid md:grid-cols-4 grid-cols-2 gap-x-[20px] ">
              <div className="max-w-screen-xl   sm:h-[160px] h-[130px] sm:w-[270px] w-[180px]">
                <img
                  src="/image/Gruop.png"
                  alt="DaiVietBlood"
                  className="object-fit w-full h-full border rounded-[5px]"
                ></img>
              </div>
              <div className="max-w-screen-xl  sm:h-[160px] h-[130px] sm:w-[270px] w-[180px]">
                <img
                  src="/image/mobile.png "
                  alt="DaiVietBlood"
                  className="object-fit w-full h-full border rounded-[5px]"
                ></img>
              </div>
              <div className="max-w-screen-xl  sm:h-[160px] h-[130px] sm:w-[270px] w-[180px]">
                <img
                  src="/image/emergency.png "
                  alt="DaiVietBlood"
                  className="object-fit w-full h-full border rounded-[5px]"
                ></img>
              </div>
              <div className="max-w-screen-xl   sm:h-[160px] h-[130px] sm:w-[270px] w-[180px]">
                <img
                  src="/image/thanks.png "
                  alt="DaiVietBlood"
                  className="object-fit w-full h-full border rounded-[5px]"
                ></img>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Section 4 */}
      <h2 className="text-center hover:underline text-[#D32F2F] mb-[20px]">
        <Link to="/faq">
          {" "}
          Bạn đang thắc mắc? Chúng tôi sẵn sàng giải đáp! FAQ
        </Link>
      </h2>
      .
    </>
  );
};
export default Homepage;
