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
    text: "💼 @CEO: Có quỹ FDI muốn rót 50 tỷ nhưng yêu cầu chuyển 60% nhà máy ra nước ngoài để thuê nhân công rẻ hơn. Đây là cơ hội lớn để có vốn nhưng cũng là bài toán đạo đức.",
    timestamp: "10:30",
    isUrgent: false,
    karmaDelay: 3,
    choices: [
      {
        id: "a2-1",
        text: "Chấp nhận toàn bộ điều khoản FDI, chuyển nhà máy ra nước ngoài.",
        immediateImpact: { profit: 25, competitiveness: 20, socialResponsibility: -25, workerMorale: -25 },
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
        immediateImpact: { profit: -15, competitiveness: -5, socialResponsibility: 20, workerMorale: 10 }
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
        immediateImpact: { profit: 15, competitiveness: 5, socialResponsibility: 5, workerMorale: -25 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Nhân sự giỏi nghỉ hàng loạt! Không khí làm việc trở nên ngột ngạt, các nhân viên chủ chốt xin nghỉ việc.",
          delayedImpact: { profit: 0, competitiveness: -15, socialResponsibility: 0, workerMorale: 0 }
        }
      },
      {
        id: "a3-2",
        text: "Điều tra nguyên nhân, xử lý người vi phạm, giữ ngân sách hoạt động bình thường.",
        immediateImpact: { profit: -5, competitiveness: 0, socialResponsibility: 10, workerMorale: 5 }
      },
      {
        id: "a3-3",
        text: "Bỏ qua — để các phòng ban tự cân đối trong quý tới.",
        immediateImpact: { profit: 0, competitiveness: -10, socialResponsibility: -10, workerMorale: 0 }
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
        immediateImpact: { profit: -20, competitiveness: 10, socialResponsibility: 0, workerMorale: 0 }
      },
      {
        id: "a4-2",
        text: "Bán bớt máy móc thiết bị cũ để huy động tiền mặt.",
        immediateImpact: { profit: 15, competitiveness: -20, socialResponsibility: 0, workerMorale: -5 }
      },
      {
        id: "a4-3",
        text: "Kêu gọi nhân viên 'chia sẻ khó khăn' — giảm lương tạm thời 15%.",
        immediateImpact: { profit: 5, competitiveness: 0, socialResponsibility: -5, workerMorale: -20 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Mất lòng tin! Nhân viên phản ứng dữ dội vì bị cắt giảm thu nhập đột ngột.",
          delayedImpact: { profit: 0, competitiveness: 0, socialResponsibility: 0, workerMorale: -10 }
        }
      }
    ]
  },
  {
    id: "a5",
    departmentId: "board",
    text: "💼 @CEO: Hội đồng quản trị cho rằng mô hình vận hành hiện tại quá cồng kềnh. McKinsey đề xuất tái cấu trúc toàn bộ công ty theo mô hình Agile để tối ưu hóa.",
    timestamp: "15:00",
    isUrgent: false,
    karmaDelay: 2,
    choices: [
      {
        id: "a5-1",
        text: "Triển khai tái cấu trúc Agile toàn diện ngay lập tức.",
        immediateImpact: { profit: -15, competitiveness: 25, socialResponsibility: 0, workerMorale: -15 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Hỗn loạn nội bộ! Việc chuyển đổi quá vội vã khiến các phòng ban chồng chéo nhiệm vụ, hiệu suất sụt giảm.",
          delayedImpact: { profit: 0, competitiveness: 0, socialResponsibility: 0, workerMorale: -10 }
        }
      },
      {
        id: "a5-2",
        text: "Chỉ thí điểm chuyển đổi Agile tại một phòng ban trước.",
        immediateImpact: { profit: -5, competitiveness: 10, socialResponsibility: 0, workerMorale: -5 }
      },
      {
        id: "a5-3",
        text: "Từ chối Agile, quyết định giữ nguyên mô hình cũ ổn định.",
        immediateImpact: { profit: -5, competitiveness: 0, socialResponsibility: 5, workerMorale: 5 }
      }
    ]
  },

  // ── NHÓM B: NHÂN SỰ & LAO ĐỘNG ──
  {
    id: "b1",
    departmentId: "union",
    text: "✊ @CEO: Công nhân tại phân xưởng bị tai nạn lao động nghiêm trọng do thiếu thiết bị bảo hộ đạt chuẩn. Ban công đoàn yêu cầu giải quyết thỏa đáng.",
    timestamp: "11:15",
    isUrgent: true,
    karmaDelay: 2,
    choices: [
      {
        id: "b1-1",
        text: "Đền bù đầy đủ + nâng cấp toàn bộ thiết bị bảo hộ ngay lập tức.",
        immediateImpact: { profit: -20, competitiveness: 0, socialResponsibility: 25, workerMorale: 20 }
      },
      {
        id: "b1-2",
        text: "Đền bù tối thiểu theo quy định, mua thêm bảo hộ cơ bản.",
        immediateImpact: { profit: -8, competitiveness: 0, socialResponsibility: 5, workerMorale: 5 }
      },
      {
        id: "b1-3",
        text: "Thương lượng kín với gia đình nạn nhân để che giấu truyền thông.",
        immediateImpact: { profit: 5, competitiveness: 0, socialResponsibility: -25, workerMorale: -15 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Báo chí phanh phui! Vụ tai nạn bị rò rỉ ra ngoài, công ty bị xã hội lên án dữ dội.",
          delayedImpact: { profit: 0, competitiveness: -15, socialResponsibility: -20, workerMorale: 0 }
        }
      }
    ]
  },
  {
    id: "b2",
    departmentId: "union",
    text: "✊ @CEO: Công nhân đòi tăng lương 10% theo mức lạm phát sau 2 năm không đổi. Công đoàn cảnh báo sẽ bùng nổ đình công nếu bị từ chối.",
    timestamp: "09:30",
    isUrgent: true,
    karmaDelay: 2,
    choices: [
      {
        id: "b2-1",
        text: "Tăng lương 10% ngay lập tức cho toàn thể công nhân.",
        immediateImpact: { profit: -15, competitiveness: 0, socialResponsibility: 10, workerMorale: 25 }
      },
      {
        id: "b2-2",
        text: "Tăng lương 5% kèm bổ sung phúc lợi hiện vật.",
        immediateImpact: { profit: -8, competitiveness: 0, socialResponsibility: 5, workerMorale: 15 }
      },
      {
        id: "b2-3",
        text: "Từ chối đề xuất, hứa sẽ xem xét vào cuối năm tài chính.",
        immediateImpact: { profit: 5, competitiveness: 0, socialResponsibility: -10, workerMorale: -25 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Đình công diện rộng! Nhà máy tê liệt 3 ngày liên tục, trễ hạn hàng loạt đơn hàng lớn.",
          delayedImpact: { profit: -20, competitiveness: -10, socialResponsibility: 0, workerMorale: 0 }
        }
      }
    ]
  },
  {
    id: "b3",
    departmentId: "hr",
    text: "👥 @CEO: Vị trí Phó CEO đang trống. Phòng nhân sự đề xuất hai ứng viên: Một trưởng phòng nội bộ hiểu việc hoặc một chuyên gia từ tập đoàn lớn với mức lương gấp 3.",
    timestamp: "14:00",
    isUrgent: false,
    karmaDelay: 2,
    choices: [
      {
        id: "b3-1",
        text: "Chọn ứng viên nội bộ có thâm niên để thúc đẩy lòng trung thành.",
        immediateImpact: { profit: -5, competitiveness: -5, socialResponsibility: 0, workerMorale: 20 }
      },
      {
        id: "b3-2",
        text: "Tuyển ứng viên ngoài lương cao để cải tổ năng lực cạnh tranh.",
        immediateImpact: { profit: -20, competitiveness: 20, socialResponsibility: 0, workerMorale: -10 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Xung đột văn hóa! Lối quản lý áp đặt của Phó CEO mới khiến đội ngũ nhân sự lâu năm bất mãn.",
          delayedImpact: { profit: 0, competitiveness: 0, socialResponsibility: 0, workerMorale: -10 }
        }
      },
      {
        id: "b3-3",
        text: "Không tuyển ai, CEO tự kiêm nhiệm thêm công việc.",
        immediateImpact: { profit: 5, competitiveness: -10, socialResponsibility: 0, workerMorale: -5 }
      }
    ]
  },
  {
    id: "b4",
    departmentId: "hr",
    text: "👥 @CEO: Nhân viên đề xuất chính sách làm việc từ xa (Work From Home) 3 ngày/tuần. Ban quản lý lo ngại khó kiểm soát hiệu quả công việc.",
    timestamp: "10:00",
    isUrgent: false,
    karmaDelay: 2,
    choices: [
      {
        id: "b4-1",
        text: "Chấp thuận hoàn toàn đề xuất làm việc từ xa 3 ngày/tuần.",
        immediateImpact: { profit: -5, competitiveness: -5, socialResponsibility: 0, workerMorale: 25 }
      },
      {
        id: "b4-2",
        text: "Áp dụng mô hình Hybrid 2 ngày/tuần và theo dõi kết quả.",
        immediateImpact: { profit: 0, competitiveness: 5, socialResponsibility: 0, workerMorale: 12 }
      },
      {
        id: "b4-3",
        text: "Từ chối, yêu cầu toàn bộ nhân viên có mặt tại văn phòng.",
        immediateImpact: { profit: 0, competitiveness: 5, socialResponsibility: 0, workerMorale: -20 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Nhân sự chảy máu! Nhiều nhân viên trẻ giỏi đồng loạt nộp đơn nghỉ việc sang công ty đối thủ.",
          delayedImpact: { profit: 0, competitiveness: -15, socialResponsibility: 0, workerMorale: 0 }
        }
      }
    ]
  },
  {
    id: "b5",
    departmentId: "hr",
    text: "👥 @CEO: Hợp đồng bảo hiểm sức khỏe cho nhân viên chuẩn bị hết hạn. Chúng ta nên gia hạn gói cũ, nâng cấp gói tốt hơn hay yêu cầu nhân viên đóng góp 50%?",
    timestamp: "13:30",
    isUrgent: false,
    choices: [
      {
        id: "b5-1",
        text: "Nâng cấp lên gói bảo hiểm sức khỏe cao cấp toàn diện.",
        immediateImpact: { profit: -18, competitiveness: 0, socialResponsibility: 15, workerMorale: 25 }
      },
      {
        id: "b5-2",
        text: "Gia hạn gói bảo hiểm cũ như trước đây.",
        immediateImpact: { profit: -8, competitiveness: 0, socialResponsibility: 0, workerMorale: 5 }
      },
      {
        id: "b5-3",
        text: "Yêu cầu nhân viên tự đóng góp 50% chi phí gói bảo hiểm.",
        immediateImpact: { profit: 8, competitiveness: 0, socialResponsibility: -10, workerMorale: -20 }
      }
    ]
  },

  // ── NHÓM C: MÔI TRƯỜNG & XÃ HỘI ──
  {
    id: "c1",
    departmentId: "pr",
    text: "📣 @CEO: Đối thủ cạnh tranh xả thải trốn thuế giúp giảm giá bán 30%. Sức ép lên doanh số của chúng ta đang vô cùng lớn.",
    timestamp: "14:30",
    isUrgent: false,
    karmaDelay: 2,
    choices: [
      {
        id: "c1-1",
        text: "Tố cáo đối thủ lên cơ quan quản lý và truyền thông thương hiệu xanh.",
        immediateImpact: { profit: -10, competitiveness: -5, socialResponsibility: 20, workerMorale: 0 }
      },
      {
        id: "c1-2",
        text: "Âm thầm cắt giảm tiêu chuẩn xả thải để hạ giá thành cạnh tranh.",
        immediateImpact: { profit: 15, competitiveness: 15, socialResponsibility: -25, workerMorale: -10 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Bị cơ quan chức năng phát hiện hành vi xả thải trái phép.",
          delayedImpact: { profit: 0, competitiveness: -20, socialResponsibility: -25, workerMorale: 0 }
        }
      },
      {
        id: "c1-3",
        text: "Hạ giá bán bằng cách cắt giảm chi phí nghiên cứu (R&D).",
        immediateImpact: { profit: 5, competitiveness: 10, socialResponsibility: -5, workerMorale: 0 }
      }
    ]
  },
  {
    id: "c2",
    departmentId: "pr",
    text: "📣 @CEO: Đoàn kiểm tra liên ngành thông báo sẽ thanh tra môi trường nhà máy vào tuần sau. Hệ thống xử lý khí thải hiện tại đang có lỗi kỹ thuật nhỏ.",
    timestamp: "16:00",
    isUrgent: true,
    karmaDelay: 2,
    choices: [
      {
        id: "c2-1",
        text: "Tạm dừng sản xuất dây chuyền lỗi để sửa chữa triệt để ngay lập tức.",
        immediateImpact: { profit: -20, competitiveness: 0, socialResponsibility: 25, workerMorale: 10 }
      },
      {
        id: "c2-2",
        text: "Thuê dịch vụ bên ngoài để 'làm đẹp' hồ sơ số liệu trước đoàn kiểm tra.",
        immediateImpact: { profit: -10, competitiveness: 0, socialResponsibility: -10, workerMorale: 0 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Phát hiện gian lận! Đoàn thanh tra phát hiện hồ sơ ngụy tạo, phạt kịch khung.",
          delayedImpact: { profit: 0, competitiveness: 0, socialResponsibility: -20, workerMorale: 0 }
        }
      },
      {
        id: "c2-3",
        text: "Chủ động báo cáo sự cố kỹ thuật và xin cam kết lộ trình sửa chữa.",
        immediateImpact: { profit: -10, competitiveness: 0, socialResponsibility: 15, workerMorale: 5 }
      }
    ]
  },
  {
    id: "c3",
    departmentId: "pr",
    text: "📣 @CEO: Khách hàng lớn nhất của công ty (chiếm 35% doanh số) yêu cầu chúng ta đạt chứng chỉ ESG xanh trong vòng 6 tháng tới.",
    timestamp: "11:00",
    isUrgent: true,
    karmaDelay: 2,
    choices: [
      {
        id: "c3-1",
        text: "Đầu tư ngân sách lớn để cải tổ đạt chuẩn ESG thực chất.",
        immediateImpact: { profit: -25, competitiveness: 15, socialResponsibility: 25, workerMorale: 10 }
      },
      {
        id: "c3-2",
        text: "Lách luật bằng cách mua chứng chỉ giấy tờ danh nghĩa để đối phó.",
        immediateImpact: { profit: -10, competitiveness: 5, socialResponsibility: 5, workerMorale: 0 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Bê bối Greenwashing! Công ty bị bóc phốt ngụy tạo chứng chỉ ESG, đối tác hủy giao kèo.",
          delayedImpact: { profit: 0, competitiveness: -15, socialResponsibility: -20, workerMorale: 0 }
        }
      },
      {
        id: "c3-3",
        text: "Thương thảo xin gia hạn lộ trình thực hiện thêm 2 năm.",
        immediateImpact: { profit: -5, competitiveness: -5, socialResponsibility: -5, workerMorale: 0 }
      }
    ]
  },
  {
    id: "c4",
    departmentId: "pr",
    text: "📣 @CEO: Có đề xuất lắp đặt hệ thống pin mặt trời cho toàn bộ mái nhà xưởng. Chi phí ban đầu rất lớn nhưng sẽ giảm tiền điện lâu dài.",
    timestamp: "09:00",
    isUrgent: false,
    karmaDelay: 3,
    choices: [
      {
        id: "c4-1",
        text: "Phê duyệt đầu tư lắp đặt hệ thống pin mặt trời toàn bộ nhà xưởng.",
        immediateImpact: { profit: -25, competitiveness: 10, socialResponsibility: 20, workerMorale: 10 },
        karmaEvent: {
          text: "⚡ PHẢN HỒI BIỆN CHỨNG: Tiết kiệm năng lượng! Hệ thống pin mặt trời đi vào hoạt động ổn định, giúp giảm đáng kể chi phí tiền điện.",
          delayedImpact: { profit: 15, competitiveness: 0, socialResponsibility: 0, workerMorale: 0 }
        }
      },
      {
        id: "c4-2",
        text: "Chỉ thí điểm lắp đặt trên 30% diện tích nhà xưởng.",
        immediateImpact: { profit: -12, competitiveness: 5, socialResponsibility: 8, workerMorale: 5 }
      },
      {
        id: "c4-3",
        text: "Từ chối đầu tư vì chi phí cơ hội của dòng vốn quá cao.",
        immediateImpact: { profit: 0, competitiveness: 0, socialResponsibility: -5, workerMorale: 0 }
      }
    ]
  },

  // ── NHÓM D: THỊ TRƯỜNG & CHIẾN LƯỢC ──
  {
    id: "d1",
    departmentId: "rd",
    text: "🔬 @CEO: Sản phẩm chiến lược mới cần thêm 6 tháng kiểm định an toàn, nhưng đối thủ cạnh tranh đã bắt đầu chạy chiến dịch ra mắt sản phẩm tương đương.",
    timestamp: "10:00",
    isUrgent: true,
    karmaDelay: 2,
    choices: [
      {
        id: "d1-1",
        text: "Ra mắt sản phẩm ngay lập tức để giành giật thị phần trước đối thủ.",
        immediateImpact: { profit: 15, competitiveness: 25, socialResponsibility: -10, workerMorale: 0 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Lỗi sản phẩm nghiêm trọng! Làn sóng thu hồi hàng loạt gây thiệt hại chi phí lớn.",
          delayedImpact: { profit: 0, competitiveness: -20, socialResponsibility: -20, workerMorale: 0 }
        }
      },
      {
        id: "d1-2",
        text: "Tung ra bản thử nghiệm Beta giới hạn và ghi nhận ý kiến phản hồi.",
        immediateImpact: { profit: 8, competitiveness: 12, socialResponsibility: -5, workerMorale: 0 }
      },
      {
        id: "d1-3",
        text: "Kiên quyết kiểm định đủ 6 tháng, đặt chất lượng lên hàng đầu.",
        immediateImpact: { profit: 0, competitiveness: -10, socialResponsibility: 10, workerMorale: 5 }
      }
    ]
  },
  {
    id: "d2",
    departmentId: "rd",
    text: "🔬 @CEO: Cơ hội lớn để đưa sản phẩm xâm nhập vào thị trường Đông Nam Á. Điều này đòi hỏi chi phí đầu tư cao và đối mặt rủi ro pháp lý lớn.",
    timestamp: "15:30",
    isUrgent: false,
    karmaDelay: 3,
    choices: [
      {
        id: "d2-1",
        text: "Đầu tư ngân sách lớn mở rộng thị trường toàn lực.",
        immediateImpact: { profit: -25, competitiveness: 25, socialResponsibility: 0, workerMorale: -10 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Rào cản văn hóa! Sản phẩm không phù hợp thị hiếu địa phương, thua lỗ nặng.",
          delayedImpact: { profit: -20, competitiveness: -15, socialResponsibility: 0, workerMorale: 0 }
        }
      },
      {
        id: "d2-2",
        text: "Liên doanh hợp tác với đối tác bản địa để phân chia rủi ro.",
        immediateImpact: { profit: -10, competitiveness: 15, socialResponsibility: 10, workerMorale: 0 }
      },
      {
        id: "d2-3",
        text: "Giữ vững và củng cố vị thế tại thị trường nội địa.",
        immediateImpact: { profit: 5, competitiveness: -5, socialResponsibility: 0, workerMorale: 10 }
      }
    ]
  },
  {
    id: "d3",
    departmentId: "pr",
    text: "📣 @CEO: Tin đồn thất thiệt lan truyền trên mạng xã hội tố cáo sản phẩm của chúng ta độc hại. Lượt tiếp cận tăng chóng mặt.",
    timestamp: "22:00",
    isUrgent: true,
    karmaDelay: 2,
    choices: [
      {
        id: "d3-1",
        text: "Phản hồi công khai minh bạch thông tin kiểm định khoa học.",
        immediateImpact: { profit: -5, competitiveness: -5, socialResponsibility: 15, workerMorale: 5 }
      },
      {
        id: "d3-2",
        text: "Yêu cầu luật sư khởi kiện hình sự đối tượng tung tin đồn thất thiệt.",
        immediateImpact: { profit: 0, competitiveness: -15, socialResponsibility: -10, workerMorale: 0 },
        karmaEvent: {
          text: "⚡ PHỦ ĐỊNH: Bất hợp lòng dân! Cộng đồng mạng cho rằng công ty dùng tiền để đe dọa người tiêu dùng.",
          delayedImpact: { profit: 0, competitiveness: -15, socialResponsibility: 0, workerMorale: 0 }
        }
      },
      {
        id: "d3-3",
        text: "Giữ im lặng và để sự việc tự lắng xuống theo thời gian.",
        immediateImpact: { profit: 0, competitiveness: -20, socialResponsibility: -10, workerMorale: 0 }
      }
    ]
  },
  {
    id: "d4",
    departmentId: "rd",
    text: "🔬 @CEO: Một tập đoàn đa quốc gia đề xuất mua lại 30% cổ phần của công ty chúng ta để làm đối tác chiến lược dài hạn.",
    timestamp: "16:30",
    isUrgent: false,
    choices: [
      {
        id: "d4-1",
        text: "Đồng ý chuyển nhượng 30% cổ phần để đón nhận nguồn vốn và kỹ nghệ ngoại.",
        immediateImpact: { profit: 20, competitiveness: 20, socialResponsibility: 0, workerMorale: -5 }
      },
      {
        id: "d4-2",
        text: "Thương lượng đàm phán giảm tỷ lệ sở hữu xuống còn 15% cổ phần.",
        immediateImpact: { profit: 10, competitiveness: 10, socialResponsibility: 0, workerMorale: 0 }
      },
      {
        id: "d4-3",
        text: "Kiên quyết từ chối để giữ trọn vẹn quyền tự chủ và độc lập.",
        immediateImpact: { profit: -10, competitiveness: -10, socialResponsibility: 10, workerMorale: 15 }
      }
    ]
  }
];
