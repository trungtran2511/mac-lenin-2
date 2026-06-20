import type { EconomicSectorExtended } from "./simEconTypes";

export const SIM_ECON_SECTORS: EconomicSectorExtended[] = [
  {
    id: "state",
    name: "Kinh tế Nhà nước",
    gdp_contribution: 29,
    color: "#ef4444", // Đỏ
    constitutional_role: "Kinh tế nhà nước giữ vai trò chủ đạo, là công cụ điều tiết vĩ mô quan trọng của Nhà nước định hướng XHCN.",
    description: "Nắm giữ các vị trí, lĩnh vực then chốt và cơ cấu kinh tế vĩ mô cốt lõi của đất nước, đảm bảo an ninh năng lượng và an sinh xã hội.",
    buildingTypes: [
      { id: "oil-corp", sectorId: "state", name: "Tập đoàn Dầu khí VN (PVN)", icon: "🏛️", tier: 3 },
      { id: "power-grid", sectorId: "state", name: "Tập đoàn Điện lực VN (EVN)", icon: "⚡", tier: 3 },
      { id: "state-bank", sectorId: "state", name: "Ngân hàng Nhà nước VN", icon: "🏦", tier: 2 },
      { id: "telecom-army", sectorId: "state", name: "Tập đoàn Viettel", icon: "📡", tier: 3 }
    ],
    keyIndustries: [
      { name: "An ninh quốc phòng", icon: "🛡️", importance: "critical", description: "Bảo đảm chủ quyền và độc lập quốc gia thông qua các tập đoàn công nghiệp quốc phòng độc quyền." },
      { name: "Hạ tầng năng lượng & truyền tải", icon: "⚡", importance: "critical", description: "Hệ thống lưới điện quốc gia, thăm dò và khai thác dầu khí thiết yếu." },
      { name: "Chính sách tài khóa tiền tệ", icon: "🏦", importance: "important", description: "Điều tiết lưu thông tiền tệ và ổn định giá cả vĩ mô." }
    ]
  },
  {
    id: "private",
    name: "Kinh tế Tư nhân",
    gdp_contribution: 45,
    color: "#10b981", // Xanh lá
    constitutional_role: "Kinh tế tư nhân là một động lực quan trọng của nền kinh tế thị trường định hướng XHCN.",
    description: "Đóng góp lớn vào tạo việc làm, phát triển dịch vụ thương mại, nông nghiệp và là lực lượng chính thúc đẩy đổi mới sáng tạo, chuyển đổi số.",
    buildingTypes: [
      { id: "vin-group", sectorId: "private", name: "Tập đoàn Vingroup", icon: "🏢", tier: 3 },
      { id: "fpt-corp", sectorId: "private", name: "Tập đoàn FPT", icon: "💻", tier: 2 },
      { id: "coop-mart", sectorId: "private", name: "Hệ thống Siêu thị Co.opmart", icon: "🛒", tier: 1 },
      { id: "farm-tech", sectorId: "private", name: "Trang trại Nông nghiệp Công nghệ cao", icon: "🚜", tier: 1 }
    ],
    keyIndustries: [
      { name: "Thương mại dịch vụ & bán lẻ", icon: "🛒", importance: "supporting", description: "Cung cấp phân phối hàng hóa tiêu dùng phong phú cho thị trường nội địa." },
      { name: "Đổi mới sáng tạo & phần mềm", icon: "💻", importance: "important", description: "Sản xuất phần mềm, tích hợp hệ thống và chuyển đổi số doanh nghiệp." },
      { name: "Nông nghiệp & thủy sản tư nhân", icon: "🚜", importance: "supporting", description: "Sản xuất lương thực và xuất khẩu nông sản chủ lực của Việt Nam." }
    ]
  },
  {
    id: "fdi",
    name: "Kinh tế FDI",
    gdp_contribution: 26,
    color: "#3b82f6", // Xanh dương
    constitutional_role: "Kinh tế có vốn đầu tư nước ngoài là bộ phận hợp thành quan trọng, được khuyến khích phát triển bền vững.",
    description: "Cầu nối chuyển giao công nghệ cao, thu hút dòng vốn ngoại tệ lớn, thúc đẩy xuất khẩu linh kiện điện tử và tích hợp Việt Nam vào chuỗi giá trị toàn cầu.",
    buildingTypes: [
      { id: "samsung-vn", sectorId: "fdi", name: "Tổ hợp Nhà máy Samsung", icon: "🏭", tier: 3 },
      { id: "intel-chip", sectorId: "fdi", name: "Nhà máy Kiểm định Chip Intel", icon: "🎛️", tier: 2 },
      { id: "logistics-dhl", sectorId: "fdi", name: "Cảng Logistics Quốc tế", icon: "🚢", tier: 2 },
      { id: "car-factory", sectorId: "fdi", name: "Liên doanh Lắp ráp Ô tô Toyota", icon: "🚗", tier: 1 }
    ],
    keyIndustries: [
      { name: "Chế tạo thiết bị điện tử", icon: "🏭", importance: "important", description: "Sản xuất điện thoại thông minh, máy tính bảng phục vụ xuất khẩu toàn cầu." },
      { name: "Logistics liên vận quốc tế", icon: "🚢", importance: "important", description: "Chuỗi cung ứng vận chuyển hàng hóa đường biển, hàng không quốc tế." },
      { name: "Lắp ráp công nghiệp nặng", icon: "🚗", importance: "supporting", description: "Lắp ráp ô tô, xe máy phục vụ nhu cầu trong nước và khu vực." }
    ]
  }
];
