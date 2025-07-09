import { useState, useEffect, useRef, useCallback } from "react";
import { askGemini } from "./askGemini";
import useApi from "../../hooks/useApi";
import TypewriterText from "./TypewriterText";

export default function GeminiChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(""); // Thêm state lưu tên
  const chatContentRef = useRef(null); // Ref cho phần chat content
  // eslint-disable-next-line no-unused-vars
  const [typingMessageId, setTypingMessageId] = useState(null); // ID của tin nhắn đang typing
  const [isTyping, setIsTyping] = useState(false); // State để theo dõi typing
  const [shouldStopTyping, setShouldStopTyping] = useState(false); // State để dừng typing
  const [isExpanded, setIsExpanded] = useState(false); // State để phóng to chatbot
  const typingTimeoutRef = useRef(null); // Ref để lưu timeout ID

  const { getCurrentUser } = useApi();
  const [showFAQ, setShowFAQ] = useState(false);

  // Component để format text đẹp hơn
  const FormattedText = ({ text }) => {
    // Tách text thành các đoạn và format
    const formatText = (rawText) => {
      if (!rawText) return rawText;

      // Tách theo dấu xuống dòng hoặc dấu chấm kết thúc câu
      let formatted = rawText
        // Xử lý các ký hiệu đặc biệt trước (để tránh conflict)
        .replace(/\*\*\*/g, "\n")
        .replace(/\*\*/g, "")
        // Chỉ thay thế * thành bullet nếu nó ở đầu dòng hoặc sau khoảng trắng
        .replace(/(^|\s)\*\s/gm, "$1• ")
        // Thêm xuống dòng sau dấu chấm nếu theo sau là chữ hoa
        .replace(
          /\. ([A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂÂÊÔƠƯẮẰẲẴẶẤẦẨẪẬÉÈẺẼẸÍÌỈĨỊÓÒỎÕỌỐỒỔỖỘỚỜỞỠỢÚÙỦŨỤỨỪỬỮỰÝỲỶỸỴ])/g,
          ".\n$1"
        )
        // Thêm xuống dòng trước các dấu hiệu liệt kê
        .replace(/(\d+\.|•|-|\+)\s/g, "\n$1 ")
        // Thêm xuống dòng sau dấu hai chấm nếu theo sau là chữ hoa
        .replace(
          /: ([A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂÂÊÔƠƯẮẰẲẴẶẤẦẨẪẬÉÈẺẼẸÍÌỈĨỊÓÒỎÕỌỐỒỔỖỘỚỜỞỠỢÚÙỦŨỤỨỪỬỮỰÝỲỶỸỴ])/g,
          ":\n$1"
        )
        // Thêm xuống dòng trước các từ khóa quan trọng
        .replace(/(Lưu ý|Chú ý|Quan trọng|Cần thiết|Khuyến cáo):/gi, "\n$1:")
        // Loại bỏ dấu chấm thừa sau dấu hai chấm
        .replace(/:\.(\s|$)/g, ":$1")
        // Loại bỏ nhiều xuống dòng liên tiếp
        .replace(/\n\s*\n\s*\n/g, "\n\n")
        .trim();

      return formatted;
    };

    const formattedText = formatText(text);

    return (
      <div style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
        {formattedText.split("\n").map((line, index) => {
          // Nếu là dòng trống thì tạo khoảng cách
          if (!line.trim()) {
            return <div key={index} style={{ height: "8px" }} />;
          }

          // Kiểm tra xem có phải là tiêu đề không (có dấu hai chấm ở cuối)
          const isTitle = line.trim().endsWith(":") && line.length < 50;

          // Kiểm tra xem có phải là danh sách không
          const isList = /^(•|\d+\.|[a-z]\)|-|\+)\s/.test(line.trim());

          return (
            <div
              key={index}
              style={{
                marginBottom: isTitle ? "8px" : isList ? "4px" : "6px",
                fontWeight: isTitle ? "600" : "normal",
                color: isTitle ? "#D32F2F" : "#333",
                paddingLeft: isList ? "12px" : "0",
                position: "relative",
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
    );
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

  // Thêm các câu trả lời nhanh cho câu hỏi phổ biến
  const quickAnswers = {
    "nhóm máu o có thể hiến cho ai":
      "Nhóm máu O có thể hiến cho: O, A, B, AB (nhóm máu vạn năng về hiến máu)",
    "nhóm máu a nhận được từ nhóm nào": "Nhóm máu A nhận được từ: A và O",
    "nhóm máu b nên lưu ý gì khi hiến máu":
      "Nhóm máu B: Có thể hiến cho B và AB, nhận từ B và O. Lưu ý kiểm tra sức khỏe trước khi hiến.",
    "nhóm máu ab có đặc điểm gì":
      "Nhóm máu AB: Nhận được từ tất cả nhóm máu (vạn năng về nhận máu), chỉ hiến cho AB.",
    "làm thế nào để đăng ký hiến máu":
      "Đăng ký hiến máu: Vào trang chủ → Đăng ký hiến máu → Điền thông tin → Chọn địa điểm và thời gian.",
    "tôi cần chuẩn bị gì trước khi hiến máu":
      "Chuẩn bị: Ngủ đủ giấc, ăn uống đầy đủ, mang CMND, không uống rượu bia 24h trước.",
    "ai không nên hiến máu":
      "Không nên hiến: Dưới 18 tuổi, cân nặng dưới 45kg, đang mang thai, có bệnh lý tim mạch, nhiễm trùng.",
    "hiến máu có lợi ích gì":
      "Lợi ích: Kích thích tạo máu mới, kiểm tra sức khỏe miễn phí, giúp đỡ người khó khăn, cảm thấy ý nghĩa.",
    "sau khi hiến máu nên làm gì":
      "Sau hiến máu: Nghỉ ngơi 10-15 phút, uống nhiều nước, ăn nhẹ, tránh gắng sức 24h đầu.",
  };

  // Hàm kiểm tra và trả lời nhanh
  const getQuickAnswer = (question) => {
    const normalizedQuestion = question.toLowerCase().trim();
    for (const [key, answer] of Object.entries(quickAnswers)) {
      if (
        normalizedQuestion.includes(key) ||
        key.includes(normalizedQuestion)
      ) {
        return answer;
      }
    }
    return null;
  };

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
    setIsTyping(true); // Bắt đầu typing
    setShouldStopTyping(false); // Reset shouldStop flag
    setLoading(false);
    // Auto scroll ngay khi bot bắt đầu phản hồi
    setTimeout(scrollToBottom, 100);
  };

  // Hàm hoàn thành typing - sử dụng useCallback để tránh re-render
  const handleTypingComplete = useCallback((messageId) => {
    setMessages((msgs) =>
      msgs.map((msg) =>
        msg.id === messageId ? { ...msg, isTyping: false } : msg
      )
    );
    setTypingMessageId(null);
    setIsTyping(false);
    setShouldStopTyping(false); // Reset shouldStop flag
    // Auto scroll khi typing hoàn thành
    setTimeout(scrollToBottom, 100);
  }, []);

  // Hàm dừng typing
  const stopTyping = () => {
    setShouldStopTyping(true); // Signal để dừng typing
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
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

    // Kiểm tra câu trả lời nhanh trước khi gọi Gemini
    const quickAnswer = getQuickAnswer(question);
    if (quickAnswer) {
      addBotMessage(quickAnswer);
      return;
    }

    // Các câu hỏi khác gọi Gemini với prompt ngắn gọn
    try {
      const optimizedPrompt = `Trả lời ngắn gọn (2-3 câu) về câu hỏi hiến máu: ${question}. Chỉ đưa thông tin quan trọng nhất.`;
      const reply = await askGemini(optimizedPrompt);
      addBotMessage(reply);
    } catch {
      addBotMessage(
        "Xin lỗi, tôi không thể trả lời câu hỏi này ngay bây giờ. Vui lòng thử lại sau."
      );
    }
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
            bottom: isExpanded ? 20 : 144,
            right: isExpanded ? 20 : 20,
            left: isExpanded ? 20 : "auto",
            top: isExpanded ? 20 : "auto",
            width: isExpanded
              ? "calc(100vw - 40px)"
              : "min(450px, calc(100vw - 40px))",
            height: isExpanded ? "calc(100vh - 40px)" : "auto",
            maxHeight: isExpanded ? "none" : "400px",
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            padding: 0,
            zIndex: 1001,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            border: "1px solid #f0f0f0",
            transition: "all 0.3s ease",
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
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  fontSize: 14,
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
                title={isExpanded ? "Thu nhỏ chatbot" : "Phóng to chatbot"}
                onMouseEnter={(e) =>
                  (e.target.style.background = "rgba(255,255,255,0.3)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "rgba(255,255,255,0.2)")
                }
              >
                {isExpanded ? "🗗" : "🗖"}
              </button>
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
          </div>
          {/* Nội dung chat */}
          <div
            ref={chatContentRef}
            style={{
              height: isExpanded ? "calc(100vh - 200px)" : 180,
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
                    padding: msg.from === "bot" ? "12px 16px" : "10px 16px",
                    maxWidth: "80%",
                    fontSize: 14,
                    lineHeight: msg.from === "bot" ? "1.6" : "1.4",
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
                      key={`stable-${msg.id}`}
                      text={msg.text}
                      onComplete={handleTypingComplete}
                      messageId={msg.id}
                      shouldStop={shouldStopTyping}
                    />
                  ) : msg.from === "bot" ? (
                    <FormattedText text={msg.text} />
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

          {/* Nút dừng phản hồi khi bot đang typing */}
          {isTyping && messages.some((msg) => msg.isTyping) && (
            <div
              style={{
                padding: "8px 16px",
                background: "#fff",
                borderTop: "1px solid #f0f0f0",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button
                onClick={stopTyping}
                style={{
                  background:
                    "linear-gradient(135deg, #FF6B6B 0%, #EE5A52 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "20px",
                  padding: "8px 20px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(255, 107, 107, 0.3)",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
                title="Dừng phản hồi để hỏi câu khác"
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.05)";
                  e.target.style.boxShadow =
                    "0 4px 12px rgba(255, 107, 107, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow =
                    "0 2px 8px rgba(255, 107, 107, 0.3)";
                }}
              >
                <span>⏹️</span>
                Dừng phản hồi
              </button>
            </div>
          )}

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
                ➤
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
