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
      },
      {
        id: "scientific-publications",
        name: "Công bố khoa học",
        category: "thesis",
        quantityValue: 3,
        icon: "FileText",
        description: "Viết bài báo khoa học đăng trên các tạp chí uy tín trong nước hoặc quốc tế.",
        color: "from-sky-500 to-indigo-500"
      },
      {
        id: "advanced-theory",
        name: "Lý luận chuyên sâu",
        category: "thesis",
        quantityValue: 1,
        icon: "Search",
        description: "Nghiên cứu sâu sắc lý luận kinh tế học vĩ mô và triết học Mác - Lênin.",
        color: "from-blue-600 to-cyan-700"
      },
      {
        id: "academic-olympiad",
        name: "Giải thưởng Olympic",
        category: "thesis",
        quantityValue: 4,
        icon: "Trophy",
        description: "Đoạt giải cao trong các kỳ thi học sinh giỏi, học thuật cấp quốc gia.",
        color: "from-indigo-600 to-violet-800"
      },
      {
        id: "foreign-languages",
        name: "Ngoại ngữ IELTS 8.0",
        category: "thesis",
        quantityValue: 3,
        icon: "Languages",
        description: "Làm chủ ngoại ngữ toàn diện để tiếp cận nguồn tri thức toàn cầu.",
        color: "from-sky-600 to-blue-800"
      },
      {
        id: "scholarship-abroad",
        name: "Học bổng quốc tế",
        category: "thesis",
        quantityValue: 5,
        icon: "Globe",
        description: "Học bổng trao đổi hoặc du học tại các trường đại học hàng đầu thế giới.",
        color: "from-blue-700 to-purple-800"
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
        name: "Mạng lưới xã hội",
        category: "antithesis",
        quantityValue: 5,
        icon: "Users",
        description: "Kết nối với nhà tuyển dụng, các anh chị đi trước trong ngành.",
        color: "from-yellow-500 to-amber-600"
      },
      {
        id: "startup-project",
        name: "Dự án khởi nghiệp",
        category: "antithesis",
        quantityValue: 3,
        icon: "Zap",
        description: "Thử sức tự doanh hoặc chạy dự án khởi nghiệp nhỏ cùng bạn bè.",
        color: "from-orange-500 to-red-600"
      },
      {
        id: "corporate-internship",
        name: "Thực tập tập đoàn lớn",
        category: "antithesis",
        quantityValue: 1,
        icon: "Building2",
        description: "Trải nghiệm thực tế quy trình làm việc chuẩn mực công nghiệp.",
        color: "from-amber-600 to-yellow-600"
      },
      {
        id: "freelancer-work",
        name: "Làm tự do Freelancer",
        category: "antithesis",
        quantityValue: 3,
        icon: "Activity",
        description: "Nhận dự án ngoài tự do, tự quản lý thời gian và thu nhập.",
        color: "from-orange-600 to-red-700"
      },
      {
        id: "volunteer-leader",
        name: "Thủ lĩnh tình nguyện",
        category: "antithesis",
        quantityValue: 4,
        icon: "HeartHandshake",
        description: "Tổ chức hoạt động cộng đồng, rèn luyện kỹ năng quản lý đội nhóm.",
        color: "from-red-600 to-amber-700"
      },
      {
        id: "technical-projects",
        name: "Dự án thực tế",
        category: "antithesis",
        quantityValue: 5,
        icon: "Code2",
        description: "Xây dựng các sản phẩm thực tế, có người dùng thật ngoài thị trường.",
        color: "from-amber-700 to-red-800"
      }
    ],
    synthesisCards: [
      {
        id: "balanced-student",
        name: "Sinh viên Toàn diện",
        requiredThesis: "theory-knowledge",
        requiredAntithesis: "parttime-job",
        leapThreshold: 4,
        description: "Sự kết hợp hài hòa giữa kiến thức giảng đường và cọ xát công việc bán thời gian. Bạn phát triển cân bằng và không bị xa rời thực tế."
      },
      {
        id: "expert-practitioner",
        name: "Chuyên gia Thực chiến",
        requiredThesis: "high-gpa",
        requiredAntithesis: "soft-skills",
        leapThreshold: 6,
        description: "Sự kết hợp giữa học thuật đỉnh cao và kỹ năng thực tế năng động. Lượng tri thức học đường đã chuyển hóa thành Chất năng lực vượt trội!"
      },
      {
        id: "innovative-leader",
        name: "Thủ lĩnh Đổi mới Sáng tạo",
        requiredThesis: "deep-research",
        requiredAntithesis: "networking",
        leapThreshold: 8,
        description: "Tầm nhìn nghiên cứu chiều sâu kết hợp mạng lưới quan hệ rộng mở tạo ra Bước nhảy vĩ đại thành một thủ lĩnh dẫn dắt xu hướng mới."
      },
      {
        id: "dialectical-entrepreneur",
        name: "Doanh nhân Biện chứng",
        requiredThesis: "scientific-publications",
        requiredAntithesis: "startup-project",
        leapThreshold: 6,
        description: "Sự kết hợp giữa tư duy học thuật sắc bén từ công bố khoa học và hành động thực tiễn khởi nghiệp. Tạo bước nhảy biến bạn thành một Founder tri thức dẫn dắt thị trường!"
      },
      {
        id: "professional-expert",
        name: "Chuyên gia Tư vấn Cao cấp",
        requiredThesis: "advanced-theory",
        requiredAntithesis: "corporate-internship",
        leapThreshold: 2,
        description: "Sự kết hợp hoàn hảo giữa lý luận vững vàng và kinh nghiệm quy chuẩn tập đoàn lớn. Bước nhảy giúp bạn trở thành chuyên gia tư vấn chiến lược vĩ mô."
      },
      {
        id: "olympian-freelancer",
        name: "Chiến binh Freelancer Tài năng",
        requiredThesis: "academic-olympiad",
        requiredAntithesis: "freelancer-work",
        leapThreshold: 6,
        description: "Tư duy giải quyết bài toán khó của học sinh giỏi kết hợp với sự linh hoạt của freelancer. Tạo ra năng lực giải quyết dự án độc lập cực mạnh."
      },
      {
        id: "global-citizen",
        name: "Thủ lĩnh Công dân Toàn cầu",
        requiredThesis: "foreign-languages",
        requiredAntithesis: "volunteer-leader",
        leapThreshold: 6,
        description: "Sử dụng ngoại ngữ xuất sắc song hành với vai trò thủ lĩnh tình nguyện. Bước nhảy đưa bạn vươn tầm làm việc trong các tổ chức phi chính phủ quốc tế."
      },
      {
        id: "global-tech-expert",
        name: "Kỹ sư Công nghệ Toàn cầu",
        requiredThesis: "scholarship-abroad",
        requiredAntithesis: "technical-projects",
        leapThreshold: 8,
        description: "Trải nghiệm học tập đỉnh cao tại nước ngoài kết hợp năng lực thực thi dự án thực tế. Tạo ra một kỹ sư công nghệ đẳng cấp quốc tế."
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
      },
      {
        id: "financial-investing",
        name: "Đầu tư cổ phiếu & Quỹ",
        category: "thesis",
        quantityValue: 3,
        icon: "TrendingUp",
        description: "Bắt tiền làm việc cho mình qua các kênh đầu tư dài hạn an toàn.",
        color: "from-emerald-500 to-teal-600"
      },
      {
        id: "asset-accumulation",
        name: "Tích lũy tài sản thực",
        category: "thesis",
        quantityValue: 5,
        icon: "Coins",
        description: "Sở hữu vàng hoặc các tài sản có giá trị lưu giữ cao chống lạm phát.",
        color: "from-teal-600 to-emerald-800"
      },
      {
        id: "debt-free",
        name: "Không nợ nần tiêu dùng",
        category: "thesis",
        quantityValue: 1,
        icon: "CheckSquare",
        description: "Nói không với các khoản vay trả góp mua sắm tiêu dùng hoang phí.",
        color: "from-teal-400 to-emerald-500"
      },
      {
        id: "pension-plan",
        name: "Kế hoạch hưu trí sớm",
        category: "thesis",
        quantityValue: 4,
        icon: "Calendar",
        description: "Phân bổ tài sản tích lũy dài hạn hướng tới tự do nghỉ hưu sớm.",
        color: "from-emerald-500 to-teal-800"
      },
      {
        id: "real-estate-saving",
        name: "Quỹ mua nhà tích lũy",
        category: "thesis",
        quantityValue: 5,
        icon: "Home",
        description: "Kiên trì tiết kiệm hướng tới sở hữu bất động sản đầu tiên.",
        color: "from-teal-700 to-emerald-900"
      },
      {
        id: "insurance-security",
        name: "Bảo hiểm phòng rủi ro",
        category: "thesis",
        quantityValue: 3,
        icon: "Heart",
        description: "Sử dụng các gói bảo hiểm sức khỏe để bảo vệ thành quả tiết kiệm.",
        color: "from-emerald-400 to-teal-600"
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
        name: "Du lịch trải nghiệm",
        category: "antithesis",
        quantityValue: 4,
        icon: "Compass",
        description: "Mở rộng thế giới quan, tiếp thu tư duy mới từ các nền văn minh khác nhau.",
        color: "from-rose-600 to-red-700"
      },
      {
        id: "health-wellness",
        name: "Chăm sóc sức khỏe",
        category: "antithesis",
        quantityValue: 3,
        icon: "Activity",
        description: "Tập luyện thể thao chuyên nghiệp và ăn uống lành mạnh để duy trì sức trẻ.",
        color: "from-rose-500 to-pink-600"
      },
      {
        id: "high-tech-tools",
        name: "Thiết bị công nghệ",
        category: "antithesis",
        quantityValue: 5,
        icon: "Laptop",
        description: "Đầu tư máy tính cấu hình cao, AI tools để tăng năng suất làm việc lên gấp bội.",
        color: "from-red-500 to-purple-600"
      },
      {
        id: "self-branding",
        name: "Thương hiệu cá nhân",
        category: "antithesis",
        quantityValue: 1,
        icon: "UserCheck",
        description: "Xây dựng hình ảnh cá nhân uy tín trên môi trường số để tạo cơ hội.",
        color: "from-pink-400 to-rose-500"
      },
      {
        id: "high-quality-networking",
        name: "Quan hệ chất lượng",
        category: "antithesis",
        quantityValue: 4,
        icon: "UserPlus",
        description: "Gặp gỡ, giao lưu với các mentor và cộng sự tinh hoa cùng ngành.",
        color: "from-rose-500 to-pink-700"
      },
      {
        id: "art-creative-hobby",
        name: "Đam mê sáng tạo",
        category: "antithesis",
        quantityValue: 5,
        icon: "Palette",
        description: "Đầu tư học nhạc cụ, vẽ tranh, nhiếp ảnh để nuôi dưỡng thế giới nội tâm.",
        color: "from-red-600 to-purple-800"
      },
      {
        id: "gourmet-experience",
        name: "Ẩm thực tinh hoa",
        category: "antithesis",
        quantityValue: 3,
        icon: "Coffee",
        description: "Thưởng thức ẩm thực cao cấp, mở rộng gu thẩm mỹ và phong cách sống.",
        color: "from-rose-400 to-red-600"
      }
    ],
    synthesisCards: [
      {
        id: "knowledge-capitalist",
        name: "Tri thức Phú ông",
        requiredThesis: "frugal-living",
        requiredAntithesis: "learning-courses",
        leapThreshold: 4,
        description: "Áp dụng lối sống tối giản kết hợp học tập liên tục. Lượng tích lũy tri thức sẽ chuyển hóa thành nguồn thu nhập vượt trội trong tương lai."
      },
      {
        id: "safe-adventurer",
        name: "Nhà thám hiểm An toàn",
        requiredThesis: "emergency-fund",
        requiredAntithesis: "travel-explore",
        leapThreshold: 6,
        description: "Tự tin đi khắp thế giới nhờ điểm tựa vững chãi từ quỹ khẩn cấp. Bạn tích lũy trải nghiệm văn hóa mà không sợ rủi ro tài chính."
      },
      {
        id: "elite-investor",
        name: "Tự do Tài chính & Thể chất",
        requiredThesis: "financial-investing",
        requiredAntithesis: "health-wellness",
        leapThreshold: 6,
        description: "Đầu tư thông minh song hành cùng sức khỏe tráng kiện. Bước nhảy đưa bạn thành người tự do tài chính đích thực, sống khỏe và thịnh vượng!"
      },
      {
        id: "digital-nomad",
        name: "Chiến thần Công nghệ Độc lập",
        requiredThesis: "asset-accumulation",
        requiredAntithesis: "high-tech-tools",
        leapThreshold: 8,
        description: "Sở hữu tài sản tích lũy an toàn cùng công cụ làm việc tối tân. Bước nhảy biến bạn thành một Digital Nomad tự do di chuyển khắp thế giới mà vẫn tạo ra giá trị thặng dư cực lớn."
      },
      {
        id: "independent-brand",
        name: "Thương hiệu Độc lập",
        requiredThesis: "debt-free",
        requiredAntithesis: "self-branding",
        leapThreshold: 2,
        description: "Không gánh nặng nợ nần và tự tin làm chủ thương hiệu cá nhân xuất sắc. Tạo điều kiện để bạn tự khởi nghiệp tự do."
      },
      {
        id: "lifestyle-entrepreneur",
        name: "Doanh nhân Phong cách sống",
        requiredThesis: "pension-plan",
        requiredAntithesis: "high-quality-networking",
        leapThreshold: 6,
        description: "Mục tiêu hưu trí sớm cộng hưởng với mạng lưới quan hệ chất lượng. Bước nhảy chuyển hóa bạn thành một doanh nhân tự vận hành mô hình kinh doanh tinh gọn."
      },
      {
        id: "creative-homeowner",
        name: "Gia chủ Nghệ sĩ",
        requiredThesis: "real-estate-saving",
        requiredAntithesis: "art-creative-hobby",
        leapThreshold: 8,
        description: "Xây dựng căn nhà mơ ước từ quỹ tích lũy và trang hoàng bằng gu thẩm mỹ nghệ thuật độc bản. Bạn làm chủ hoàn toàn không gian sống chất lượng cao."
      },
      {
        id: "luxury-epicurean",
        name: "Chuyên gia Hưởng thụ An toàn",
        requiredThesis: "insurance-security",
        requiredAntithesis: "gourmet-experience",
        leapThreshold: 6,
        description: "Thỏa mãn gu thưởng thức ẩm thực cao cấp dưới sự bảo vệ toàn diện của bảo hiểm. Cuộc sống an nhàn, vẹn tròn trải nghiệm."
      }
    ]
  }
];
