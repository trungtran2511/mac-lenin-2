import React, { useState, useEffect } from "react";
import { Send, Bot } from "lucide-react";

interface InlineQuizChatProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  chapterId: number;
}

export const InlineQuizChat: React.FC<InlineQuizChatProps> = ({
  question,
  options,
  correctAnswer,
  explanation,
  chapterId
}) => {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with explanation context when component renders
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        text: `Chào đồng chí! Tôi đã nạp luận giải của câu hỏi này. Đồng chí chưa rõ điểm nào trong lý thuyết Chương ${chapterId} liên quan đến câu này cần tôi bóc tách chi tiết không?`
      }
    ]);
  }, [question, explanation, chapterId]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userText = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_GEMINI_API_URL || "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
      const isGoogleDirect = apiUrl.includes("generativelanguage.googleapis.com");

      // Scoped context: only this question, options, correct answer and explanation.
      const promptContext = `
Câu hỏi: "${question}"
Các phương án lựa chọn:
A. ${options[0]}
B. ${options[1]}
C. ${options[2]}
D. ${options[3]}
Đáp án đúng là: ${String.fromCharCode(65 + correctAnswer)}. ${options[correctAnswer]}
Giải thích có sẵn: "${explanation}"
Chương học: Chương ${chapterId}
`;

      const promptText = `Người dùng hỏi: "${userText}" liên quan đến câu hỏi trắc nghiệm sau:\n${promptContext}`;
      const systemInstructionText = `Bạn là Thầy Nam AI - Giảng viên Kinh tế chính trị học Mác - Lênin.
Giải đáp thắc mắc của sinh viên xoay quanh câu hỏi trắc nghiệm được cung cấp và lý thuyết liên quan đến Chương ${chapterId} đó.
Hãy giải thích thật dễ hiểu, ngắn gọn và bám sát lý luận chuẩn mực để giúp học viên ôn luyện tốt.`;

      let response;
      if (isGoogleDirect) {
        response = await fetch(`${apiUrl}?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            systemInstruction: {
              parts: [{ text: systemInstructionText }]
            }
          })
        });
      } else {
        response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash",
            messages: [
              { role: "system", content: systemInstructionText },
              { role: "user", content: promptText }
            ]
          })
        });
      }

      if (!response.ok) throw new Error("Failed to connect to Gemini AI");
      const resData = await response.json();
      let aiResponse = "";
      if (isGoogleDirect) {
        aiResponse = resData.candidates?.[0]?.content?.parts?.[0]?.text || "Tôi đang suy ngẫm, đồng chí hỏi lại nhé!";
      } else {
        aiResponse = resData.choices?.[0]?.message?.content || resData.candidates?.[0]?.content?.parts?.[0]?.text || "Tôi đang suy ngẫm, đồng chí hỏi lại nhé!";
      }

      setMessages(prev => [...prev, { role: "assistant", text: aiResponse }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "assistant", text: "⚠️ Hiện tại hệ thống AI đang bận đấu tranh giai cấp, vui lòng thử lại sau ít phút!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 border border-white/10 rounded-2xl bg-neutral-950/60 overflow-hidden flex flex-col h-[280px]">
      {/* Header */}
      <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center gap-2">
        <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-emerald-400">Trợ lý ôn tập tại chỗ</span>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 scrollbar-thin">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`p-3 rounded-xl text-xs max-w-[85%] leading-relaxed ${msg.role === "user" ? "bg-emerald-500/20 border border-emerald-500/30 text-white" : "bg-white/5 border border-white/5 text-white/80"}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-xl text-xs bg-white/5 border border-white/5 text-white/40 animate-pulse">
              Đang phân tích dữ liệu...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-2 border-t border-white/10 flex gap-2 bg-neutral-950/80">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Hỏi thêm về câu trắc nghiệm này..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="w-8 h-8 rounded-xl bg-white hover:bg-stone-200 text-black flex items-center justify-center cursor-pointer border-none flex-shrink-0 disabled:bg-neutral-800 disabled:text-neutral-500"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
