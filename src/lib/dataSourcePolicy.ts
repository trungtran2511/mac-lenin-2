import type { DataSourceMeta, DataSourcePolicyType } from "./chapterToolTypes";

export function getDataSourceMeta(
  policy: DataSourcePolicyType,
  sourceName = "",
  sourceUrl = "",
  sourceDate = ""
): DataSourceMeta {
  switch (policy) {
    case "official":
      return {
        policy,
        sourceName: sourceName || "Dữ liệu chính thức từ Tổng cục Thống kê / Bộ Lao động - TB&XH",
        sourceUrl: sourceUrl || undefined,
        sourceDate: sourceDate || "2024"
      };
    case "user_entered":
      return {
        policy,
        sourceName: "Do người dùng tự nhập",
        sourceDate: new Date().toLocaleDateString("vi-VN")
      };
    case "teaching_example":
      return {
        policy,
        sourceName: "Ví dụ học tập (Số liệu giả định phục vụ minh họa bài giảng)",
        sourceDate: "Giáo trình Kinh tế chính trị"
      };
    case "missing":
    default:
      return {
        policy: "missing",
        sourceName: "Không có dữ liệu nguồn"
      };
  }
}

export function formatPolicyBadge(policy: DataSourcePolicyType): {
  text: string;
  className: string;
} {
  switch (policy) {
    case "official":
      return {
        text: "Nguồn chính thống",
        className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      };
    case "user_entered":
      return {
        text: "Người dùng nhập",
        className: "bg-blue-500/10 text-blue-400 border-blue-500/20"
      };
    case "teaching_example":
      return {
        text: "Ví dụ minh họa",
        className: "bg-amber-500/10 text-amber-400 border-amber-500/20"
      };
    case "missing":
    default:
      return {
        text: "Thiếu dữ liệu",
        className: "bg-rose-500/10 text-rose-400 border-rose-500/20"
      };
  }
}
