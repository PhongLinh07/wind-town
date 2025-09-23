// Salary.js
class Salary {
    static holiday = 0; 
    static insuranceRule;
    static overtimeRule;
    static allowanceRule;
    static lateTimeRule;
    static rollCycleDate;
    static id_approved_by;

    // Hàm format ngày từ yyyy-mm-dd sang dd-mm-yyyy
    static formatDate(dateString) {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    }

    // Hàm format tiền VND
    static formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }

    // Khởi tạo các rule
    static async Init() {
        try {
            this.insuranceRule = await getRule("Insurance_Rate", 10.5, "percentage");
            this.overtimeRule = await getRule("Overtime_Rate", 150, "percentage");
            this.lateTimeRule = await getRule("Late_Time_Rate", 200, "percentage");
            this.rollCycleDate = await getRule("RollCycle_Date_Fixed", 10, "fixed_amount");
        } catch (err) {
            console.error("Init Salary rules failed:", err.message);
            this.insuranceRule = { value: 10.5, value_type: "percentage" };
            this.overtimeRule = { value: 150, value_type: "percentage" };
            this.lateTimeRule = { value: 200, value_type: "percentage" };
            this.rollCycleDate = { value: 10, value_type: "fixed_amount" };
        }
    }

    // Tính startDate dựa vào rollCycleDate tháng trước, endDate là do user nhập
    static getPayrollCycleFromEndDate(endDateInput) {
        const cutoffDay = this.rollCycleDate?.value || 10;

        let endDate;
        if (typeof endDateInput === "string") {
            const [year, month, day] = endDateInput.split('-').map(Number);
            endDate = new Date(year, month - 1, day);
        } else if (endDateInput instanceof Date) {
            endDate = new Date(endDateInput.getFullYear(), endDateInput.getMonth(), endDateInput.getDate());
        } else {
            throw new Error("endDateInput phải là string hoặc Date");
        }

        let startMonth = endDate.getMonth() - 1;
        let startYear = endDate.getFullYear();
        if (startMonth < 0) {
            startMonth = 11;
            startYear -= 1;
        }

        const startDate = new Date(startYear, startMonth, cutoffDay);

        // Định dạng dd-mm-yyyy
        const startDateStr = `${String(startDate.getDate()).padStart(2,'0')}-${String(startDate.getMonth()+1).padStart(2,'0')}-${startDate.getFullYear()}`;
        const endDateStr = `${String(endDate.getDate()).padStart(2,'0')}-${String(endDate.getMonth()+1).padStart(2,'0')}-${endDate.getFullYear()}`;

        return { startDate, endDate, startDateStr, endDateStr };
    }

    static countSundays(startDate, endDate) {
        let count = 0;
        const current = new Date(startDate);
        const end = new Date(endDate);
        while (current <= end) {
            if (current.getDay() === 0) count++;
            current.setDate(current.getDate() + 1);
        }
        return count;
    }

    static calcStandardWorkingDays(startDate, endDate) {
        const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        const sundays = this.countSundays(startDate, endDate);
        return totalDays - sundays;
    }

    // ==============================
    // Hàm chính: tính lương và post vào salary_details
    // ==============================
    static async calculatePayroll(endDateInput, globalBonus = 0) {
        await this.Init();
        const { startDate, endDate, startDateStr, endDateStr } = this.getPayrollCycleFromEndDate(endDateInput);
        console.log(`Chu kỳ tính lương: ${startDateStr} → ${endDateStr}`);

        const employees = await fetch('modelController/employees').then(res => res.json());
        const results = [];

        for (let emp of employees) {
            // Lấy contract còn hiệu lực
            let contract;
            try {
                const resContract = await fetch(`/modelController/contracts/getContractsByCycle/${emp.id_employee}?start=${this.formatDateForAPI(startDate)}&end=${this.formatDateForAPI(endDate)}`);
                if (!resContract.ok) throw new Error("Không lấy được contract");
                const contractData = await resContract.json();
                contract = contractData.data;
            } catch (err) {
                console.error(`Không lấy được contract nhân viên ${emp.id_employee}:`, err.message);
                continue;
            }
            if (!contract) continue;

            // Lấy hierarchy
            let hierarchy = null;
            try {
                const resHierarchy = await fetch(`/modelController/hierarchys/${emp.id_hierarchy}`);
                if (!resHierarchy.ok) throw new Error("Không lấy được hierarchy");
                hierarchy = await resHierarchy.json();
            } catch (err) {
                console.error(`Không lấy được hierarchy nhân viên ${emp.id_employee}:`, err.message);
            }

            // Lấy attendance
            let attendance = [];
            try {
                const res = await fetch(`/modelController/attendances/${emp.id_employee}/getByCycle?start=${this.formatDateForAPI(startDate)}&end=${this.formatDateForAPI(endDate)}`);
                if (!res.ok) throw new Error("Không lấy được attendance");
                const data = await res.json();
                attendance = Array.isArray(data.datas) ? data.datas : [];
            } catch (err) {
                console.error(`Không lấy được attendance nhân viên ${emp.id_employee}:`, err.message);
                continue;
            }
            if (attendance.length === 0) continue;

            // Tính tổng giờ công
            let office_hours = 0, overtime = 0, late_time = 0;
            attendance.forEach(att => {
                office_hours += parseFloat(att.office_hours) || 0;
                overtime += parseFloat(att.overtime) || 0;
                late_time += parseFloat(att.late_time) || 0;
            });

            const workingDays = this.calcStandardWorkingDays(startDate, endDate);
            const totalWorkedHours = office_hours + (this.holiday * 8);
            const salary_per_hour = contract.base_salary / (workingDays * 8);

            // Base salary + hệ số
            let base_salary = contract.base_salary;
            let salary_multiplier = 1;
            if (hierarchy && hierarchy.salary_multiplier > 0) {
                salary_multiplier = parseFloat(hierarchy.salary_multiplier);
                base_salary = contract.base_salary * salary_multiplier;
            }

            // Phụ cấp chuyên cần
            let attendance_bonus = 0;
            if (totalWorkedHours >= workingDays * 8 && hierarchy) {
                attendance_bonus = parseFloat(hierarchy.allowance || 0);
            }

            // Overtime, late, insurance
            const overtime_amount = overtime * salary_per_hour * (parseFloat(this.overtimeRule.value)/100);
            const late_deduction = late_time * salary_per_hour * (parseFloat(this.lateTimeRule.value)/100);
            const insurance_deduction = base_salary * (parseFloat(this.insuranceRule.value)/100);

            // ✅ Cộng bonus vào net_salary
            const net_salary = base_salary + overtime_amount + attendance_bonus + globalBonus - late_deduction - insurance_deduction;

            // Build object salary_details
            const salaryDetail = {
                id_contract: contract.id_contract,
                approved_by: this.id_approved_by,
                salary_month: `${String(startDate.getDate()).padStart(2,'0')}-${String(startDate.getMonth()+1).padStart(2,'0')}-${startDate.getFullYear()}`,
                base_salary: base_salary,
                salary_multiplier: salary_multiplier,
                office_hours: office_hours,
                over_time: overtime_amount,
                late_time: late_time,
                bonus: globalBonus,
                attendance_bonus: attendance_bonus,
                deduction: late_deduction + insurance_deduction,
                net_salary: Math.max(0, net_salary),
                status: "pending",
                description: `Lương từ ${startDateStr} đến ${endDateStr} cho nhân viên ${emp.name}`
            };

            // Post lên API
            try {
                const saved = await postSalaryDetail(salaryDetail);
                results.push(saved);
                console.log(`Đã tính lương cho nhân viên ${emp.name}: ${this.formatCurrency(net_salary)}`);
            } catch (err) {
                console.error("Lỗi khi lưu salary_detail:", err.message);
            }
        }

        return results;
    }

    // Hàm format ngày cho API (giữ nguyên yyyy-mm-dd cho API)
    static formatDateForAPI(date) {
        return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
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

async function postSalaryDetail(data) {
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const res = await fetch(`/modelController/salary_details`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": token
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Post salary_detail failed");
    }
    return await res.json();
}