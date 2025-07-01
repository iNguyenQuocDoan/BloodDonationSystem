import { useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
export const FAQPage = ({ onAnyClick }) => {
  const [faqList, setfaqList] = useState([
    {
      id: 1,
      question: "Làm cách nào để đăng ký tài khoản trên hệ thống?",
      answer:
        "Bạn nhấn vào nút 'Đăng ký' ở góc trên bên phải màn hình, điền đầy đủ thông tin cá nhân và xác nhận để hoàn tất đăng ký tài khoản.",
    },
    {
      id: 2,
      question: "Hiến máu có ảnh hưởng đến sức khỏe không?",
      answer:
        "Hiến máu hoàn toàn an toàn đối với người khỏe mạnh. Sau khi hiến máu, cơ thể sẽ nhanh chóng tái tạo lại lượng máu đã cho. Bạn nên nghỉ ngơi và uống nhiều nước sau khi hiến.",
    },
    {
      id: 3,
      question: "Mỗi lần hiến máu lấy bao nhiêu?",
      answer:
        "Mỗi lần hiến máu thường lấy từ 250ml đến 450ml, tùy theo thể trạng và cân nặng của người hiến.",
    },
    {
      id: 4,
      question: "Bao lâu tôi có thể hiến máu lại?",
      answer: "Nam giới có thể hiến máu lại sau 12 tuần, nữ giới sau 16 tuần kể từ lần hiến trước.",
    },
    {
      id: 5,
      question: "Cần chuẩn bị gì trước khi hiến máu?",
      answer:
        "Bạn nên ngủ đủ giấc, ăn nhẹ trước khi hiến máu, tránh sử dụng rượu bia và mang theo giấy tờ tùy thân khi đến điểm hiến máu.",
    },
    {
      id: 6,
      question: "Tôi có được nhận giấy chứng nhận hoặc quà tặng gì không?",
      answer:
        "Sau khi hiến máu, bạn sẽ nhận được giấy chứng nhận hiến máu tình nguyện và một phần quà nhỏ như lời cảm ơn từ chương trình.",
    },
    {
      id: 7,
      question: "Làm sao để biết nhóm máu của mình?",
      answer:
        "Nếu bạn chưa biết nhóm máu, khi tham gia hiến máu lần đầu, bạn sẽ được xét nghiệm và thông báo kết quả nhóm máu miễn phí.",
    },
    {
      id: 8,
      question: "Tôi có thể đăng ký hiến máu khẩn cấp qua hệ thống không?",
      answer:
        "Bạn có thể nhấn nút 'Hiến máu khẩn cấp' ở góc màn hình để đăng ký tham gia các đợt hiến máu khẩn cấp khi có nhu cầu từ bệnh viện.",
    },
  ]);

  const [openFAQs, setOpenFAQs] = useState([]);

  // Hàm này điều khiển việc mở/đóng câu trả lời
  // Nếu ID đã tồn tại trong openFAQs (câu hỏi đang mở) → loại bỏ ID đó (đóng câu hỏi)
  // Nếu ID chưa tồn tại → thêm ID vào (mở câu hỏi)
  const toggleFAQ = (id) => {
    setOpenFAQs(
      openFAQs.includes(id)
        ? openFAQs.filter((faqId) => faqId !== id)
        : [...openFAQs, id]
    );
  };

  return (
    <div className="mx-auto px-4 py-8">
      <h1 className="text-center text-2xl pb-8 text-[#D32F2F]">
        Câu hỏi thường gặp
      </h1>
      <div className="max-w-4xl mx-auto space-y-4">
        {faqList.map((item) => (
          <div key={item.id} className="w-full border rounded-lg shadow-sm">
            <button
              className="w-full flex justify-between p-4 bg-gray-50 hover:bg-gray-100"
              onClick={() => {
                if (onAnyClick) onAnyClick();
                else toggleFAQ(item.id);
              }}
            >
              <h2 className="font-semibold">{item.question}</h2>
              <AiFillCaretDown
                className={`
                                transform transition ${
                                  openFAQs.includes(item.id) ? "rotate-180" : ""
                                } text-gray-400`}
              />
            </button>
            {openFAQs.includes(item.id) && (
              <div className="p-4">
                <p className="text-black">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
