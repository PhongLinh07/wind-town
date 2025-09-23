class Salary {
    static holiday = 0; // Số ngày nghỉ lễ
    static insuranceRule; // Rule bảo hiểm (%)
    static overtimeRule;  // Rule tăng ca (%)
    static allowanceRule; // Rule phụ cấp (fixed_amount hoặc %)
    static lateTimeRule;  // Rule trừ đi muộn (%)
    static rollCycleDate; // Ngày cố định của tháng mới
    static id_approved_by; // ID người duyệt lương

    // =============================
    // Khởi tạo rule
    // =============================
    static async Init() {
        try {
            this.insuranceRule = await getRule("Insurance_Rate", 10.5, "percentage");
            this.overtimeRule = await getRule("Overtime_Rate", 150, "percentage");
            this.allowanceRule = await getRule("Allowance_Fixed", 500000, "fixed_amount");
            this.lateTimeRule = await getRule("Late_Time_Rate", 200, "percentage");
            this.rollCycleDate = await getRule("RollCycle_Date_Fixed", 10, "fixed_amount");
        } catch (err) {
            console.error("Init Salary rules failed:", err.message);
        }
    }

    // =============================
    // Lấy chu kỳ lương theo rollCycleDate
    // =============================
    static getPayrollCycle(year, month) {
        const cutoffDay = this.rollCycleDate.value;
        let startMonth = month - 1;
        let startYear = year;
        if (startMonth < 1) {
            startMonth = 12;
            startYear -= 1;
        }
        const startDate = new Date(startYear, startMonth - 1, cutoffDay);
        const endDate = new Date(year, month - 1, cutoffDay - 1);
        return { startDate, endDate };
    }

    // =============================
    // Đếm số Chủ nhật trong chu kỳ
    // =============================
    static countSundays(year, month) {
        const { startDate, endDate } = this.getPayrollCycle(year, month);
        let count = 0;
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            if (d.getDay() === 0) count++;
        }
        return count;
    }

    // =============================
    // Tính số ngày công chuẩn
    // Ngày nghỉ lễ vẫn tính công
    // =============================
    static calcStandardWorkingDays(year, month) {
        const { startDate, endDate } = this.getPayrollCycle(year, month);
        const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        const sundays = this.countSundays(year, month);
        return totalDays - sundays;
    }

    // =============================
    // Tính lương, map và post salary_details
    // =============================
    static async calculatePayroll(year, month) {
        await this.Init(); // Load tất cả rule

        const { startDate, endDate } = this.getPayrollCycle(year, month);
        const employees = await fetch('modelController/employees').then(res => res.json());
        const results = [];

        for (let emp of employees) {
            const contract = await fetch(
                `/modelController/contracts/${emp.id}?start=${startDate.toISOString()}&end=${endDate.toISOString()}/getContractsByCycle`
            ).then(res => res.json());
            if (!contract) continue;

            const attendance = await fetch(
                `/modelController/attendances/${emp.id}?start=${startDate.toISOString()}&end=${endDate.toISOString()}/getByCycle`
            ).then(res => res.json());
            if (!attendance) continue;

            // -----------------------------
            // Biến tạm tính giờ
            // -----------------------------
            let office_hours = 0, overtime = 0, late_time = 0;
            attendance.forEach(att => {
                office_hours += att.office_hours;
                overtime += att.overtime;
                late_time += att.late_time;
            });

            const workingDays = this.calcStandardWorkingDays(year, month);
            const totalWorkedHours = office_hours + (this.holiday * 8); // Lễ vẫn tính công
            const salary_of_hour = contract.base_salary / (workingDays * 8);

            // -----------------------------
            // 1️⃣ Lương cơ bản + phụ cấp
            // -----------------------------
            let base_salary = 0;
            let attendance_bonus = 0;
            if (totalWorkedHours >= workingDays * 8) {
                base_salary = contract.base_salary;
                attendance_bonus = (this.allowanceRule.value_type === "percentage")
                    ? base_salary * (this.allowanceRule.value / 100)
                    : this.allowanceRule.value;
            } else {
                base_salary = totalWorkedHours * salary_of_hour;
            }

            // -----------------------------
            // 2️⃣ Tăng ca
            // -----------------------------
            const overtime_amount = overtime * salary_of_hour * (this.overtimeRule.value / 100);

            // -----------------------------
            // 3️⃣ Trừ đi muộn
            // -----------------------------
            const late_deduction = late_time * salary_of_hour * (this.lateTimeRule.value / 100);

            // -----------------------------
            // 4️⃣ Trừ bảo hiểm
            // -----------------------------
            const insurance_deduction = contract.base_salary * (this.insuranceRule.value / 100);

            // -----------------------------
            // 5️⃣ Lương thực nhận
            // -----------------------------
            const net_salary = base_salary + overtime_amount + attendance_bonus - late_deduction - insurance_deduction;

            // -----------------------------
            // Map dữ liệu để post
            // -----------------------------
            const salaryDetail = {
                id_contract: contract.id_contract,
                approved_by: this.id_approved_by,
                salary_month: `${year}-${String(month).padStart(2, "0")}-01`,
                overtime: overtime_amount,
                bonus: 0,
                attendance_bonus: attendance_bonus,
                deduction: late_deduction + insurance_deduction,
                net_salary: net_salary,
                status: "pending",
                description: `Lương tháng ${month}/${year} cho nhân viên ${emp.name}`
            };

            try {
                const saved = await postSalaryDetail(salaryDetail);
                results.push(saved);
            } catch (err) {
                console.error("Lỗi khi lưu salary_detail:", err.message);
            }
        }

        return results;
    }
}

// =============================
// API lấy rule
// =============================
async function getRule(type, defaultValue = 0, defaultValueType = 'fixed_amount') {
    const res = await fetch(`modelController/payroll_rules/getRule/${type}?defaultValue=${defaultValue}&defaultValueType=${defaultValueType}`);
    if (!res.ok) throw new Error("Không lấy được rule");
    return await res.json();
}

// =============================
// API post salary_detail
// =============================
async function postSalaryDetail(data) {
    const res = await fetch(`/modelController/salary_details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Post salary_detail failed");
    }
    return await res.json();
}
