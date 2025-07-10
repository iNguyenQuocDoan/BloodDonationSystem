import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = "AIzaSyBxXlyUzKGP1cQOr7e1iohGlxeP4ld9Tqw"; // Đặt API key ở đây (không khuyến khích trên frontend)

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function askGemini(prompt) {
  // prompt giờ là string đã chuẩn hóa
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  return response?.text || "Không có phản hồi từ Gemini";
}
