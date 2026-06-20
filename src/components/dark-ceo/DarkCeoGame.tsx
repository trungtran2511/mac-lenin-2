import React, { useState, useEffect } from "react";
import { Sparkles, RotateCcw, AlertOctagon, CheckCircle2 } from "lucide-react";
import { DARK_CEO_DEPARTMENTS, DARK_CEO_CRISES } from "../../lib/darkCeoData";
import type { ChatEntry, KarmaTimer, CrisisMessage, CeoChoice } from "../../lib/darkCeoTypes";
import { CeoStatsBar } from "./CeoStatsBar";
import { SlackChatPanel } from "./SlackChatPanel";
import { KarmaAlert } from "./KarmaAlert";

export default function DarkCeoGame() {
  const maxTurns = 10;

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

  const [isTyping, setIsTyping] = useState(false);
  const [typingDeptName, setTypingDeptName] = useState("");

  const [activeKarmaAlert, setActiveKarmaAlert] = useState<{
    eventText: string;
    sourceChoiceText: string;
  } | null>(null);

  const [gameOver, setGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState("");
  const [gameWon, setGameWon] = useState(false);

  // Initialize first turn
  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
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
    loadCrisis(1, initialHistory);
  };

  const loadCrisis = (turn: number, history: ChatEntry[]) => {
    setIsTyping(true);
    // Cycle through author crises based on turn number
    const crisisIndex = (turn - 1) % DARK_CEO_CRISES.length;
    const baseCrisis = DARK_CEO_CRISES[crisisIndex];

    const dept = DARK_CEO_DEPARTMENTS.find((d) => d.id === baseCrisis.departmentId);
    setTypingDeptName(dept?.name || "Hệ thống");

    setTimeout(() => {
      setIsTyping(false);
      const newCrisis: CrisisMessage = {
        ...baseCrisis,
        id: `${baseCrisis.id}-turn-${turn}`,
        timestamp: `09:${15 * turn}`
      };

      setCurrentCrisis(newCrisis);
      setChatHistory((prev) => [
        ...prev,
        {
          type: "department",
          departmentId: newCrisis.departmentId,
          text: newCrisis.text,
          timestamp: newCrisis.timestamp
        }
      ]);
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
          loadCrisis(nextTurn, finalHistory);
        }
      }, 500);
    } else {
      // Load next crisis directly
      loadCrisis(nextTurn, updatedHistory);
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
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            👔 Giám Đốc Hắc Ám: Biện Chứng Sinh Tồn
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-light max-w-xl">
            Mọi sự vật hiện tượng đều vận động thông qua đấu tranh của các mặt đối lập. Hãy đóng vai CEO điều hành một doanh nghiệp tư bản trong môi trường định hướng XHCN, giữ thăng bằng giữa lợi nhuận và lợi ích tập thể.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-neutral-300">
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
        <div className="border border-red-500/20 bg-red-950/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 py-12">
          <div className="p-3 bg-red-500/20 rounded-full border border-red-500/30">
            <AlertOctagon className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-black text-white uppercase tracking-wider">PHÁ SẢN BIỆN CHỨNG (GAME OVER)</h3>
          <p className="text-sm text-neutral-300 max-w-md leading-relaxed font-light">{gameOverReason}</p>
          <button
            onClick={startGame}
            className="mt-2 flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/10 text-xs font-bold transition-all hover:scale-105 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Khởi động lại doanh nghiệp
          </button>
        </div>
      )}

      {/* Victory Screen */}
      {gameWon && (
        <div className="border border-emerald-500/20 bg-emerald-950/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 py-12">
          <div className="p-3 bg-emerald-500/20 rounded-full border border-emerald-500/30">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-black text-white uppercase tracking-wider">CEO KIỆT XUẤT (VICTORY)</h3>
          <p className="text-sm text-neutral-300 max-w-md leading-relaxed font-light">
            Chúc mừng! Bạn đã chèo lái doanh nghiệp vượt qua toàn bộ 10 lượt khủng hoảng, duy trì sự cân bằng biện chứng hoàn hảo giữa tích lũy thặng dư và phúc lợi xã hội định hướng XHCN.
          </p>
          <button
            onClick={startGame}
            className="mt-2 flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all hover:scale-105 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Chơi lượt mới
          </button>
        </div>
      )}

      {/* Active gameplay elements */}
      {!gameOver && !gameWon && (
        <div className="flex flex-col gap-6">
          {/* Slack chat window */}
          <SlackChatPanel chatHistory={chatHistory} isTyping={isTyping} typingDeptName={typingDeptName} />

          {/* Decision Box */}
          {currentCrisis && !isTyping && (
            <div className="bg-neutral-900/40 border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
              <span className="text-[10px] uppercase tracking-wider text-amber-400 font-extrabold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                Yêu cầu quyết định khẩn cấp
              </span>

              <div className="grid grid-cols-1 gap-2.5 mt-2">
                {currentCrisis.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoice(choice)}
                    className="w-full text-left p-3.5 rounded-xl border border-white/5 bg-neutral-950/40 hover:bg-white/5 hover:border-white/15 transition-all text-xs font-semibold text-neutral-200 hover:text-white leading-relaxed group"
                  >
                    <span className="w-5 h-5 inline-flex items-center justify-center rounded bg-white/5 border border-white/10 text-[10px] text-neutral-400 group-hover:bg-white/10 group-hover:text-white mr-2.5 transition-colors">
                      {choice.id.split("-").pop()?.toUpperCase()}
                    </span>
                    {choice.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
