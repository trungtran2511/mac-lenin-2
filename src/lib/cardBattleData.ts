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
        name: "Kiến thức hàn lâm (Giảng đường)",
        category: "thesis",
        quantityValue: 2,
        icon: "BookOpen",
        description: "Tích lũy hệ thống nguyên lý kinh tế, triết học và chuyên môn tại giảng đường.",
        color: "from-blue-500 to-indigo-600"
      },
      {
        id: "high-gpa",
        name: "Điểm số & GPA xuất sắc (Tiêu chuẩn trường học)",
        category: "thesis",
        quantityValue: 4,
        icon: "Award",
        description: "Điểm số cao, chứng nhận năng lực nghiên cứu khoa học bài bản.",
        color: "from-purple-500 to-indigo-700"
      },
      {
        id: "deep-research",
        name: "Nghiên cứu khoa học (Chiều sâu tư duy)",
        category: "thesis",
        quantityValue: 5,
        icon: "Cpu",
        description: "Đi sâu phân tích bản chất quy luật phát triển xã hội và tư duy biện chứng.",
        color: "from-cyan-500 to-blue-600"
      },
      {
        id: "academic-olympiad",
        name: "Học thuật đỉnh cao (Tinh hoa / Olympic)",
        category: "thesis",
        quantityValue: 4,
        icon: "Trophy",
        description: "Đoạt giải cao trong các kỳ thi học sinh giỏi, học thuật cấp quốc gia.",
        color: "from-indigo-600 to-violet-800"
      },
      {
        id: "foreign-languages",
        name: "Tiêu chuẩn Quốc tế (Chứng chỉ / IELTS 8.0)",
        category: "thesis",
        quantityValue: 3,
        icon: "Languages",
        description: "Làm chủ ngoại ngữ toàn diện để tiếp cận nguồn tri thức toàn cầu.",
        color: "from-sky-600 to-blue-800"
      },
      {
        id: "scholarship-abroad",
        name: "Học bổng quốc tế (Học thuật tinh hoa thế giới)",
        category: "thesis",
        quantityValue: 5,
        icon: "Globe",
        description: "Học bổng đào tạo tại nước ngoài hoặc các chương trình chuẩn quốc tế.",
        color: "from-blue-700 to-purple-800"
      },
      {
        id: "advanced-theory",
        name: "Lý luận chuyên sâu (Hệ thống vĩ mô)",
        category: "thesis",
        quantityValue: 1,
        icon: "Search",
        description: "Nghiên cứu sâu sắc lý luận kinh tế chính trị, triết học và các học thuyết vĩ mô.",
        color: "from-blue-600 to-cyan-700"
      }
    ],
    antithesisCards: [
      {
        id: "parttime-job",
        name: "Công việc Part-time (Kiếm sống)",
        category: "antithesis",
        quantityValue: 2,
        icon: "Briefcase",
        description: "Cọ xát môi trường công sở, làm quen với áp lực tiến độ công việc.",
        color: "from-amber-500 to-orange-600"
      },
      {
        id: "networking",
        name: "Mạng lưới kết nối (Chiều rộng quan hệ)",
        category: "antithesis",
        quantityValue: 5,
        icon: "Users",
        description: "Kết nối với nhà tuyển dụng, các anh chị đi trước trong ngành.",
        color: "from-yellow-500 to-amber-600"
      },
      {
        id: "freelancer-work",
        name: "Sức cạnh tranh Tự do (Kinh tế tự do / Freelance)",
        category: "antithesis",
        quantityValue: 3,
        icon: "Activity",
        description: "Nhận dự án ngoài tự do, tự quản lý thời gian và thu nhập.",
        color: "from-orange-600 to-red-700"
      },
      {
        id: "volunteer-leader",
        name: "Hoạt động đại chúng (Bình dân / Tình nguyện)",
        category: "antithesis",
        quantityValue: 4,
        icon: "HeartHandshake",
        description: "Tổ chức hoạt động cộng đồng, rèn luyện kỹ năng quản lý đội nhóm.",
        color: "from-red-600 to-amber-700"
      },
      {
        id: "technical-projects",
        name: "Dự án thực chiến (Yêu cầu doanh nghiệp)",
        category: "antithesis",
        quantityValue: 5,
        icon: "Code2",
        description: "Xây dựng các sản phẩm thực tế, có người dùng thật ngoài thị trường.",
        color: "from-amber-700 to-red-800"
      },
      {
        id: "local-projects",
        name: "Dự án thực tế (Sản phẩm local / Mì ăn liền)",
        category: "antithesis",
        quantityValue: 3,
        icon: "Cpu",
        description: "Xây dựng dự án local thực tế yêu cầu triển khai nhanh gọn.",
        color: "from-amber-600 to-orange-700"
      },
      {
        id: "corporate-internship",
        name: "Thực tập tập đoàn lớn (Sức ép vận hành vi mô)",
        category: "antithesis",
        quantityValue: 1,
        icon: "Building2",
        description: "Trải nghiệm thực tế quy trình làm việc chuẩn mực công nghiệp.",
        color: "from-amber-600 to-yellow-600"
      }
    ],
    synthesisCards: [
      {
        id: "balanced-student",
        name: "Sinh viên Toàn diện",
        requiredThesis: "theory-knowledge",
        requiredAntithesis: "parttime-job",
        leapThreshold: 4,
        description: "Đây là mâu thuẫn giữa Lý luận thuần túy và Thực tiễn sinh tồn cơ bản.",
        struggleDetail: "Hai phe này triệt tiêu thời gian của nhau khủng khiếp. Cày bài tập lớn trên trường thì mất giờ làm part-time kiếm tiền; đi làm ca tối về thì mệt rũ rượi, không thể nạp nổi kiến thức hàn lâm.",
        unityDetail: "Kiến thức giảng đường giúp nâng cấp tư duy để sinh viên không phải làm lao động chân tay giá rẻ mãi mãi. Ngược lại, áp lực kiếm sống ở công việc part-time tạo ra động lực thực tế để sinh viên hiểu vì sao mình cần phải học.",
        outcomeDetail: "Dung hợp được hai mặt này sẽ tạo ra một Sinh viên Toàn diện — vừa vững lý thuyết, vừa biết tự lập tự cường."
      },
      {
        id: "expert-practitioner",
        name: "Chuyên gia Thực chiến",
        requiredThesis: "high-gpa",
        requiredAntithesis: "technical-projects",
        leapThreshold: 6,
        description: "Mâu thuẫn giữa Khuôn mẫu lý tưởng và Thực tế khốc liệt của thị trường.",
        struggleDetail: "Để có GPA 3.9/4.0, bạn phải học đều tất cả các môn, tuân thủ tuyệt đối giáo trình và bài thi mang tính khuôn mẫu. Ngược lại, dự án thực chiến tại doanh nghiệp đòi hỏi sự linh hoạt, 'mì ăn liền', đôi khi phải phá vỡ quy tắc sách vở để chạy kịp deadline và tối ưu chi phí. Người ôm cả hai thường bị 'tẩu hỏa nhập ma' vì xung đột tư duy.",
        unityDetail: "GPA xuất sắc chứng minh tư duy nền tảng cực tốt, giúp giải quyết các bài toán khó trong dự án một cách bài bản thay vì chắp vá. Ngược lại, kinh nghiệm làm dự án thực tế giúp 'thổi sức sống' vào các con số GPA khô khan, biến điểm số thành năng lực thực sự.",
        outcomeDetail: "Chuyên gia Thực chiến — người có thể hạ cánh xuống bất kỳ doanh nghiệp nào và làm được việc ngay nhờ tư duy nền tảng sâu và kỹ năng thực tế bén."
      },
      {
        id: "innovative-leader",
        name: "Thủ lĩnh Đổi mới Sáng tạo",
        requiredThesis: "deep-research",
        requiredAntithesis: "networking",
        leapThreshold: 8,
        description: "Mâu thuẫn giữa Sự cô độc tập trung và Sự quảng giao đại chúng.",
        struggleDetail: "Nghiên cứu khoa học bắt buộc bạn phải 'giam mình' trong phòng thí nghiệm, đối diện với hàng trăm tài liệu, đòi hỏi sự tĩnh lặng tuyệt đối. Ngược lại, xây dựng mạng lưới xã hội (Networking) đòi hỏi bạn phải liên tục đi sự kiện, giao lưu, nói chuyện và hướng ngoại. Hai trạng thái tâm lý này loại trừ nhau trực tiếp.",
        unityDetail: "Nếu chỉ nghiên cứu cô độc, sản phẩm khoa học sẽ bị 'trùm mền' trong kho vì không ai biết tới. Nếu chỉ đi ngoại giao bề nổi mà không có chiều sâu tri thức, các mối quan hệ sẽ rỗng tuếch. Mạng lưới xã hội giúp đưa nghiên cứu khoa học ra ánh sáng, và nghiên cứu khoa học làm nên uy tín cho các mối quan hệ.",
        outcomeDetail: "Thủ lĩnh Đổi mới Sáng tạo — người vừa có bộ não xuất chúng để tạo ra công nghệ, vừa có khả năng tập hợp lực lượng và tài nguyên để hiện thực hóa công nghệ đó."
      },
      {
        id: "academic-leader",
        name: "Học giả Cộng đồng",
        requiredThesis: "academic-olympiad",
        requiredAntithesis: "volunteer-leader",
        leapThreshold: 6,
        description: "Mâu thuẫn giữa Tháp ngà hàn lâm tinh hoa và Đời sống bình dân đại chúng.",
        struggleDetail: "Phe tinh hoa (Giải thưởng Olympic, nghiên cứu chuyên sâu) hướng tới những điều vĩ mô, phức tạp mà số ít người hiểu được. Phe đại chúng (Tình nguyện, hoạt động xã hội) lại hướng tới sự giản đơn, kết nối con người bằng cảm xúc và hành động thực tế. Người làm học thuật thường xa rời quần chúng, người sa đà vào phong trào thường thiếu chiều sâu học thuật.",
        unityDetail: "Tri thức tinh hoa nếu không hướng về đại chúng để phục vụ nhân dân thì trở nên vô dụng. Hoạt động cộng đồng nếu không có những cái đầu có tri thức dẫn đường thì dễ mang tính tự phát, phong trào và kém hiệu quả.",
        outcomeDetail: "Học giả Cộng đồng — người dùng tri thức đỉnh cao của mình để giải quyết các vấn đề nhức nhối của xã hội, được cộng đồng nể phục và yêu mến."
      },
      {
        id: "global-freelancer",
        name: "Freelancer Toàn cầu",
        requiredThesis: "foreign-languages",
        requiredAntithesis: "freelancer-work",
        leapThreshold: 6,
        description: "Mâu thuẫn giữa Khuôn mẫu luật chơi toàn cầu và Sự sinh tồn vô kỷ luật.",
        struggleDetail: "Đạt các chứng chỉ chuẩn quốc tế đòi hỏi bạn phải ép mình vào các bộ quy tắc chuẩn mực khắt khe, có phần gò bó của phương Tây. Trong khi đó, làm Freelancer là thế giới 'vô chính phủ', bạn phải tự bơi, tự cạnh tranh bằng mọi giá, đối mặt với sự bấp bênh và không có tổ chức nào bảo vệ.",
        unityDetail: "Không có tấm vé 'Tiêu chuẩn quốc tế' (như ngoại ngữ đỉnh cao), bạn không thể tiếp cận các khách hàng nước ngoài trả tiền đô trên Upwork, Fiverr. Ngược lại, nếu chỉ có chứng chỉ mà không có độ 'quái', khả năng tự bơi của Freelance, bạn sẽ chết chìm trước các đối thủ cạnh tranh toàn cầu.",
        outcomeDetail: "Freelancer Toàn cầu — một cá nhân độc lập, tự do nhưng sở hữu năng lực vận hành chuyên nghiệp theo đúng luật chơi quốc tế."
      },
      {
        id: "global-tech-expert",
        name: "Kỹ sư Công nghệ Toàn cầu",
        requiredThesis: "scholarship-abroad",
        requiredAntithesis: "local-projects",
        leapThreshold: 8,
        description: "Mâu thuẫn giữa Tầm nhìn vĩ mô lý tưởng và Áp lực thực tế địa phương.",
        struggleDetail: "Học bổng quốc tế dạy bạn công nghệ cốt lõi và kiến trúc hệ thống chuẩn mực. Nhưng khi áp dụng vào dự án thực tế tại thị trường local, khách hàng thường chỉ muốn sản phẩm 'chạy được luôn', giá rẻ và thay đổi liên tục, tạo ra sự dằn vặt giữa 'làm chuẩn chỉnh' và 'làm cho nhanh'.",
        unityDetail: "Nhờ tư duy chuẩn quốc tế, kỹ sư sẽ xây dựng được hệ thống có tính mở rộng cao, bảo mật tốt chứ không chắp vá. Ngược lại, chính áp lực 'mì ăn liền' local sẽ mài giũa năng lực thích ứng, biến lý thuyết thành vũ khí thực chiến.",
        outcomeDetail: "Kỹ sư Công nghệ Toàn cầu — một chuyên gia công nghệ sở hữu tư duy hệ thống đẳng cấp quốc tế kết hợp khả năng thích ứng linh hoạt với thị trường nội địa."
      },
      {
        id: "professional-expert",
        name: "Chuyên gia Tư vấn Cao cấp",
        requiredThesis: "advanced-theory",
        requiredAntithesis: "corporate-internship",
        leapThreshold: 2,
        description: "Mâu thuẫn giữa Người quan sát toàn cảnh và Bánh răng trong bộ máy.",
        struggleDetail: "Lý luận chuyên sâu bắt bạn đứng ở trên cao để nhìn nhận toàn bộ bức tranh kinh tế. Nhưng khi thực tập tại các tập đoàn lớn (Big Corp), bạn bị ném vào một vị trí cụ thể với sức ép nghẹt thở từ KPI, quy trình hành chính phức tạp, dễ khiến bạn thấy mớ lý thuyết vĩ mô chẳng giúp ích gì cho việc lặt vặt hiện tại.",
        unityDetail: "Tập đoàn lớn chính là mô hình thu nhỏ hoàn hảo nhất của các lý thuyết quản trị vĩ mô, đi làm giúp bạn hiểu sâu cách các bánh răng vận hành thực tế. Ngược lại, nhờ có tư duy hệ thống, bạn sẽ không bị lạc lối trong công việc sự vụ mà biết cách tối ưu quy trình để thăng tiến.",
        outcomeDetail: "Chuyên gia Tư vấn Cao cấp — người vừa am hiểu sâu sắc lý thuyết hệ thống, vừa có kinh nghiệm vận hành thực tế tại các tổ chức quy mô lớn."
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
        name: "Tối giản khắc khổ (Thắt lưng buộc bụng)",
        category: "thesis",
        quantityValue: 4,
        icon: "Shield",
        description: "Thắt lưng buộc bụng để tích lũy tài chính tối đa.",
        color: "from-emerald-600 to-teal-700"
      },
      {
        id: "emergency-fund",
        name: "Quỹ an toàn đóng băng (Tiền chết trong két)",
        category: "thesis",
        quantityValue: 6,
        icon: "Lock",
        description: "Tiền mặt dự phòng đóng băng phòng trường hợp rủi ro.",
        color: "from-emerald-500 to-teal-600"
      },
      {
        id: "financial-investing",
        name: "Áp lực đầu tư tài chính (Cày cuốc, căng thẳng)",
        category: "thesis",
        quantityValue: 6,
        icon: "TrendingUp",
        description: "Dành thời gian và công sức cày cuốc, nghiên cứu danh mục đầu tư.",
        color: "from-teal-600 to-emerald-800"
      },
      {
        id: "debt-free",
        name: "Kỷ luật tài chính (Nói không với phô trương)",
        category: "thesis",
        quantityValue: 2,
        icon: "CheckSquare",
        description: "Nói không với nợ nần và các tiêu sản phô trương bề nổi.",
        color: "from-teal-400 to-emerald-500"
      },
      {
        id: "pension-plan",
        name: "Kế hoạch hưu trí sớm (Tích lũy tối đa)",
        category: "thesis",
        quantityValue: 6,
        icon: "Calendar",
        description: "Cố gắng tích lũy dòng tiền để đạt mục tiêu hưu trí sớm.",
        color: "from-emerald-500 to-teal-800"
      },
      {
        id: "real-estate-saving",
        name: "Quỹ mua nhà kiên cố (Sự ràng buộc cố định)",
        category: "thesis",
        quantityValue: 8,
        icon: "Home",
        description: "Tích lũy tiền mua bất động sản để an cư lạc nghiệp.",
        color: "from-teal-700 to-emerald-900"
      },
      {
        id: "insurance-security",
        name: "Chi phí bảo hiểm (Phòng rủi ro tương lai)",
        category: "thesis",
        quantityValue: 6,
        icon: "Heart",
        description: "Trích một phần ngân sách chi trả cho bảo hiểm phòng trừ rủi ro.",
        color: "from-emerald-400 to-teal-600"
      }
    ],
    antithesisCards: [
      {
        id: "learning-courses",
        name: "Đầu tư tri thức cao cấp (Học phí đắt đỏ)",
        category: "antithesis",
        quantityValue: 4,
        icon: "GraduationCap",
        description: "Chi khoản tiền lớn cho các khóa học, chứng chỉ chuyên sâu.",
        color: "from-pink-500 to-rose-600"
      },
      {
        id: "travel-explore",
        name: "Du lịch mạo hiểm (Đốt tiền vào trải nghiệm)",
        category: "antithesis",
        quantityValue: 6,
        icon: "Compass",
        description: "Đi xa trải nghiệm các vùng đất mới, dấn thân vào thử thách mới.",
        color: "from-rose-600 to-red-700"
      },
      {
        id: "health-wellness",
        name: "Phục hồi thể chất & Trị liệu (Nghỉ ngơi, ngắt kết nối)",
        category: "antithesis",
        quantityValue: 6,
        icon: "Activity",
        description: "Nghỉ ngơi trị liệu cơ thể, tạm ngắt kết nối với công việc.",
        color: "from-rose-500 to-pink-600"
      },
      {
        id: "self-branding",
        name: "Đam mê xây dựng hình ảnh (Chi phí ngoại giao, Profile)",
        category: "antithesis",
        quantityValue: 2,
        icon: "UserCheck",
        description: "Chi tiền cho các hình ảnh uy tín cá nhân, Profile chuyên nghiệp.",
        color: "from-pink-400 to-rose-500"
      },
      {
        id: "high-quality-networking",
        name: "Xây dựng quan hệ xa xỉ (Chi phí VIP, hội nhóm)",
        category: "antithesis",
        quantityValue: 6,
        icon: "UserPlus",
        description: "Đầu tư chi phí tham gia hội nhóm VIP, tiệc tùng xa xỉ để kết giao.",
        color: "from-rose-500 to-pink-700"
      },
      {
        id: "art-creative-hobby",
        name: "Đam mê sáng tạo tự do (Bay bổng, phá cách)",
        category: "antithesis",
        quantityValue: 8,
        icon: "Palette",
        description: "Đầu tư vào các dự án nghệ thuật, bay bổng sáng tạo không giới hạn.",
        color: "from-red-600 to-purple-800"
      },
      {
        id: "gourmet-experience",
        name: "Ẩm thực tinh hoa (Hưởng thụ xa hoa hiện tại)",
        category: "antithesis",
        quantityValue: 6,
        icon: "Coffee",
        description: "Thưởng thức các bữa ăn sang trọng, ẩm thực chuẩn Michelin.",
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
        description: "Mâu thuẫn giữa việc không dám chi tiêu để tích lũy tiền và việc phải chi một khoản lớn cho học thuật.",
        struggleDetail: "Một bên muốn thắt lưng buộc bụng triệt để để giữ tiền mặt, một bên muốn chi khoản tiền lớn (học phí đắt đỏ) để mua tri thức/khóa học cao cấp.",
        unityDetail: "Lối sống tối giản cung cấp dòng vốn bệ đỡ vững chắc để nuôi dưỡng tri thức; ngược lại, tri thức giúp phú ông biết cách chi tiêu đúng chỗ và đầu tư sinh lời bền vững.",
        outcomeDetail: "Tri thức Phú ông — sở hữu cả tài sản tích lũy vững vàng và trí tuệ đầu tư sắc bén."
      },
      {
        id: "safe-adventurer",
        name: "Nhà thám hiểm An toàn",
        requiredThesis: "emergency-fund",
        requiredAntithesis: "travel-explore",
        leapThreshold: 6,
        description: "Mâu thuẫn giữa Nỗi sợ rủi ro và Khát vọng tự do trải nghiệm.",
        struggleDetail: "Trận chiến tâm lý giữa Nỗi sợ rủi ro (muốn khóa chặt tiền phòng thân trong két) và Khát vọng tự do (muốn lao đi khám phá thế giới, đốt tiền vào trải nghiệm mạo hiểm).",
        unityDetail: "Quỹ an toàn đóng vai trò là chiếc 'bảo hiểm tâm lý' vững chãi để bạn tự tin dấn thân khám phá; ngược lại, những chuyến đi giúp đồng tiền tích lũy có giá trị trải nghiệm thực tế thay vì chỉ là những con số chết.",
        outcomeDetail: "Nhà thám hiểm An toàn — người tự do đi khắp thế gian mà không bao giờ phải lo lắng về biến động tài chính."
      },
      {
        id: "elite-investor",
        name: "Tự do Biện chứng",
        requiredThesis: "financial-investing",
        requiredAntithesis: "health-wellness",
        leapThreshold: 6,
        description: "Mâu thuẫn giữa Áp lực cày cuốc tài chính và Nhu cầu phục hồi thể chất.",
        struggleDetail: "Muốn giàu nhanh phải cày cuốc ngày đêm, căng thẳng đầu óc nghiên cứu thị trường, ngồi lì cày code bào mòn sức khỏe. Đối lập với việc buộc phải buông bỏ công việc, tắt máy tính để nghỉ ngơi trị liệu căng cơ lưng, phục hồi thể chất.",
        unityDetail: "Lợi nhuận từ đầu tư tài chính giúp chi trả cho các dịch vụ chăm sóc sức khỏe và trị liệu cao cấp; ngược lại, một thể trạng tráng kiện và tinh thần minh mẫn chính là cỗ máy bền bỉ nhất để tiếp tục đầu tư hiệu quả.",
        outcomeDetail: "Tự do Biện chứng — đạt được sự giàu có về tài chính song hành cùng sức khỏe vàng và sự cân bằng thân-tâm-trí."
      },
      {
        id: "independent-brand",
        name: "Thương hiệu Độc lập",
        requiredThesis: "debt-free",
        requiredAntithesis: "self-branding",
        leapThreshold: 2,
        description: "Mâu thuẫn giữa Kỷ luật tài chính không phô trương và Chi phí xây dựng hình ảnh.",
        struggleDetail: "Mâu thuẫn giữa kỷ luật tài chính thắt chặt, nói không với phô trương tiêu sản và nhu cầu chi tiền xây dựng hình ảnh uy tín, trang phục, thiết bị để tạo vị thế ngoại giao đắt đỏ.",
        unityDetail: "Thương hiệu cá nhân uy tín giúp nâng cao năng lực kiếm tiền và mở ra nhiều cơ hội kinh doanh lớn; ngược lại, kỷ luật tài chính nghiêm ngặt đảm bảo thương hiệu của bạn có 'ruột' thực chất chứ không phải một vỏ bọc nợ nần rỗng tuếch.",
        outcomeDetail: "Thương hiệu Độc lập — sở hữu uy tín cá nhân vượt trội nhưng vẫn duy trì nền tảng tài chính cực kỳ lành mạnh và an toàn."
      },
      {
        id: "lifestyle-entrepreneur",
        name: "Doanh nhân Phong cách",
        requiredThesis: "pension-plan",
        requiredAntithesis: "high-quality-networking",
        leapThreshold: 6,
        description: "Mâu thuẫn giữa Tích lũy hưu trí tối đa và Đầu tư quan hệ xã hội xa xỉ.",
        struggleDetail: "Muốn nghỉ hưu sớm buộc bạn phải bóp nghẹt chi tiêu hiện tại để tích lũy tối đa. Ngược lại, muốn có quan hệ với giới tinh hoa, bạn phải chi những khoản tiền lớn tham gia các câu lạc bộ, hội nhóm VIP và tiệc tùng xa xỉ.",
        unityDetail: "Các mối quan hệ VIP chính là đòn bẩy thông tin và cơ hội giúp rút ngắn thời gian làm việc để nghỉ hưu sớm; ngược lại, mục tiêu hưu trí rõ ràng giúp bạn sàng lọc, chỉ giữ lại những mối quan hệ thực chất thay vì xã giao hào nhoáng.",
        outcomeDetail: "Doanh nhân Phong cách — tận hưởng mạng lưới quan hệ đẳng cấp nhưng luôn làm chủ thời gian tự do hưu trí của mình."
      },
      {
        id: "creative-homeowner",
        name: "Gia chủ Nghệ sĩ",
        requiredThesis: "real-estate-saving",
        requiredAntithesis: "art-creative-hobby",
        leapThreshold: 8,
        description: "Mâu thuẫn giữa Ràng buộc bất động sản kiên cố và Sáng tạo tự do bay bổng.",
        struggleDetail: "Ngôi nhà đại diện cho sự định cư cố định, chôn vốn tài chính lớn và sự ràng buộc không gian. Trong khi đó, đam mê sáng tạo nghệ thuật đòi hỏi tinh thần bay bổng, tự do vô biên, ghét sự tù túng và áp lực tiền bạc đè nặng.",
        unityDetail: "Một không gian sống kiên cố, ổn định giúp tâm trí người nghệ sĩ an tâm sáng tạo mà không lo bão giông; ngược lại, tư duy nghệ thuật phá cách sẽ thổi hồn vào ngôi nhà, biến hộp bê tông khô khan thành tổ ấm nghệ thuật độc bản.",
        outcomeDetail: "Gia chủ Nghệ sĩ — sở hữu chốn an cư lý tưởng được cá nhân hóa hoàn hảo bởi tinh thần nghệ thuật bay bổng."
      },
      {
        id: "luxury-epicurean",
        name: "Hưởng thụ An toàn",
        requiredThesis: "insurance-security",
        requiredAntithesis: "gourmet-experience",
        leapThreshold: 6,
        description: "Mâu thuẫn giữa Phòng ngừa rủi ro tương lai và Hưởng thụ ẩm thực tinh hoa hiện tại.",
        struggleDetail: "Mâu thuẫn giữa việc cắt một khoản tiền thực tế hôm nay cho một thứ chưa chắc đã dùng tới ở tương lai (Bảo hiểm) và việc chi tiền để sướng ngay lập tức ở hiện tại (Ăn ngon, ẩm thực xa hoa).",
        unityDetail: "Bảo hiểm bảo vệ sức khỏe và tài chính trước các rủi ro phát sinh từ lối sống thụ hưởng; ngược lại, khi đã có bảo hiểm bảo hộ vững chắc, bạn mới có thể thảnh thơi tận hưởng cuộc sống hiện tại một cách trọn vẹn nhất.",
        outcomeDetail: "Hưởng thụ An toàn — sống hết mình ở hiện tại với những trải nghiệm tinh hoa nhưng luôn có lá chắn bảo vệ vững chắc cho tương lai."
      }
    ]
  }
];
