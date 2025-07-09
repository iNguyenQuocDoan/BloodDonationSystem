import { useState, useEffect, useRef } from "react";
import { askGemini } from "./askGemini";
import useApi from "../../hooks/useApi";

export default function GeminiChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(""); // Thêm state lưu tên
  const chatContentRef = useRef(null); // Ref cho phần chat content
  // eslint-disable-next-line no-unused-vars
  const [typingMessageId, setTypingMessageId] = useState(null); // ID của tin nhắn đang typing

  const { getCurrentUser } = useApi();
  const [showFAQ, setShowFAQ] = useState(false);

  // Component TypewriterText
  const TypewriterText = ({ text, onComplete, messageId }) => {
    const [displayText, setDisplayText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      if (currentIndex < text.length) {
        const timer = setTimeout(() => {
          setDisplayText(text.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
          // Auto scroll mỗi 10 ký tự để đảm bảo luôn thấy text đang typing
          if (currentIndex > 0 && currentIndex % 10 === 0) {
            setTimeout(scrollToBottom, 10);
          }
        }, 30); // Tốc độ typing (30ms mỗi ký tự)
        return () => clearTimeout(timer);
      } else {
        // Hoàn thành typing
        if (onComplete) onComplete(messageId);
      }
    }, [currentIndex, text, onComplete, messageId]);

    return <span>{displayText}</span>;
  };
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
  }, [open, getCurrentUser]); // Removed localStorage.getItem from dependency
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

  // Hàm scroll xuống dưới với hiệu ứng mượt
  const scrollToBottom = () => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTo({
        top: chatContentRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Auto scroll khi có tin nhắn mới
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(scrollToBottom, 100); // Delay nhỏ để đảm bảo DOM đã render
    }
  }, [messages]);

  // Hàm thêm tin nhắn bot với typing effect
  const addBotMessage = (text) => {
    const messageId = Date.now().toString();
    setMessages((msgs) => [
      ...msgs,
      {
        from: "bot",
        text: text,
        id: messageId,
        isTyping: true,
      },
    ]);
    setTypingMessageId(messageId);
    setLoading(false);
    // Auto scroll ngay khi bot bắt đầu phản hồi
    setTimeout(scrollToBottom, 100);
  };

  // Hàm hoàn thành typing
  const handleTypingComplete = (messageId) => {
    setMessages((msgs) =>
      msgs.map((msg) =>
        msg.id === messageId ? { ...msg, isTyping: false } : msg
      )
    );
    setTypingMessageId(null);
    // Auto scroll khi typing hoàn thành
    setTimeout(scrollToBottom, 100);
  };

  // Gửi câu hỏi (từ input hoặc gợi ý)
  const handleSend = async (customInput, isFAQ = false) => {
    const question = typeof customInput === "string" ? customInput : input;
    if (!question.trim()) return;

    // Nếu là "Các câu hỏi thường gặp" thì toggle hiển thị danh sách, không gửi lên chat
    if (question.trim() === "Các câu hỏi thường gặp") {
      setShowFAQ(!showFAQ); // Toggle thay vì chỉ set true
      return;
    }

    setMessages([
      ...messages,
      { from: "user", text: question, id: Date.now().toString() },
    ]);
    setInput("");
    setLoading(true);

    // Scroll ngay khi gửi câu hỏi
    setTimeout(scrollToBottom, 100);

    // Nếu là câu hỏi FAQ thì trả lời đúng đáp án
    if (isFAQ) {
      const faq = faqList.find((f) => f.question === question.trim());
      if (faq) {
        addBotMessage(faq.answer);
        return;
      }
    }

    // Nếu là câu hỏi nhóm máu thì lấy từ API user
    if (question.trim() === "Tôi thuộc nhóm máu nào?") {
      try {
        const user = await getCurrentUser();
        const bloodType = user?.data?.blood_group || "Chưa cập nhật nhóm máu";
        addBotMessage(`Nhóm máu của bạn là: ${bloodType}`);
      } catch {
        addBotMessage("Không lấy được thông tin nhóm máu của bạn.");
      }
      return;
    }

    // Các câu hỏi khác vẫn hỏi Gemini
    const reply = await askGemini(question);
    addBotMessage(reply);
  };

  // Icon button style
  const iconBtnStyle = {
    position: "fixed",
    bottom: 80,
    right: 20,
    zIndex: 1001, // Tăng z-index
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
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes typing-dot {
            0%, 60%, 100% {
              transform: translateY(0);
              opacity: 0.4;
            }
            30% {
              transform: translateY(-10px);
              opacity: 1;
            }
          }
          
          /* Hide scrollbar */
          .chat-suggestions::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
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
            bottom: 144,
            right: 20,
            width: "min(450px, calc(100vw - 40px))", // Tăng width để nằm ngang hơn
            maxHeight: "400px", // Giảm height để không chiếm quá nhiều màn hình
            background: "#fff",
            borderRadius: 16, // Bo tròn nhiều hơn
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)", // Shadow đẹp hơn
            padding: 0,
            zIndex: 1001,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            border: "1px solid #f0f0f0",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)",
              padding: "14px 20px",
              borderRadius: "16px 16px 0 0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img
                src={botAvatar}
                alt="bot"
                style={{ width: 32, height: 32, borderRadius: "50%" }}
              />
              <div>
                <div style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
                  🩸 DaiVietBlood Assistant
                </div>
                <div style={{ color: "#fff", fontSize: 11, opacity: 0.9 }}>
                  Xin chào <b>{userName || "Bạn"}</b>! Tôi có thể giúp gì cho
                  bạn?
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: "50%",
                width: 28,
                height: 28,
                fontSize: 16,
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              title="Đóng chatbot"
              onMouseEnter={(e) =>
                (e.target.style.background = "rgba(255,255,255,0.3)")
              }
              onMouseLeave={(e) =>
                (e.target.style.background = "rgba(255,255,255,0.2)")
              }
            >
              ×
            </button>
          </div>
          {/* Nội dung chat */}
          <div
            ref={chatContentRef}
            style={{
              height: 180, // Giảm height để compact hơn
              overflowY: "auto",
              background: "#fafafa",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              flex: "1 1 auto",
              scrollBehavior: "smooth",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={msg.id || i}
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
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#fff",
                    border: "2px solid #f0f0f0",
                  }}
                />
                <div
                  style={{
                    background:
                      msg.from === "user"
                        ? "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)"
                        : "#fff",
                    color: msg.from === "user" ? "#fff" : "#333",
                    borderRadius: 18,
                    padding: "10px 16px",
                    maxWidth: "75%",
                    fontSize: 14,
                    lineHeight: "1.4",
                    boxShadow:
                      msg.from === "user"
                        ? "0 2px 8px rgba(33, 150, 243, 0.3)"
                        : "0 2px 8px rgba(0,0,0,0.1)",
                    wordWrap: "break-word",
                    border: msg.from === "bot" ? "1px solid #f0f0f0" : "none",
                  }}
                >
                  {msg.from === "bot" && msg.isTyping ? (
                    <TypewriterText
                      text={msg.text}
                      onComplete={handleTypingComplete}
                      messageId={msg.id}
                    />
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 8,
                  marginLeft: 0,
                }}
              >
                <img
                  src={botAvatar}
                  alt="bot"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#fff",
                    border: "2px solid #f0f0f0",
                  }}
                />
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 18,
                    padding: "10px 16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    border: "1px solid #f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 13, color: "#666" }}>
                    Đang suy nghĩ
                  </span>
                  <div
                    style={{
                      display: "flex",
                      gap: 3,
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "#D32F2F",
                        animation: "typing-dot 1.4s infinite ease-in-out",
                      }}
                    ></div>
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "#D32F2F",
                        animation: "typing-dot 1.4s infinite ease-in-out 0.2s",
                      }}
                    ></div>
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "#D32F2F",
                        animation: "typing-dot 1.4s infinite ease-in-out 0.4s",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Gợi ý câu hỏi - Làm ngang hơn */}
          <div
            className="chat-suggestions"
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              padding: "12px 16px",
              background: "#fff",
              flex: "0 0 auto",
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE/Edge
            }}
          >
            {suggestions.slice(0, 6).map(
              (
                s,
                idx // Chỉ hiển thị 6 suggestion đầu
              ) => (
                <button
                  key={idx}
                  style={{
                    background:
                      s === "Các câu hỏi thường gặp" && showFAQ
                        ? "linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)"
                        : "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
                    border:
                      s === "Các câu hỏi thường gặp" && showFAQ
                        ? "1px solid #D32F2F"
                        : "1px solid #e9ecef",
                    borderRadius: 20,
                    padding: "8px 16px",
                    fontSize: 13,
                    color:
                      s === "Các câu hỏi thường gặp" && showFAQ
                        ? "#fff"
                        : "#495057",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    boxShadow:
                      s === "Các câu hỏi thường gặp" && showFAQ
                        ? "0 2px 8px rgba(211, 47, 47, 0.3)"
                        : "0 2px 4px rgba(0,0,0,0.05)",
                    transition: "all 0.2s ease",
                    fontWeight: "500",
                  }}
                  disabled={loading}
                  onClick={() => handleSend(s)}
                >
                  {s}
                </button>
              )
            )}
          </div>

          {/* FAQ List */}
          {showFAQ && (
            <div
              style={{
                background: "#fff",
                border: "1px solid #ffd6d6",
                borderRadius: 12,
                margin: "8px 12px",
                padding: "8px 16px",
                boxShadow: "0 2px 8px #0001",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                maxHeight: "150px",
                overflowY: "auto",
                flex: "0 0 auto",
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

          {/* Input */}
          <div
            style={{
              display: "flex",
              gap: 12,
              padding: "12px 16px",
              background: "#fff",
              borderTop: "1px solid #f0f0f0",
              flex: "0 0 auto",
              borderRadius: "0 0 16px 16px",
            }}
          >
            <input
              style={{
                flex: 1,
                borderRadius: 24,
                border: "1px solid #e9ecef",
                padding: "10px 16px",
                fontSize: 14,
                outline: "none",
                background: "#f8f9fa",
                transition: "all 0.2s ease",
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Nhập câu hỏi về hiến máu..."
              disabled={loading}
              onFocus={(e) => {
                e.target.style.borderColor = "#D32F2F";
                e.target.style.background = "#fff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e9ecef";
                e.target.style.background = "#f8f9fa";
              }}
            />
            <button
              style={{
                background: "linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 2px 8px rgba(211, 47, 47, 0.3)",
                transition: "all 0.2s ease",
                opacity: loading ? 0.7 : 1,
              }}
              onClick={() => handleSend()}
              disabled={loading}
              title="Gửi tin nhắn"
              onMouseEnter={(e) =>
                !loading && (e.target.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              <span role="img" aria-label="send">
                ✈️
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
