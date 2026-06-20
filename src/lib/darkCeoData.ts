import type { Department, CrisisMessage } from "./darkCeoTypes";

export const DARK_CEO_DEPARTMENTS: Department[] = [
  { id: "board", name: "Hội đồng Cổ đông", avatar: "💼", color: "text-amber-400" },
  { id: "hr", name: "Phòng Nhân sự", avatar: "👥", color: "text-blue-400" },
  { id: "union", name: "Ban Công đoàn", avatar: "✊", color: "text-red-400" },
  { id: "pr", name: "Truyền thông & Môi trường", avatar: "📣", color: "text-emerald-400" }
];

export const DARK_CEO_CRISES: CrisisMessage[] = [
  {
    id: "crisis-1",
    departmentId: "board",
    text: "⚠️ @CEO: Cổ đông yêu cầu tăng trưởng lợi nhuận quý này thêm 15% để giữ giá cổ phiếu, bất chấp khó khăn chung của nền kinh tế. Hãy đưa ra giải pháp cắt giảm chi phí ngay lập tức!",
    timestamp: "09:00",
    isUrgent: true,
    karmaDelay: 2,
    choices: [
      {
        id: "choice-1a",
        text: "Cắt giảm 20% nhân sự và tăng gấp đôi giờ làm ngoài giờ của nhân viên còn lại.",
        immediateImpact: { profit: 25, competitiveness: 10, socialResponsibility: -20, workerMorale: -30 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Kiệt sức hàng loạt! Công nhân đình công tập thể phản đối bóc lột sức lao động và ép tăng ca. Dây chuyền sản xuất đóng băng khiến đối tác hủy hợp đồng hàng loạt.",
          delayedImpact: { profit: -35, competitiveness: -20, socialResponsibility: 10, workerMorale: 15 }
        }
      },
      {
        id: "choice-1b",
        text: "Thay thế 30% thợ thủ công lành nghề bằng dây chuyền tự động hóa giá rẻ.",
        immediateImpact: { profit: 15, competitiveness: 20, socialResponsibility: -15, workerMorale: -15 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Lỗi hệ thống! Robot giá rẻ liên tục gặp sự cố kỹ thuật do thiếu thợ lành nghề bảo trì, làm hỏng hàng loạt nguyên liệu đầu vào.",
          delayedImpact: { profit: -20, competitiveness: -15, socialResponsibility: -5, workerMorale: -5 }
        }
      },
      {
        id: "choice-1c",
        text: "Từ chối cắt giảm nhân sự. Chấp nhận lợi nhuận thấp và đầu tư đào tạo nâng cao tay nghề.",
        immediateImpact: { profit: -15, competitiveness: 5, socialResponsibility: 20, workerMorale: 25 }
      }
    ]
  },
  {
    id: "crisis-2",
    departmentId: "union",
    text: "✊ @CEO: Công nhân tại phân xưởng luyện kim phản ánh nhiệt độ và nồng độ khí thải vượt ngưỡng an toàn. Họ yêu cầu dừng máy để lắp đặt hệ thống lọc khí mới trị giá 2 tỷ đồng.",
    timestamp: "11:15",
    isUrgent: true,
    karmaDelay: 2,
    choices: [
      {
        id: "choice-2a",
        text: "Lắp đặt hệ thống lọc khí xịn đạt tiêu chuẩn quốc tế ngay lập tức.",
        immediateImpact: { profit: -25, competitiveness: -5, socialResponsibility: 30, workerMorale: 25 }
      },
      {
        id: "choice-2b",
        text: "Trì hoãn. Chỉ trang bị khẩu trang và quạt thông gió giá rẻ để đối phó với thanh tra lao động.",
        immediateImpact: { profit: 5, competitiveness: 5, socialResponsibility: -25, workerMorale: -20 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Khí độc rò rỉ! Vụ việc tai nạn lao động nghiêm trọng xảy ra, báo chí phanh phui bê bối che giấu sai phạm khiến thương hiệu bị tẩy chay nặng nề.",
          delayedImpact: { profit: -40, competitiveness: -10, socialResponsibility: -30, workerMorale: -15 }
        }
      },
      {
        id: "choice-2c",
        text: "Tăng phụ cấp độc hại thêm 10% lương thay vì lắp máy lọc khí để xoa dịu công nhân.",
        immediateImpact: { profit: -10, competitiveness: 0, socialResponsibility: -5, workerMorale: 10 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Tích lũy về Lượng phát tác! Bệnh nghề nghiệp gia tăng, tỷ lệ công nhân xin nghỉ ốm tăng vọt khiến năng suất nhà máy sụt giảm nghiêm trọng.",
          delayedImpact: { profit: -20, competitiveness: -10, socialResponsibility: -15, workerMorale: -20 }
        }
      }
    ]
  },
  {
    id: "crisis-3",
    departmentId: "pr",
    text: "📣 @CEO: Phát hiện đối thủ cạnh tranh vừa tung ra dòng sản phẩm tương đương có giá rẻ hơn 30% nhờ xả thải trực tiếp ra nguồn nước công cộng bất hợp pháp để trốn thuế môi trường.",
    timestamp: "14:30",
    isUrgent: false,
    karmaDelay: 2,
    choices: [
      {
        id: "choice-3a",
        text: "Chấp nhận giảm biên lợi nhuận, tung chiến dịch truyền thông xanh tẩy chay hành vi của đối thủ.",
        immediateImpact: { profit: -15, competitiveness: -10, socialResponsibility: 25, workerMorale: 15 }
      },
      {
        id: "choice-3b",
        text: "Ép các nhà cung ứng nguyên liệu trong nước giảm giá 20% nếu không sẽ hủy hợp đồng.",
        immediateImpact: { profit: 15, competitiveness: 20, socialResponsibility: -15, workerMorale: -5 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Chuỗi cung ứng đứt gãy! Các nhà cung ứng nhỏ trong nước đồng loạt phá sản, công ty buộc phải mua nguyên liệu nhập khẩu giá cao gấp đôi.",
          delayedImpact: { profit: -30, competitiveness: -25, socialResponsibility: -10, workerMorale: -5 }
        }
      },
      {
        id: "choice-3c",
        text: "Cắt giảm tối đa quỹ phúc lợi, tiền ăn trưa và tiền xe đưa đón công nhân để giảm giá bán.",
        immediateImpact: { profit: 20, competitiveness: 15, socialResponsibility: -10, workerMorale: -35 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Đổ vỡ tinh thần! Tỷ lệ nghỉ việc đạt kỷ lục 40%, nhân sự chất lượng cao đầu quân cho chính đối thủ cạnh tranh.",
          delayedImpact: { profit: -25, competitiveness: -20, socialResponsibility: -5, workerMorale: -15 }
        }
      }
    ]
  }
];
