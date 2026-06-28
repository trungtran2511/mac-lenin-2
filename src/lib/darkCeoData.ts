import type { Department, CrisisMessage } from "./darkCeoTypes";

export const DARK_CEO_DEPARTMENTS: Department[] = [
  { id: "board", name: "Hội đồng Cổ đông", avatar: "💼", color: "text-amber-400" },
  { id: "hr", name: "Phòng Nhân sự", avatar: "👥", color: "text-blue-400" },
  { id: "union", name: "Ban Công đoàn", avatar: "✊", color: "text-red-400" },
  { id: "pr", name: "Truyền thông & Môi trường", avatar: "📣", color: "text-emerald-400" },
  { id: "rd", name: "R&D & Chiến lược", avatar: "🔬", color: "text-purple-400" }
];

export const DARK_CEO_CRISES: CrisisMessage[] = [
  // ── NHÓM A: CỔ ĐÔNG & TÀI CHÍNH ──
  {
    id: "a1",
    departmentId: "board",
    text: "💼 @CEO: Cổ đông yêu cầu tăng lợi nhuận quý này thêm 15% để giữ giá cổ phiếu, bất chấp khó khăn chung của nền kinh tế. Hãy đưa ra giải pháp cắt giảm chi phí ngay lập tức!",
    timestamp: "09:00",
    isUrgent: true,
    karmaDelay: 2,
    choices: [
      {
        id: "a1-1",
        text: "Cắt 15% nhân sự và tăng ca cho người còn lại.",
        immediateImpact: { profit: 18, competitiveness: 8, socialResponsibility: -15, workerMorale: -20 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Kiệt sức hàng loạt! Công nhân đình công phản đối bóc lột — dây chuyền sản xuất ngừng trệ 3 ngày.",
          delayedImpact: { profit: -15, competitiveness: -10, socialResponsibility: 5, workerMorale: 10 }
        }
      },
      {
        id: "a1-2",
        text: "Tự động hoá một phần dây chuyền, giảm nhân công phổ thông.",
        immediateImpact: { profit: 10, competitiveness: 15, socialResponsibility: -10, workerMorale: -10 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Lỗi kỹ thuật! Robot giá rẻ liên tục hỏng hóc do thiếu thợ bảo trì lành nghề.",
          delayedImpact: { profit: -12, competitiveness: -8, socialResponsibility: 0, workerMorale: 0 }
        }
      },
      {
        id: "a1-3",
        text: "Từ chối cắt giảm nhân sự — đầu tư đào tạo nâng cao năng suất dài hạn.",
        immediateImpact: { profit: -10, competitiveness: 5, socialResponsibility: 15, workerMorale: 20 }
      }
    ]
  },
  {
    id: "a2",
    departmentId: "board",
    text: "💼 @CEO: Quỹ FDI nước ngoài muốn rót 50 tỷ nhưng yêu cầu chuyển 60% nhà máy ra nước ngoài để thuê nhân công rẻ hơn. Đây là cơ hội lớn — nhưng cũng là bài toán đạo đức.",
    timestamp: "10:30",
    isUrgent: false,
    karmaDelay: 3,
    choices: [
      {
        id: "a2-1",
        text: "Chấp nhận toàn bộ điều khoản FDI, chuyển nhà máy ra nước ngoài.",
        immediateImpact: { profit: 22, competitiveness: 18, socialResponsibility: -22, workerMorale: -25 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Phong trào tẩy chay! Người tiêu dùng trong nước từ chối sản phẩm 'bỏ rơi công nhân Việt'.",
          delayedImpact: { profit: -18, competitiveness: -15, socialResponsibility: 0, workerMorale: 0 }
        }
      },
      {
        id: "a2-2",
        text: "Đàm phán chỉ chuyển 20% sang nước ngoài, giữ phần cốt lõi trong nước.",
        immediateImpact: { profit: 10, competitiveness: 10, socialResponsibility: -5, workerMorale: -5 }
      },
      {
        id: "a2-3",
        text: "Từ chối FDI, tìm nguồn vốn nội địa và giữ toàn bộ nhà máy.",
        immediateImpact: { profit: -15, competitiveness: -5, socialResponsibility: 20, workerMorale: 12 }
      }
    ]
  },
  {
    id: "a3",
    departmentId: "board",
    text: "💼 @CEO: Kiểm toán nội bộ phát hiện 3 phòng ban chi vượt ngân sách tổng 40%. Cần xử lý ngay trước khi cổ đông họp vào cuối tháng.",
    timestamp: "11:00",
    isUrgent: true,
    karmaDelay: 2,
    choices: [
      {
        id: "a3-1",
        text: "Cắt ngay toàn bộ ngân sách dư, kỷ luật trưởng phòng vi phạm.",
        immediateImpact: { profit: 15, competitiveness: 5, socialResponsibility: 5, workerMorale: -22 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Nhân sự giỏi nghỉ hàng loạt! Không khí làm việc trở nên ngột ngạt, 5 nhân viên chủ chốt xin nghỉ.",
          delayedImpact: { profit: -10, competitiveness: -12, socialResponsibility: 0, workerMorale: 0 }
        }
      },
      {
        id: "a3-2",
        text: "Điều tra nguyên nhân, xử lý người vi phạm, giữ ngân sách hoạt động bình thường.",
        immediateImpact: { profit: -5, competitiveness: 0, socialResponsibility: 10, workerMorale: 8 }
      },
      {
        id: "a3-3",
        text: "Bỏ qua — để các phòng ban tự cân đối trong quý tới.",
        immediateImpact: { profit: -8, competitiveness: -8, socialResponsibility: -10, workerMorale: 0 }
      }
    ]
  },
  {
    id: "a4",
    departmentId: "board",
    text: "💼 @CEO: Dòng tiền âm! Kho quỹ chỉ còn đủ chi trả lương thêm 2 tháng. Cần huy động vốn khẩn trong 48 giờ.",
    timestamp: "08:45",
    isUrgent: true,
    karmaDelay: 2,
    choices: [
      {
        id: "a4-1",
        text: "Vay ngân hàng lãi suất cao — nhanh nhưng tốn kém.",
        immediateImpact: { profit: -18, competitiveness: 10, socialResponsibility: 0, workerMorale: 5 }
      },
      {
        id: "a4-2",
        text: "Bán bớt máy móc thiết bị cũ để huy động tiền mặt.",
        immediateImpact: { profit: 12, competitiveness: -18, socialResponsibility: 0, workerMorale: -5 }
      },
      {
        id: "a4-3",
        text: "Kêu gọi nhân viên 'chia sẻ khó khăn' — giảm lương tạm thời 15%.",
        immediateImpact: { profit: 8, competitiveness: 0, socialResponsibility: -8, workerMorale: -20 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Mất lòng tin! Nhân viên không nhận được bất kỳ đảm bảo nào về việc hoàn trả lương — tinh thần chạm đáy.",
          delayedImpact: { profit: -8, competitiveness: -5, socialResponsibility: 0, workerMorale: -10 }
        }
      }
    ]
  },
  {
    id: "a5",
    departmentId: "board",
    text: "💼 @CEO: Tập đoàn lớn đề nghị mua lại 30% cổ phần để trở thành đối tác chiến lược, kèm cam kết hỗ trợ công nghệ và phân phối.",
    timestamp: "15:00",
    isUrgent: false,
    choices: [
      {
        id: "a5-1",
        text: "Chấp nhận bán 30% — nhận vốn và công nghệ ngay.",
        immediateImpact: { profit: 20, competitiveness: 18, socialResponsibility: 0, workerMorale: -5 }
      },
      {
        id: "a5-2",
        text: "Đàm phán chỉ bán 15%, giữ quyền kiểm soát.",
        immediateImpact: { profit: 10, competitiveness: 10, socialResponsibility: 0, workerMorale: 0 }
      },
      {
        id: "a5-3",
        text: "Từ chối — giữ hoàn toàn độc lập, tự xoay sở.",
        immediateImpact: { profit: -10, competitiveness: -8, socialResponsibility: 10, workerMorale: 15 }
      }
    ]
  },

  // ── NHÓM B: NHÂN SỰ & LAO ĐỘNG ──
  {
    id: "b1",
    departmentId: "union",
    text: "✊ @CEO: Công nhân tại phân xưởng bị tai nạn do thiếu thiết bị bảo hộ đạt chuẩn. Gia đình nạn nhân đang chờ quyết định xử lý của ban lãnh đạo.",
    timestamp: "11:15",
    isUrgent: true,
    karmaDelay: 2,
    choices: [
      {
        id: "b1-1",
        text: "Đền bù đầy đủ + nâng cấp toàn bộ thiết bị bảo hộ ngay lập tức.",
        immediateImpact: { profit: -20, competitiveness: -5, socialResponsibility: 25, workerMorale: 20 }
      },
      {
        id: "b1-2",
        text: "Đền bù tối thiểu theo quy định, mua thêm bảo hộ cơ bản.",
        immediateImpact: { profit: -8, competitiveness: 0, socialResponsibility: 5, workerMorale: 5 }
      },
      {
        id: "b1-3",
        text: "Thương lượng kín với gia đình nạn nhân để tránh báo chí.",
        immediateImpact: { profit: 5, competitiveness: 0, socialResponsibility: -22, workerMorale: -15 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Báo chí điều tra! Câu chuyện bị rò rỉ — thương hiệu bị tẩy chay nặng nề trên mạng xã hội.",
          delayedImpact: { profit: -18, competitiveness: -15, socialResponsibility: -10, workerMorale: 0 }
        }
      }
    ]
  },
  {
    id: "b2",
    departmentId: "union",
    text: "✊ @CEO: Công nhân đòi tăng lương 10% theo mức lạm phát. Đã 2 năm chưa có đợt tăng lương nào. Ban công đoàn cảnh báo sẽ đình công nếu không có phản hồi trong 48h.",
    timestamp: "09:30",
    isUrgent: true,
    karmaDelay: 2,
    choices: [
      {
        id: "b2-1",
        text: "Tăng lương 10% ngay — đúng như yêu cầu.",
        immediateImpact: { profit: -15, competitiveness: 0, socialResponsibility: 10, workerMorale: 25 }
      },
      {
        id: "b2-2",
        text: "Tăng 5% lương + thêm phụ cấp ăn trưa và đi lại.",
        immediateImpact: { profit: -8, competitiveness: 0, socialResponsibility: 5, workerMorale: 15 }
      },
      {
        id: "b2-3",
        text: "Từ chối, hứa xem xét lại vào cuối năm.",
        immediateImpact: { profit: 5, competitiveness: 0, socialResponsibility: -8, workerMorale: -22 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Đình công 3 ngày! Toàn bộ dây chuyền sản xuất ngừng hoạt động — đối tác huỷ đơn hàng khẩn.",
          delayedImpact: { profit: -18, competitiveness: -10, socialResponsibility: 0, workerMorale: 0 }
        }
      }
    ]
  },
  {
    id: "b3",
    departmentId: "hr",
    text: "👥 @CEO: Cần tuyển Phó CEO — có hai ứng viên: (A) Trưởng phòng nội bộ 10 năm kinh nghiệm, lương vừa phải. (B) CEO từ tập đoàn nước ngoài, tài năng nhưng lương gấp 3 lần.",
    timestamp: "14:00",
    isUrgent: false,
    choices: [
      {
        id: "b3-1",
        text: "Chọn ứng viên nội bộ — thưởng thêm cổ phần để giữ chân.",
        immediateImpact: { profit: -5, competitiveness: -5, socialResponsibility: 5, workerMorale: 20 }
      },
      {
        id: "b3-2",
        text: "Chọn ứng viên ngoài — chấp nhận chi lương cao để lấy năng lực.",
        immediateImpact: { profit: -18, competitiveness: 20, socialResponsibility: 0, workerMorale: -10 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Xung đột văn hoá! CEO mới áp đặt phong cách quản lý hoàn toàn khác — nhân viên cũ phản ứng tiêu cực.",
          delayedImpact: { profit: -5, competitiveness: 0, socialResponsibility: 0, workerMorale: -12 }
        }
      },
      {
        id: "b3-3",
        text: "Giữ vị trí trống 3 tháng, CEO tự kiêm nhiệm thêm.",
        immediateImpact: { profit: 5, competitiveness: -10, socialResponsibility: 0, workerMorale: -8 }
      }
    ]
  },
  {
    id: "b4",
    departmentId: "hr",
    text: "👥 @CEO: Nhân viên văn phòng đề xuất chính sách làm việc hybrid (từ xa 3 ngày/tuần). Khảo sát nội bộ: 78% muốn hybrid. Ban quản lý cấp trung phản đối vì khó kiểm soát.",
    timestamp: "10:00",
    isUrgent: false,
    choices: [
      {
        id: "b4-1",
        text: "Chấp thuận hybrid 3 ngày/tuần cho toàn bộ văn phòng.",
        immediateImpact: { profit: -5, competitiveness: -5, socialResponsibility: 5, workerMorale: 22 }
      },
      {
        id: "b4-2",
        text: "Hybrid 2 ngày/tuần, áp dụng thí điểm 3 tháng rồi đánh giá.",
        immediateImpact: { profit: -2, competitiveness: 5, socialResponsibility: 5, workerMorale: 12 }
      },
      {
        id: "b4-3",
        text: "Từ chối — yêu cầu toàn thời gian văn phòng để đảm bảo năng suất.",
        immediateImpact: { profit: 5, competitiveness: 5, socialResponsibility: -5, workerMorale: -20 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Làn sóng nghỉ việc! 22% nhân sự trẻ tài năng rời đi trong tháng kế tiếp — công ty đối thủ hưởng lợi.",
          delayedImpact: { profit: -10, competitiveness: -15, socialResponsibility: 0, workerMorale: 0 }
        }
      }
    ]
  },
  {
    id: "b5",
    departmentId: "hr",
    text: "👥 @CEO: Hợp đồng bảo hiểm sức khoẻ nhóm hết hạn cuối tháng. Có 3 lựa chọn: gói cũ (giữ nguyên), gói mới cao cấp (đắt gấp đôi), hoặc chuyển sang tự đóng góp 50/50.",
    timestamp: "13:30",
    isUrgent: false,
    choices: [
      {
        id: "b5-1",
        text: "Nâng cấp gói bảo hiểm cao cấp — công ty chi trả 100%.",
        immediateImpact: { profit: -18, competitiveness: 0, socialResponsibility: 15, workerMorale: 22 }
      },
      {
        id: "b5-2",
        text: "Gia hạn gói cũ như hiện tại.",
        immediateImpact: { profit: -8, competitiveness: 0, socialResponsibility: 0, workerMorale: 5 }
      },
      {
        id: "b5-3",
        text: "Chuyển sang mô hình nhân viên tự đóng 50% chi phí bảo hiểm.",
        immediateImpact: { profit: 8, competitiveness: 0, socialResponsibility: -10, workerMorale: -20 }
      }
    ]
  },

  // ── NHÓM C: MÔI TRƯỜNG & XÃ HỘI ──
  {
    id: "c1",
    departmentId: "pr",
    text: "📣 @CEO: Đối thủ vừa tung sản phẩm tương đương giá rẻ hơn 30% nhờ xả thải lậu trốn thuế môi trường. Thị phần của chúng ta giảm 8% trong tháng qua.",
    timestamp: "14:30",
    isUrgent: false,
    karmaDelay: 2,
    choices: [
      {
        id: "c1-1",
        text: "Tố cáo đối thủ lên cơ quan chức năng + đẩy mạnh thương hiệu xanh.",
        immediateImpact: { profit: -10, competitiveness: -5, socialResponsibility: 20, workerMorale: 8 }
      },
      {
        id: "c1-2",
        text: "Âm thầm giảm tiêu chuẩn xả thải để cạnh tranh về giá.",
        immediateImpact: { profit: 15, competitiveness: 15, socialResponsibility: -25, workerMorale: -8 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Bị phát hiện! Thanh tra môi trường đột kiểm — công ty bị phạt nặng và đóng cửa sản xuất 2 tuần.",
          delayedImpact: { profit: -20, competitiveness: -18, socialResponsibility: -10, workerMorale: 0 }
        }
      },
      {
        id: "c1-3",
        text: "Cắt chi phí R&D tạm thời để hạ giá bán cạnh tranh.",
        immediateImpact: { profit: 5, competitiveness: 8, socialResponsibility: -5, workerMorale: -5 }
      }
    ]
  },
  {
    id: "c2",
    departmentId: "pr",
    text: "📣 @CEO: Đoàn thanh tra môi trường thông báo kiểm tra cơ sở sản xuất vào tuần tới. Phòng kỹ thuật báo cáo có 2 điểm vận hành chưa đạt chuẩn phát thải.",
    timestamp: "16:00",
    isUrgent: true,
    karmaDelay: 2,
    choices: [
      {
        id: "c2-1",
        text: "Dừng dây chuyền vi phạm ngay, khắc phục đầy đủ trước khi kiểm tra.",
        immediateImpact: { profit: -18, competitiveness: -5, socialResponsibility: 22, workerMorale: 10 }
      },
      {
        id: "c2-2",
        text: "Thuê chuyên gia 'làm đẹp hồ sơ' để qua mắt thanh tra.",
        immediateImpact: { profit: -8, competitiveness: 0, socialResponsibility: -12, workerMorale: -5 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Thanh tra phát hiện gian lận hồ sơ! Mức phạt tăng gấp 5 lần và bị đưa vào danh sách đen.",
          delayedImpact: { profit: -20, competitiveness: -12, socialResponsibility: -18, workerMorale: 0 }
        }
      },
      {
        id: "c2-3",
        text: "Chủ động báo cáo vi phạm và cam kết lộ trình khắc phục 3 tháng.",
        immediateImpact: { profit: -10, competitiveness: 0, socialResponsibility: 15, workerMorale: 8 }
      }
    ]
  },
  {
    id: "c3",
    departmentId: "pr",
    text: "📣 @CEO: Khách hàng lớn nhất (chiếm 35% doanh thu) yêu cầu công ty đạt chứng nhận ESG trong 6 tháng, nếu không sẽ chuyển sang nhà cung cấp khác.",
    timestamp: "11:00",
    isUrgent: true,
    choices: [
      {
        id: "c3-1",
        text: "Đầu tư đầy đủ để đạt chuẩn ESG thực sự trong 6 tháng.",
        immediateImpact: { profit: -22, competitiveness: 15, socialResponsibility: 25, workerMorale: 10 }
      },
      {
        id: "c3-2",
        text: "Đạt chuẩn ESG tối thiểu trên giấy tờ — chi phí thấp hơn.",
        immediateImpact: { profit: -8, competitiveness: 5, socialResponsibility: 5, workerMorale: 0 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Bị tố greenwashing! Báo cáo ESG giả bị phanh phui — khách hàng lớn lập tức chấm dứt hợp đồng.",
          delayedImpact: { profit: -20, competitiveness: -18, socialResponsibility: -15, workerMorale: 0 }
        }
      },
      {
        id: "c3-3",
        text: "Đàm phán xin thêm 12 tháng lộ trình, tặng thêm chiết khấu giữ chân.",
        immediateImpact: { profit: -5, competitiveness: -5, socialResponsibility: -5, workerMorale: 0 }
      }
    ]
  },
  {
    id: "c4",
    departmentId: "pr",
    text: "📣 @CEO: Chính phủ công bố chính sách ưu đãi thuế cho doanh nghiệp lắp điện mặt trời. Chi phí đầu tư lớn nhưng tiết kiệm đáng kể dài hạn và nâng hình ảnh thương hiệu.",
    timestamp: "09:00",
    isUrgent: false,
    choices: [
      {
        id: "c4-1",
        text: "Đầu tư lắp toàn bộ hệ thống năng lượng mặt trời cho nhà máy.",
        immediateImpact: { profit: -25, competitiveness: 8, socialResponsibility: 20, workerMorale: 10 }
      },
      {
        id: "c4-2",
        text: "Thí điểm lắp 30% nhà máy, đánh giá hiệu quả trước khi mở rộng.",
        immediateImpact: { profit: -10, competitiveness: 5, socialResponsibility: 8, workerMorale: 5 }
      },
      {
        id: "c4-3",
        text: "Chưa đầu tư vì chi phí vốn quá lớn so với ngân sách hiện tại.",
        immediateImpact: { profit: 0, competitiveness: -5, socialResponsibility: -5, workerMorale: 0 }
      }
    ]
  },

  // ── NHÓM D: THỊ TRƯỜNG & CHIẾN LƯỢC ──
  {
    id: "d1",
    departmentId: "rd",
    text: "🔬 @CEO: Sản phẩm mới đã sẵn sàng nhưng cần thêm 6 tháng kiểm tra an toàn. Tuy nhiên đối thủ sắp ra mắt sản phẩm tương tự — nếu ra sau sẽ mất lợi thế.",
    timestamp: "10:00",
    isUrgent: true,
    karmaDelay: 2,
    choices: [
      {
        id: "d1-1",
        text: "Ra mắt ngay, chấp nhận rủi ro kiểm tra chưa đầy đủ.",
        immediateImpact: { profit: 15, competitiveness: 22, socialResponsibility: -10, workerMorale: 5 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Phát hiện lỗi sản phẩm! Hàng chục ngàn đơn vị phải thu hồi — chi phí đền bù và uy tín thương hiệu bị thiệt hại nặng.",
          delayedImpact: { profit: -20, competitiveness: -20, socialResponsibility: -10, workerMorale: 0 }
        }
      },
      {
        id: "d1-2",
        text: "Ra mắt phiên bản beta kèm cảnh báo rõ ràng, thu thập phản hồi người dùng.",
        immediateImpact: { profit: 8, competitiveness: 12, socialResponsibility: -5, workerMorale: 0 }
      },
      {
        id: "d1-3",
        text: "Kiên nhẫn test đủ 6 tháng — uy tín quan trọng hơn tốc độ.",
        immediateImpact: { profit: -8, competitiveness: -10, socialResponsibility: 10, workerMorale: 8 }
      }
    ]
  },
  {
    id: "d2",
    departmentId: "rd",
    text: "🔬 @CEO: Cơ hội mở rộng sang thị trường Đông Nam Á — tiềm năng lớn nhưng cần đầu tư 80 tỷ và chấp nhận rủi ro văn hoá, pháp lý chưa rõ ràng.",
    timestamp: "15:30",
    isUrgent: false,
    karmaDelay: 3,
    choices: [
      {
        id: "d2-1",
        text: "Mở rộng toàn lực ngay lập tức.",
        immediateImpact: { profit: -22, competitiveness: 25, socialResponsibility: 5, workerMorale: -8 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Thất bại thị trường mới! Thiếu hiểu biết văn hoá địa phương — sản phẩm không được đón nhận, đốt 40 tỷ vô ích.",
          delayedImpact: { profit: -18, competitiveness: -12, socialResponsibility: 0, workerMorale: 0 }
        }
      },
      {
        id: "d2-2",
        text: "Hợp tác với đối tác địa phương để giảm rủi ro — chia sẻ lợi nhuận.",
        immediateImpact: { profit: -10, competitiveness: 15, socialResponsibility: 10, workerMorale: 5 }
      },
      {
        id: "d2-3",
        text: "Giữ thị trường nội địa, củng cố vị thế trước khi mở rộng.",
        immediateImpact: { profit: 5, competitiveness: -8, socialResponsibility: 5, workerMorale: 10 }
      }
    ]
  },
  {
    id: "d3",
    departmentId: "pr",
    text: "📣 @CEO: Một bài đăng viral trên mạng xã hội tố cáo sản phẩm của chúng ta kém chất lượng — thực tế 60% nội dung là sai sự thật. Lượt xem đã đạt 2 triệu trong 6 giờ.",
    timestamp: "22:00",
    isUrgent: true,
    karmaDelay: 2,
    choices: [
      {
        id: "d3-1",
        text: "Phản hồi công khai minh bạch, cung cấp bằng chứng và mời kiểm định độc lập.",
        immediateImpact: { profit: -5, competitiveness: -5, socialResponsibility: 15, workerMorale: 8 }
      },
      {
        id: "d3-2",
        text: "Thuê luật sư kiện người tung tin giả để làm gương.",
        immediateImpact: { profit: -10, competitiveness: -12, socialResponsibility: -8, workerMorale: -5 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Dư luận phản cảm! Việc kiện tụng bị cho là 'bịt miệng người tiêu dùng' — làn sóng tẩy chay mạnh hơn.",
          delayedImpact: { profit: -12, competitiveness: -15, socialResponsibility: -8, workerMorale: 0 }
        }
      },
      {
        id: "d3-3",
        text: "Im lặng chờ cơn bão qua — không phản hồi, tránh kéo dài chú ý.",
        immediateImpact: { profit: -8, competitiveness: -18, socialResponsibility: -10, workerMorale: -5 }
      }
    ]
  },
  {
    id: "d4",
    departmentId: "rd",
    text: "🔬 @CEO: Một startup công nghệ tiếp cận đề nghị hợp tác phát triển sản phẩm AI tích hợp vào dây chuyền. Chi phí phát triển chung thấp nhưng phải chia sẻ bí quyết kỹ thuật.",
    timestamp: "16:30",
    isUrgent: false,
    choices: [
      {
        id: "d4-1",
        text: "Hợp tác toàn diện — chia sẻ kỹ thuật để cùng phát triển nhanh.",
        immediateImpact: { profit: -8, competitiveness: 20, socialResponsibility: 5, workerMorale: 8 }
      },
      {
        id: "d4-2",
        text: "Hợp tác giới hạn — chỉ chia sẻ phần kỹ thuật không cốt lõi.",
        immediateImpact: { profit: -5, competitiveness: 10, socialResponsibility: 0, workerMorale: 5 }
      },
      {
        id: "d4-3",
        text: "Từ chối — tự phát triển AI nội bộ để bảo vệ bí quyết công nghệ.",
        immediateImpact: { profit: -20, competitiveness: -5, socialResponsibility: 5, workerMorale: 5 }
      }
    ]
  }
];
