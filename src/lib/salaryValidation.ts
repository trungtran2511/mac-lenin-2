import type { SalaryInput, ValidationWarning } from "./chapterToolTypes";

interface SalaryValidationContext {
  provinceName?: string;
  minimumMonthlyPayForEnteredHours?: number;
  minimumWageSourceLabel?: string;
}

export function validateSalaryInput(
  input: SalaryInput,
  provinceNameOrContext: string | SalaryValidationContext = ""
): ValidationWarning[] {
  const context: SalaryValidationContext =
    typeof provinceNameOrContext === "string"
      ? { provinceName: provinceNameOrContext }
      : provinceNameOrContext;
  const warnings: ValidationWarning[] = [];

  if (input.workingDaysPerMonth > 31) {
    warnings.push({
      code: "days_too_high",
      severity: "blocking",
      message: "Số ngày làm việc trong tháng không thể lớn hơn 31 ngày."
    });
  }

  if (input.workingDaysPerMonth <= 0) {
    warnings.push({
      code: "days_too_low",
      severity: "blocking",
      message: "Số ngày làm việc trong tháng phải lớn hơn 0."
    });
  }

  if (input.hoursPerDay > 24) {
    warnings.push({
      code: "hours_too_high",
      severity: "blocking",
      message: "Số giờ làm việc trong ngày không thể lớn hơn 24 giờ."
    });
  }

  if (input.hoursPerDay <= 0) {
    warnings.push({
      code: "hours_too_low",
      severity: "blocking",
      message: "Số giờ làm việc trong ngày phải lớn hơn 0."
    });
  }

  if (input.monthlySalary <= 0) {
    warnings.push({
      code: "salary_too_low",
      severity: "blocking",
      message: "Lương tháng phải là số dương lớn hơn 0."
    });
  }

  if (input.familySupportPerMonth < 0) {
    warnings.push({
      code: "support_negative",
      severity: "blocking",
      message: "Trợ cấp gia đình hoặc nguồn hỗ trợ khác không được là số âm."
    });
  }

  if (input.livingCostPerMonth === null || input.livingCostPerMonth <= 0) {
    warnings.push({
      code: "missing_living_cost",
      severity: "warning",
      message: "Nhập chi phí sống thực tế của bạn để đánh giá lương có đủ sống hay không. App không tự điền mức sống ước đoán theo tỉnh/thành."
    });
  } else {
    const minimumMonthlyPay = context.minimumMonthlyPayForEnteredHours ?? 0;

    if (minimumMonthlyPay > 0 && input.livingCostPerMonth < minimumMonthlyPay) {
      warnings.push({
        code: "living_cost_below_minimum_wage_reference",
        severity: "warning",
        message: `Chi phí sống ${input.livingCostPerMonth.toLocaleString()} đ/tháng tại ${context.provinceName || "tỉnh/thành đã chọn"} thấp hơn mức lương tối thiểu theo số giờ bạn nhập (${Math.round(minimumMonthlyPay).toLocaleString()} đ). Đây không phải dữ liệu mức sống chính thức, chỉ là dấu hiệu để bạn kiểm tra lại số đã nhập.`
      });
    }

    if (input.livingCostPerMonth < 1000000) {
      warnings.push({
        code: "living_cost_extremely_low",
        severity: "warning",
        message: "Chi phí sống dưới 1.000.000 đ/tháng là cực kỳ thấp. Vui lòng kiểm tra lại xem có gõ thiếu số 0 hoặc gõ nhầm đơn vị không."
      });
    }

    if (input.livingCostPerMonth > 50000000) {
      warnings.push({
        code: "living_cost_extremely_high",
        severity: "warning",
        message: "Chi phí sống trên 50.000.000 đ/tháng là rất cao. Vui lòng kiểm tra xem có thừa số 0 hay nhầm đơn vị tiền không."
      });
    }
  }

  if (input.hoursPerDay > 16 && input.hoursPerDay <= 24) {
    warnings.push({
      code: "hours_unusual",
      severity: "warning",
      message: "Làm việc trên 16 giờ một ngày là cường độ lao động bất thường, nguy hiểm cho sức khỏe."
    });
  }

  const totalHours = input.hoursPerDay * input.workingDaysPerMonth;
  if (totalHours > 0 && input.monthlySalary > 0) {
    const hourlyWage = input.monthlySalary / totalHours;
    if (hourlyWage < 5000) {
      warnings.push({
        code: "hourly_wage_extremely_low",
        severity: "warning",
        message: `Mức lương theo giờ (${Math.round(hourlyWage).toLocaleString()} đ/giờ) quá thấp, vui lòng kiểm tra lại số liệu nhập.`
      });
    }
  }

  return warnings;
}
