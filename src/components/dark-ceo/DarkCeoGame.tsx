import { useState, useEffect, useRef } from "react";
import { RotateCcw, AlertOctagon, CheckCircle2, Trophy, Flame } from "lucide-react";
import { DARK_CEO_DEPARTMENTS, DARK_CEO_CRISES } from "../../lib/darkCeoData";
import type { ChatEntry, KarmaTimer, CrisisMessage, CeoChoice } from "../../lib/darkCeoTypes";
import { CeoStatsBar } from "./CeoStatsBar";
import { SlackChatPanel } from "./SlackChatPanel";
import { KarmaAlert } from "./KarmaAlert";

export default function DarkCeoGame() {
  const maxTurns = 12;
  const typingTimeoutRef = useRef<any>(null);

  // Game States
  const [currentTurn, setCurrentTurn] = useState(1);
  const [scores, setScores] = useState({
    profit: 50,
    competitiveness: 50,
    socialResponsibility: 50,
    workerMorale: 50
  });

  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
  const [pendingKarma, setPendingKarma] = useState<KarmaTimer[]>([]);
  const [currentCrisis, setCurrentCrisis] = useState<CrisisMessage | null>(null);
  const [crisisQueue, setCrisisQueue] = useState<CrisisMessage[]>([]);

  const [isTyping, setIsTyping] = useState(false);
  const [typingDeptName, setTypingDeptName] = useState("");

  const [activeKarmaAlert, setActiveKarmaAlert] = useState<{
    eventText: string;
    sourceChoiceText: string;
  } | null>(null);

  const [gameOver, setGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState("");
  const [gameWon, setGameWon] = useState(false);

  // Answer key password protection states
  const [answerKeyPassword, setAnswerKeyPassword] = useState("");
  const [isAnswerKeyUnlocked, setIsAnswerKeyUnlocked] = useState(false);
  const [isAnswerKeyDropdownOpen, setIsAnswerKeyDropdownOpen] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Close dropdown and clear password field on turn transition
  useEffect(() => {
    setIsAnswerKeyDropdownOpen(false);
    setAnswerKeyPassword("");
    setPasswordError("");
  }, [currentTurn]);

  // Initialize first turn
  useEffect(() => {
    startGame();
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const startGame = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setCurrentTurn(1);
    setScores({
      profit: 50,
      competitiveness: 50,
      socialResponsibility: 50,
      workerMorale: 50
    });
    setPendingKarma([]);
    setGameOver(false);
    setGameOverReason("");
    setGameWon(false);
    setActiveKarmaAlert(null);

    const initialHistory: ChatEntry[] = [
      {
        type: "system",
        text: "⚡ HỆ THỐNG: Khởi tạo kênh liên lạc nội bộ ban giám đốc. Chúc may mắn, sếp!",
        timestamp: "08:00"
      }
    ];
    setChatHistory(initialHistory);
    // Shuffle and pick 12 crises from pool of 18
    const shuffled = [...DARK_CEO_CRISES].sort(() => Math.random() - 0.5).slice(0, 12);
    setCrisisQueue(shuffled);
    loadCrisisFromQueue(1, shuffled);
  };

  const loadCrisisFromQueue = (turn: number, queue: CrisisMessage[]) => {
    setIsTyping(true);
    const crisisIndex = turn - 1;
    const baseCrisis = queue[crisisIndex] || queue[0];

    const dept = DARK_CEO_DEPARTMENTS.find((d) => d.id === baseCrisis.departmentId);
    setTypingDeptName(dept?.name || "Hệ thống");

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      const newCrisis: CrisisMessage = {
        ...baseCrisis,
        id: `${baseCrisis.id}-turn-${turn}`,
        timestamp: `09:${String(15 * turn).padStart(2, '0')}`
      };

      setCurrentCrisis(newCrisis);
      setChatHistory((prev) => {
        const hasDuplicate = prev.some(
          (entry) =>
            entry.type === "department" &&
            entry.text === newCrisis.text &&
            entry.timestamp === newCrisis.timestamp
        );
        if (hasDuplicate) return prev;
        return [
          ...prev,
          {
            type: "department",
            departmentId: newCrisis.departmentId,
            text: newCrisis.text,
            timestamp: newCrisis.timestamp
          }
        ];
      });
    }, 1200);
  };

  const handleChoice = (choice: CeoChoice) => {
    if (!currentCrisis) return;

    // 1. Post CEO choice to chat
    const updatedHistory: ChatEntry[] = [
      ...chatHistory,
      {
        type: "ceo",
        text: `Quyết định của CEO: ${choice.text}`,
        timestamp: `09:${15 * currentTurn + 5}`
      }
    ];
    setChatHistory(updatedHistory);

    // 2. Apply immediate impact
    const nextScores = {
      profit: Math.max(0, Math.min(100, scores.profit + choice.immediateImpact.profit)),
      competitiveness: Math.max(0, Math.min(100, scores.competitiveness + choice.immediateImpact.competitiveness)),
      socialResponsibility: Math.max(0, Math.min(100, scores.socialResponsibility + choice.immediateImpact.socialResponsibility)),
      workerMorale: Math.max(0, Math.min(100, scores.workerMorale + choice.immediateImpact.workerMorale))
    };

    setScores(nextScores);

    // 3. Queue Karma event if applicable
    const nextPendingKarma = [...pendingKarma];
    if (choice.karmaEvent && currentCrisis.karmaDelay) {
      nextPendingKarma.push({
        triggerAtTurn: currentTurn + currentCrisis.karmaDelay,
        event: choice.karmaEvent,
        sourceChoiceText: choice.text
      });
      setPendingKarma(nextPendingKarma);
    }

    // 4. Check for immediate Game Over
    const failReason = checkGameOver(nextScores);
    if (failReason) {
      setGameOver(true);
      setGameOverReason(failReason);
      return;
    }

    // 5. Proceed to next turn
    const nextTurn = currentTurn + 1;
    if (nextTurn > maxTurns) {
      setGameWon(true);
      return;
    }

    setCurrentTurn(nextTurn);
    setCurrentCrisis(null);

    // 6. Check for Karma triggering in next turn
    const triggeredKarma = nextPendingKarma.find((k) => k.triggerAtTurn === nextTurn);
    if (triggeredKarma) {
      // Trigger karma
      setTimeout(() => {
        // Apply karma impact
        const postKarmaScores = {
          profit: Math.max(0, Math.min(100, nextScores.profit + triggeredKarma.event.delayedImpact.profit)),
          competitiveness: Math.max(0, Math.min(100, nextScores.competitiveness + triggeredKarma.event.delayedImpact.competitiveness)),
          socialResponsibility: Math.max(0, Math.min(100, nextScores.socialResponsibility + triggeredKarma.event.delayedImpact.socialResponsibility)),
          workerMorale: Math.max(0, Math.min(100, nextScores.workerMorale + triggeredKarma.event.delayedImpact.workerMorale))
        };
        setScores(postKarmaScores);

        // Show overlay popup
        setActiveKarmaAlert({
          eventText: triggeredKarma.event.text,
          sourceChoiceText: triggeredKarma.sourceChoiceText
        });

        // Add to chat history
        const finalHistory: ChatEntry[] = [
          ...updatedHistory,
          {
            type: "karma",
            text: `${triggeredKarma.event.text}\n(Tác động: Lợi nhuận ${triggeredKarma.event.delayedImpact.profit}%, Cạnh tranh ${triggeredKarma.event.delayedImpact.competitiveness}%, TNXH ${triggeredKarma.event.delayedImpact.socialResponsibility}%, Tinh thần ${triggeredKarma.event.delayedImpact.workerMorale}%)`,
            timestamp: `09:${15 * nextTurn}`
          }
        ];
        setChatHistory(finalHistory);

        // Remove from list
        setPendingKarma((prev) => prev.filter((k) => k.triggerAtTurn !== nextTurn));

        // Check if karma triggers game over
        const karmaFailReason = checkGameOver(postKarmaScores);
        if (karmaFailReason) {
          setTimeout(() => {
            setGameOver(true);
            setGameOverReason(karmaFailReason);
          }, 1500);
        } else {
          // Load next crisis
          loadCrisisFromQueue(nextTurn, crisisQueue);
        }
      }, 500);
    } else {
      // Load next crisis directly
      loadCrisisFromQueue(nextTurn, crisisQueue);
    }
  };

  const checkGameOver = (currentScores: typeof scores): string | null => {
    if (currentScores.profit <= 5) {
      return "Cạn kiệt dòng tiền vĩ mô! Công ty cạn kiệt vốn lưu động, ngân hàng siết nợ tuyên bố phá sản.";
    }
    if (currentScores.profit >= 95) {
      return "Tích lũy tư bản quá mức cực đoan! Công ty bóc lột thặng dư tuyệt đối dẫn tới phản kháng xã hội mạnh mẽ, Nhà nước can thiệp khởi tố hình sự và tịch thu tài sản.";
    }
    if (currentScores.competitiveness <= 5) {
      return "Mất sức cạnh tranh biện chứng! Công ty đánh mất thị phần, bị các tập đoàn độc quyền nuốt chửng hoàn toàn.";
    }
    if (currentScores.competitiveness >= 95) {
      return "Độc quyền trì trệ! Không còn đối thủ thúc đẩy, bộ máy công ty trở nên quan liêu, kém linh hoạt, bị chia tách theo Luật Chống Độc Quyền quốc gia.";
    }
    if (currentScores.socialResponsibility <= 5) {
      return "Vi phạm nghiêm trọng pháp luật & môi trường! Cơ quan kiểm tra đình chỉ hoạt động nhà máy vĩnh viễn, truy tố ban giám đốc hắc ám.";
    }
    if (currentScores.socialResponsibility >= 95) {
      return "Quá tải quỹ trách nhiệm! Bạn đã chi tiêu quá nhiều ngân sách cho phúc thiện xã hội mà không đầu tư tái sản xuất mở rộng, làm kiệt quệ tài lực phát triển.";
    }
    if (currentScores.workerMorale <= 5) {
      return "Tinh thần lao động sụp đổ! Công nhân đồng loạt đình công tự phát, chiếm đóng máy móc và tuyên bố lật đổ ách bóc lột của ban quản trị.";
    }
    if (currentScores.workerMorale >= 95) {
      return "Quỹ lương phúc lợi vượt ngưỡng chịu đựng! Nâng đãi ngộ quá cao khiến giá thành sản phẩm tăng vọt, công ty mất khả năng bù đắp hao phí lao động.";
    }
    return null;
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {activeKarmaAlert && (
        <KarmaAlert
          eventText={activeKarmaAlert.eventText}
          sourceChoiceText={activeKarmaAlert.sourceChoiceText}
          onClose={() => setActiveKarmaAlert(null)}
        />
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-3xl md:text-4xl text-white flex items-center gap-3" style={{ fontFamily: "'Instrument Serif', serif" }}>
            👔 Giám Đốc Hắc Ám: Biện Chứng Sinh Tồn
          </h2>
        </div>
        <div className="flex items-center gap-2 text-sm font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-neutral-300">
          <span>Lượt chơi:</span>
          <span className="font-bold text-white">
            {currentTurn} / {maxTurns}
          </span>
        </div>
      </div>

      {/* Stats Indicators */}
      <CeoStatsBar scores={scores} />

      {/* Game Over Screen */}
      {gameOver && (
        <div className="relative border border-red-500/30 bg-gradient-to-br from-red-950/20 via-neutral-900/80 to-black rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center text-center gap-6 py-16 overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.15)] animate-fade-in">
          {/* Animated red pulse backdrop glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative p-5 bg-gradient-to-br from-red-500/20 to-rose-600/30 rounded-2xl border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-bounce">
            <Flame className="w-12 h-12 text-red-400" />
          </div>
          
          <div className="space-y-3 z-10">
            <span className="text-xs uppercase tracking-[0.25em] text-red-500 font-extrabold px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
              Phá sản biện chứng
            </span>
            <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none uppercase pt-2" style={{ fontFamily: "'Instrument Serif', serif" }}>
              GAME OVER
            </h3>
          </div>
          
          <p className="text-[19px] md:text-[21px] text-neutral-300 max-w-xl leading-relaxed font-light font-sans z-10">
            {gameOverReason}
          </p>
          
          <div className="w-full max-w-sm h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent my-2" />
          
          <button
            onClick={startGame}
            className="z-10 group flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold shadow-[0_4px_20px_rgba(239,68,68,0.4)] transition-all hover:scale-105 active:scale-95 cursor-pointer text-base uppercase tracking-wider"
          >
            <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            Khởi động lại doanh nghiệp
          </button>
        </div>
      )}

      {/* Victory Screen */}
      {gameWon && (
        <div className="relative border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-neutral-900/80 to-black rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center text-center gap-6 py-16 overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.15)] animate-fade-in">
          {/* Animated green pulse backdrop glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative p-5 bg-gradient-to-br from-emerald-500/20 to-teal-600/30 rounded-2xl border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-pulse">
            <Trophy className="w-12 h-12 text-emerald-400" />
          </div>
          
          <div className="space-y-3 z-10">
            <span className="text-xs uppercase tracking-[0.25em] text-emerald-400 font-extrabold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              Đỉnh cao quản trị
            </span>
            <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none uppercase pt-2" style={{ fontFamily: "'Instrument Serif', serif" }}>
              CEO KIỆT XUẤT
            </h3>
          </div>
          
          <p className="text-[19px] md:text-[21px] text-neutral-300 max-w-xl leading-relaxed font-light font-sans z-10">
            Chúc mừng! Bạn đã chèo lái doanh nghiệp vượt qua toàn bộ 12 lượt khủng hoảng, duy trì sự cân bằng biện chứng hoàn hảo giữa tích lũy thặng dư và phúc lợi xã hội định hướng XHCN.
          </p>
          
          <div className="w-full max-w-sm h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent my-2" />
          
          <button
            onClick={startGame}
            className="z-10 group flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold shadow-[0_4px_20px_rgba(16,185,129,0.4)] transition-all hover:scale-105 active:scale-95 cursor-pointer text-base uppercase tracking-wider"
          >
            <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            Bắt đầu nhiệm kỳ mới
          </button>
        </div>
      )}

      {/* Active gameplay elements */}
      {!gameOver && !gameWon && (
        <div className="grid grid-cols-1 md:grid-cols-10 gap-6 items-stretch">
          {/* Slack chat window */}
          <div className={currentCrisis && !isTyping ? "md:col-span-6 flex flex-col" : "md:col-span-10 flex flex-col"}>
            <SlackChatPanel chatHistory={chatHistory} isTyping={isTyping} typingDeptName={typingDeptName} />
          </div>

          {/* Decision Box */}
          {currentCrisis && !isTyping && (
            <div className="md:col-span-4 flex flex-col">
              <div className="bg-neutral-900/40 border border-white/10 rounded-2xl p-5 flex flex-col gap-4 h-full justify-start">
                <span className="text-sm uppercase tracking-wider text-amber-400 font-extrabold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  Yêu cầu quyết định khẩn cấp
                </span>

                {/* Password-protected Answer Key Dropdown */}
                <div className="border border-white/10 rounded-xl bg-black/40 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setIsAnswerKeyDropdownOpen(!isAnswerKeyDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      {isAnswerKeyUnlocked ? "🔓" : "🔒"} Xem nhanh tác động đáp án {isAnswerKeyDropdownOpen ? "(Đóng)" : "(Yêu cầu mật khẩu)"}
                    </span>
                    <span className="text-[10px] opacity-70">
                      {isAnswerKeyDropdownOpen ? "▲" : "▼"}
                    </span>
                  </button>

                  {isAnswerKeyDropdownOpen && (
                    <div className="p-3 border-t border-white/5 bg-neutral-950/40 space-y-2">
                      {!isAnswerKeyUnlocked ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2 items-center w-full">
                            <input
                              type="password"
                              placeholder="Nhập mật khẩu..."
                              value={answerKeyPassword}
                              onChange={(e) => {
                                setAnswerKeyPassword(e.target.value);
                                setPasswordError("");
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  if (answerKeyPassword === "abc123123.jj@A") {
                                    setIsAnswerKeyUnlocked(true);
                                    setPasswordError("");
                                  } else {
                                    setPasswordError("Mật khẩu không chính xác!");
                                  }
                                }
                              }}
                              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (answerKeyPassword === "abc123123.jj@A") {
                                  setIsAnswerKeyUnlocked(true);
                                  setPasswordError("");
                                } else {
                                  setPasswordError("Mật khẩu không chính xác!");
                                }
                              }}
                              className="px-3 py-1 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all cursor-pointer shrink-0"
                            >
                              Xác nhận
                            </button>
                          </div>
                          {passwordError && (
                            <p className="text-[10px] text-rose-400 font-mono">{passwordError}</p>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs space-y-2.5 font-sans divide-y divide-white/5">
                          {(() => {
                            // Analyze each choice to find the best recommendation
                            let bestChoiceId = "";
                            const choiceAnalyses = currentCrisis.choices.map((c) => {
                              const nextProfit = scores.profit + c.immediateImpact.profit;
                              const nextComp = scores.competitiveness + c.immediateImpact.competitiveness;
                              const nextSocial = scores.socialResponsibility + c.immediateImpact.socialResponsibility;
                              const nextMorale = scores.workerMorale + c.immediateImpact.workerMorale;
                              
                              const willCauseGameOver = 
                                nextProfit <= 5 || nextProfit >= 95 ||
                                nextComp <= 5 || nextComp >= 95 ||
                                nextSocial <= 5 || nextSocial >= 95 ||
                                nextMorale <= 5 || nextMorale >= 95;
                                
                              const deviation = 
                                Math.abs(nextProfit - 50) + 
                                Math.abs(nextComp - 50) + 
                                Math.abs(nextSocial - 50) + 
                                Math.abs(nextMorale - 50);
                                
                              return {
                                id: c.id,
                                willCauseGameOver,
                                deviation
                              };
                            });
                            
                            const safeAnalyses = choiceAnalyses.filter(a => !a.willCauseGameOver);
                            if (safeAnalyses.length > 0) {
                              safeAnalyses.sort((a, b) => a.deviation - b.deviation);
                              bestChoiceId = safeAnalyses[0].id;
                            } else {
                              const sortedAll = [...choiceAnalyses].sort((a, b) => a.deviation - b.deviation);
                              bestChoiceId = sortedAll[0]?.id || "";
                            }

                            return currentCrisis.choices.map((choice, index) => {
                              const choiceLetter = String.fromCharCode(65 + index); // A, B, C...
                              const analysis = choiceAnalyses.find(a => a.id === choice.id);
                              const isRecommended = choice.id === bestChoiceId;
                              const isDangerous = analysis?.willCauseGameOver;

                              return (
                                <div key={choice.id} className={`${index > 0 ? "pt-2.5" : ""} space-y-1`}>
                                  <div className="font-bold text-white flex items-center gap-1.5 flex-wrap">
                                    <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-white/10 text-[10px] text-neutral-300 font-mono shrink-0">
                                      {choiceLetter}
                                    </span>
                                    <span className="truncate max-w-[150px] sm:max-w-xs">{choice.text}</span>
                                    {isRecommended && (
                                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[8px] uppercase tracking-wider font-extrabold animate-pulse">
                                        ⭐ Khuyên chọn
                                      </span>
                                    )}
                                    {isDangerous && (
                                      <span className="px-1.5 py-0.5 rounded bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[8px] uppercase tracking-wider font-extrabold">
                                        🚨 Nguy cấp
                                      </span>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] text-neutral-400 font-mono pl-5">
                                    <span className={choice.immediateImpact.profit >= 0 ? "text-emerald-400" : "text-rose-400"}>
                                      Lợi nhuận: {choice.immediateImpact.profit >= 0 ? "+" : ""}{choice.immediateImpact.profit}%
                                    </span>
                                    <span className={choice.immediateImpact.competitiveness >= 0 ? "text-emerald-400" : "text-rose-400"}>
                                      Cạnh tranh: {choice.immediateImpact.competitiveness >= 0 ? "+" : ""}{choice.immediateImpact.competitiveness}%
                                    </span>
                                    <span className={choice.immediateImpact.socialResponsibility >= 0 ? "text-emerald-400" : "text-rose-400"}>
                                      Trách nhiệm XH: {choice.immediateImpact.socialResponsibility >= 0 ? "+" : ""}{choice.immediateImpact.socialResponsibility}%
                                    </span>
                                    <span className={choice.immediateImpact.workerMorale >= 0 ? "text-emerald-400" : "text-rose-400"}>
                                      Tinh thần: {choice.immediateImpact.workerMorale >= 0 ? "+" : ""}{choice.immediateImpact.workerMorale}%
                                    </span>
                                  </div>
                                  {choice.karmaEvent && (
                                    <div className="pl-5 text-[9px] text-amber-400 leading-normal border-l border-amber-500/20 ml-1.5 mt-0.5 font-mono">
                                      ⚠️ Karma (sau {currentCrisis.karmaDelay} lượt): {choice.karmaEvent.text}
                                    </div>
                                  )}
                                </div>
                              );
                            });
                          })()}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3.5 mt-2 flex-1 justify-center">
                  {currentCrisis.choices.map((choice) => (
                    <button
                      key={choice.id}
                      onClick={() => handleChoice(choice)}
                      className="w-full text-left p-4 rounded-xl border border-white/5 bg-neutral-950/40 hover:bg-white/5 hover:border-white/15 transition-all text-[18px] font-semibold text-neutral-200 hover:text-white leading-relaxed group flex items-start gap-2.5"
                    >
                      <span className="w-6 h-6 inline-flex items-center justify-center rounded bg-white/5 border border-white/10 text-sm text-neutral-400 group-hover:bg-white/10 group-hover:text-white transition-colors shrink-0">
                        {choice.id.split("-").pop()?.toUpperCase()}
                      </span>
                      <span className="flex-1">{choice.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
