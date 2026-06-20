import React, { useEffect, useRef } from "react";
import { Send, Hash, Bell } from "lucide-react";
import type { ChatEntry, Department } from "../../lib/darkCeoTypes";
import { DARK_CEO_DEPARTMENTS } from "../../lib/darkCeoData";

interface SlackChatPanelProps {
  chatHistory: ChatEntry[];
  isTyping: boolean;
  typingDeptName: string;
}

export const SlackChatPanel: React.FC<SlackChatPanelProps> = ({
  chatHistory,
  isTyping,
  typingDeptName
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  const getDept = (deptId?: string): Department | undefined => {
    return DARK_CEO_DEPARTMENTS.find((d) => d.id === deptId);
  };

  return (
    <div className="flex flex-col h-[450px] border border-white/10 bg-neutral-950/80 rounded-2xl overflow-hidden shadow-2xl">
      {/* Slack Header */}
      <div className="flex justify-between items-center bg-[#1a1d21] border-b border-white/5 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <Hash className="w-4 h-4 text-neutral-400" />
          <span className="text-sm font-black text-white">#ban-giam-doc-ceos</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </div>
        <div className="flex items-center gap-3 text-neutral-400">
          <Bell className="w-3.5 h-3.5 hover:text-white cursor-pointer transition-colors" />
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-white font-medium select-none">
            3 Online
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-normal text-left">
        {chatHistory.map((entry, index) => {
          if (entry.type === "system") {
            return (
              <div key={index} className="flex justify-center my-2">
                <span className="text-[10px] bg-white/5 border border-white/15 px-3 py-1 rounded-full text-neutral-400 font-mono">
                  {entry.text}
                </span>
              </div>
            );
          }

          if (entry.type === "karma") {
            return (
              <div
                key={index}
                className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl flex gap-3 shadow-[0_4px_10px_rgba(239,68,68,0.05)] animate-pulse"
              >
                <div className="w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center shrink-0 border border-red-500/30 text-base">
                  ⚡
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[11px] font-black text-red-400 uppercase tracking-wider">PHỦ ĐỊNH</span>
                    <span className="text-[9px] text-neutral-500 font-mono">{entry.timestamp}</span>
                  </div>
                  <p className="text-sm text-red-200 mt-1 leading-relaxed font-semibold">{entry.text}</p>
                </div>
              </div>
            );
          }

          const dept = getDept(entry.departmentId);
          const isCeo = entry.type === "ceo";

          return (
            <div key={index} className={`flex gap-3 items-start ${isCeo ? "opacity-95" : ""}`}>
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-white/10 text-base select-none ${
                  isCeo ? "bg-indigo-600/30 text-white" : "bg-neutral-800"
                }`}
              >
                {isCeo ? "👔" : dept?.avatar || "👤"}
              </div>

              {/* Message body */}
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-sm font-black ${
                      isCeo ? "text-indigo-400" : dept?.color || "text-neutral-300"
                    }`}
                  >
                    {isCeo ? "Bạn (CEO)" : dept?.name || "Bộ phận"}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">{entry.timestamp}</span>
                </div>
                <p className="text-sm text-neutral-300 mt-1 leading-relaxed font-light whitespace-pre-wrap">
                  {entry.text}
                </p>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 items-center opacity-70">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0 text-xs">
              💬
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-neutral-400">{typingDeptName} đang soạn thảo...</span>
              <div className="flex items-center gap-1 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input mimic footer */}
      <div className="bg-[#1a1d21] border-t border-white/5 p-3 flex gap-2 items-center">
        <div className="flex-1 bg-neutral-900 border border-white/5 rounded-xl px-3 py-2 text-sm text-neutral-500 italic flex items-center justify-between">
          <span>Ban giám đốc đang trả lời tin nhắn...</span>
          <Send className="w-3.5 h-3.5 text-neutral-600" />
        </div>
      </div>
    </div>
  );
};
