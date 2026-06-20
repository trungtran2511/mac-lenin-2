import type { DialecticalDebate } from "./cardBattleTypes";

export const CARD_BATTLE_DEBATES: DialecticalDebate[] = [
  {
    id: "study-vs-work",
    title: "Đi làm thêm sớm vs. Tập trung học tập",
    description: "Mâu thuẫn biện chứng giữa tích lũy lý thuyết nền tảng tại trường học và cọ xát kinh nghiệm thực tế sớm ngoài thị trường.",
    side_a: "Tập trung học thuật (Lý luận)",
    side_b: "Đi làm thêm sớm (Thực tiễn)",
    thesisCards: [
      {
        id: "theory-knowledge",
        name: "Kiến thức hàn lâm",
        category: "thesis",
        quantityValue: 2,
        icon: "BookOpen",
        description: "Tích lũy hệ thống nguyên lý kinh tế, triết học và chuyên môn tại giảng đường.",
        color: "from-blue-500 to-indigo-600"
      },
      {
        id: "high-gpa",
        name: "Học bổng & GPA xuất sắc",
        category: "thesis",
        quantityValue: 4,
        icon: "Award",
        description: "Điểm số cao, chứng nhận năng lực nghiên cứu khoa học bài bản.",
        color: "from-purple-500 to-indigo-700"
      },
      {
        id: "deep-research",
        name: "Đề tài nghiên cứu khoa học",
        category: "thesis",
        quantityValue: 5,
        icon: "Cpu",
        description: "Đi sâu phân tích bản chất quy luật phát triển xã hội và tư duy biện chứng.",
        color: "from-cyan-500 to-blue-600"
      }
    ],
    antithesisCards: [
      {
        id: "parttime-job",
        name: "Công việc Part-time",
        category: "antithesis",
        quantityValue: 2,
        icon: "Briefcase",
        description: "Cọ xát môi trường công sở, làm quen với áp lực tiến độ công việc.",
        color: "from-amber-500 to-orange-600"
      },
      {
        id: "soft-skills",
        name: "Kỹ năng mềm thực chiến",
        category: "antithesis",
        quantityValue: 4,
        icon: "MessageSquare",
        description: "Giao tiếp khách hàng, đàm phán, xử lý khủng hoảng thực tế.",
        color: "from-red-500 to-orange-500"
      },
      {
        id: "networking",
        name: "Mạng lưới quan hệ xã hội",
        category: "antithesis",
        quantityValue: 5,
        icon: "Users",
        description: "Kết nối với nhà tuyển dụng, các anh chị đi trước trong ngành.",
        color: "from-yellow-500 to-amber-600"
      }
    ],
    synthesisCards: [
      {
        id: "expert-practitioner",
        name: "Chuyên gia Thực chiến Biện chứng",
        requiredThesis: "high-gpa",
        requiredAntithesis: "soft-skills",
        leapThreshold: 6,
        description: "Sự kết hợp giữa học thuật đỉnh cao và kỹ năng thực tế năng động. Lượng tri thức học đường đã chuyển hóa thành Chất năng lực vượt trội!"
      },
      {
        id: "innovative-leader",
        name: "Nhà Đổi mới Sáng tạo Toàn diện",
        requiredThesis: "deep-research",
        requiredAntithesis: "networking",
        leapThreshold: 8,
        description: "Tầm nhìn nghiên cứu chiều sâu kết hợp mạng lưới quan hệ rộng mở tạo ra Bước nhảy vĩ đại thành một thủ lĩnh dẫn dắt xu hướng mới."
      }
    ]
  },
  {
    id: "saving-vs-spending",
    title: "Tiết kiệm tối đa vs. Đầu tư trải nghiệm",
    description: "Mâu thuẫn giữa việc tích lũy tài chính phòng ngừa rủi ro và việc chi tiêu để nâng cao trình độ sống cũng như sức khỏe thể chất/tinh thần.",
    side_a: "Tích lũy tài sản (Tiết kiệm)",
    side_b: "Đầu tư trải nghiệm (Phát triển)",
    thesisCards: [
      {
        id: "frugal-living",
        name: "Lối sống tối giản",
        category: "thesis",
        quantityValue: 2,
        icon: "TrendingDown",
        description: "Cắt giảm mọi chi phí không cần thiết để tạo quỹ tài chính dự phòng.",
        color: "from-teal-500 to-emerald-600"
      },
      {
        id: "emergency-fund",
        name: "Quỹ khẩn cấp 6 tháng",
        category: "thesis",
        quantityValue: 4,
        icon: "Shield",
        description: "Đảm bảo sự an toàn và độc lập tài chính trước mọi biến động thị trường.",
        color: "from-emerald-600 to-teal-700"
      }
    ],
    antithesisCards: [
      {
        id: "learning-courses",
        name: "Khóa học nâng cao",
        category: "antithesis",
        quantityValue: 2,
        icon: "GraduationCap",
        description: "Đầu tư học thêm công nghệ, ngoại ngữ mới để gia tăng giá trị sức lao động.",
        color: "from-pink-500 to-rose-600"
      },
      {
        id: "travel-explore",
        name: "Du lịch trải nghiệm văn hóa",
        category: "antithesis",
        quantityValue: 4,
        icon: "Compass",
        description: "Mở rộng thế giới quan, tiếp thu tư duy mới từ các nền văn minh khác nhau.",
        color: "from-rose-600 to-red-700"
      }
    ],
    synthesisCards: [
      {
        id: "sustainable-growth",
        name: "Nhà đầu tư Giá trị bền vững",
        requiredThesis: "emergency-fund",
        requiredAntithesis: "learning-courses",
        leapThreshold: 6,
        description: "Có nền tảng tài chính an toàn đồng thời liên tục nâng tầm năng lực bản thân. Tạo ra Bước nhảy đưa bạn từ thế phòng thủ sang thế chủ động phát triển chất lượng cuộc sống."
      }
    ]
  }
];
