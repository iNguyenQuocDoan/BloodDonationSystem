import { useState, useEffect } from "react";
import { askGemini } from "./askGemini";
import useApi from "../../hooks/useApi";

export default function GeminiChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(""); // Thêm state lưu tên

  const { getCurrentUser } = useApi();
  const [showFAQ, setShowFAQ] = useState(false);
  // Lấy tên user khi mở chatbot
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (open && isLoggedIn) {
      getCurrentUser()
        .then((user) => {
          setUserName(user?.data?.user_name || "Khách");
        })
        .catch(() => setUserName("Khách"));
    }
  }, [open, getCurrentUser, localStorage.getItem("isLoggedIn")]);
  useEffect(() => {
    setOpen(false); // Luôn đóng chatbot khi userName đổi (đăng nhập/xuất)
    setMessages([]);
    setInput("");
  }, [userName]);

  const faqList = [
    {
      question: "Làm cách nào để đăng ký tài khoản trên hệ thống?",
      answer:
        "Bạn nhấp vào nút “Đăng ký” ở góc trên bên phải, điền họ tên, email, số điện thoại, địa chỉ, ngày sinh, mật khẩu rồi bấm “Đăng ký”.",
    },
    {
      question: "Chưa biết nhóm máu có đăng ký hiến được không?",
      answer:
        "Được. Chọn “Đăng kí hiến máu”, sau đó ra cơ sở xét nghiệm miễn phí và gửi kết quả cho nhân viên y tế xác minh.",
    },
    // ...thêm các câu hỏi/đáp án khác từ FAQ.jsx...
  ];
  const suggestions = [
    "Các câu hỏi thường gặp",
    "Tôi thuộc nhóm máu nào?",
    "Nhóm máu O có thể hiến cho ai?",
    "Nhóm máu A nhận được từ nhóm nào?",
    "Nhóm máu B nên lưu ý gì khi hiến máu?",
    "Nhóm máu AB có đặc điểm gì?",
    "Tư vấn chọn nhóm máu phù hợp để hiến tặng",
    "Làm thế nào để đăng ký hiến máu?",
    "Tôi cần chuẩn bị gì trước khi hiến máu?",
    "Ai không nên hiến máu?",
    "Hiến máu có lợi ích gì?",
    "Sau khi hiến máu nên làm gì?",
  ];

  // Gửi câu hỏi (từ input hoặc gợi ý)
  const handleSend = async (customInput, isFAQ = false) => {
    const question = typeof customInput === "string" ? customInput : input;
    if (!question.trim()) return;

    // Nếu là "Các câu hỏi thường gặp" thì chỉ hiện danh sách, không gửi lên chat
    if (question.trim() === "Các câu hỏi thường gặp") {
      setShowFAQ(true);
      return;
    }

    setMessages([...messages, { from: "user", text: question }]);
    setInput("");
    setLoading(true);

    // Nếu là câu hỏi FAQ thì trả lời đúng đáp án
    if (isFAQ) {
      const faq = faqList.find((f) => f.question === question.trim());
      if (faq) {
        setMessages((msgs) => [...msgs, { from: "bot", text: faq.answer }]);
        setLoading(false);
        return;
      }
    }

    // Nếu là câu hỏi nhóm máu thì lấy từ API user
    if (question.trim() === "Tôi thuộc nhóm máu nào?") {
      try {
        const user = await getCurrentUser();
        const bloodType = user?.data?.blood_group || "Chưa cập nhật nhóm máu";
        setMessages((msgs) => [
          ...msgs,
          { from: "bot", text: `Nhóm máu của bạn là: ${bloodType}` },
        ]);
      } catch {
        setMessages((msgs) => [
          ...msgs,
          { from: "bot", text: "Không lấy được thông tin nhóm máu của bạn." },
        ]);
      }
      setLoading(false);
      return;
    }

    // Các câu hỏi khác vẫn hỏi Gemini
    const reply = await askGemini(question);
    setMessages((msgs) => [...msgs, { from: "bot", text: reply }]);
    setLoading(false);
  };

  // Icon button style
  const iconBtnStyle = {
    position: "fixed",
    bottom: 80, // Đồng bộ với vị trí trong Footer
    right: 20, // Đồng bộ với vị trí trong Footer
    zIndex: 1000,
    background: "#D32F2F",
    color: "#fff",
    borderRadius: "50%",
    width: 56,
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px #0002",
    cursor: "pointer",
    fontSize: 28,
    border: "none",
  };

  // Avatar
  const botAvatar = "https://cdn-icons-png.flaticon.com/512/4712/4712035.png";
  const userAvatar = "https://cdn-icons-png.flaticon.com/512/1946/1946429.png";

  return (
    <>
      {!open && (
        <button
          style={iconBtnStyle}
          onClick={() => setOpen(true)}
          title="Chatbot DaiVietBlood - Hỗ trợ tư vấn hiến máu, tìm hiểu nhóm máu và giải đáp thắc mắc 24/7"
        >
          <span role="img" aria-label="chat">
            💬
          </span>
        </button>
      )}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 144, // Tăng từ bottom của icon (80) + margin
            right: 20, // Đồng bộ với vị trí trong Footer
            width: 370,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 16px #0003",
            padding: 0,
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#D32F2F",
              padding: "12px 16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img
                src={botAvatar}
                alt="bot"
                style={{ width: 32, height: 32, borderRadius: "50%" }}
              />
              <div>
                <div
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}
                >
                  DaiVietBlood Chatbot
                </div>
                <div style={{ color: "#fff9", fontSize: 12 }}>
                  Xin chào, <b>{userName}</b>! Hỗ trợ thông tin hiến máu 24/7
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                fontSize: 22,
                color: "#fff",
                cursor: "pointer",
              }}
              title="Đóng"
            >
              ×
            </button>
          </div>
          {/* Nội dung chat */}
          <div
            style={{
              height: 220,
              overflowY: "auto",
              background: "#f9f9f9",
              padding: 12,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: msg.from === "user" ? "row-reverse" : "row",
                  alignItems: "flex-end",
                  gap: 8,
                }}
              >
                <img
                  src={msg.from === "user" ? userAvatar : botAvatar}
                  alt={msg.from}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#fff",
                  }}
                />
                <div
                  style={{
                    background: msg.from === "user" ? "#e3f2fd" : "#ffebee",
                    color: msg.from === "user" ? "#1976d2" : "#d32f2f",
                    borderRadius: 16,
                    padding: "8px 14px",
                    maxWidth: 220,
                    fontSize: 15,
                    boxShadow: "0 1px 2px #0001",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div
                style={{ color: "#888", fontStyle: "italic", marginLeft: 36 }}
              >
                Đang trả lời...
              </div>
            )}
          </div>
          {/* Gợi ý câu hỏi */}
          <div
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              padding: "8px 12px",
              background: "#fff",
            }}
          >
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                style={{
                  background: "#fff",
                  border: "1px solid #ffd6d6",
                  borderRadius: 20,
                  padding: "4px 14px",
                  fontSize: 14,
                  color: "#d32f2f",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  boxShadow: "0 1px 2px #0001",
                }}
                disabled={loading}
                onClick={() => handleSend(s)}
              >
                {s}
              </button>
            ))}
          </div>
          {/* Input */}
          <div
            style={{
              display: "flex",
              gap: 8,
              padding: "10px 12px",
              background: "#fff",
              borderTop: "1px solid #f1f1f1",
            }}
          >
            <input
              style={{
                flex: 1,
                borderRadius: 20,
                border: "1px solid #ccc",
                padding: "8px 14px",
                fontSize: 15,
                outline: "none",
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Nhập câu hỏi về hiến máu..."
              disabled={loading}
            />
            <button
              style={{
                background: "#D32F2F",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
              onClick={() => handleSend()}
              disabled={loading}
              title="Gửi"
            >
              <span role="img" aria-label="send">
                📤
              </span>
            </button>
          </div>
          {/* FAQ List */}
          {showFAQ && (
            <div
              style={{
                background: "#fff",
                border: "1px solid #ffd6d6",
                borderRadius: 12,
                margin: "8px 16px",
                padding: "8px 16px",
                boxShadow: "0 2px 8px #0001",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {faqList.map((q, idx) => (
                <button
                  key={idx}
                  style={{
                    width: "100%",
                    background: "#ffe6ea",
                    color: "#d32f2f",
                    border: "none",
                    borderRadius: 20,
                    padding: "12px 0",
                    fontWeight: "bold",
                    fontSize: 15,
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onClick={() => {
                    handleSend(q.question, true);
                    setShowFAQ(false);
                  }}
                >
                  {q.question}
                </button>
              ))}
              <button
                style={{
                  width: "100%",
                  background: "#fff",
                  color: "#888",
                  border: "1px solid #ffd6d6",
                  borderRadius: 20,
                  padding: "10px 0",
                  fontWeight: "bold",
                  fontSize: 15,
                  cursor: "pointer",
                  marginTop: 4,
                }}
                onClick={() => setShowFAQ(false)}
              >
                Đóng
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
