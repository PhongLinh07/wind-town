//📌 Nguyên tắc thiết kế DB:

// Bảng cha (1) → không chứa khóa ngoại tới bảng con.

// Bảng con (n) → luôn chứa FK để biết nó thuộc về ông cha nào.


// =======================
// TABLE: Hierarchy - phân cấp theo chức vụ và cấp bậc
// 1 nhân viên chỉ có 1 chức vụ vì: đây là 1 công ty có độ phân hóa 
// 1 nhân viên chỉ có 1 chức vụ, gắn liền với thứ bậc, lương, vị trí trong công ty.
// =======================
Table hierarchys
{
  id_hierarchy INT [pk, increment] // Khóa chính rễ ràng truy vấn
  
  name_position VARCHAR(100) [unique, not null]    // Tên chức vụ: Developer, Team Lead, Manager
  name_level VARCHAR(50) [not null, note: "Tên cấp bậc, ví dụ: Junior, Senior, Lead"]

  salary_multiplier DECIMAL(15,2) [note: " hệ số lương cơ bản tương ứng cấp bậc dùng nhân base_salary"]
  allowance DECIMAL(15,2) [note: "Phụ cấp theo cấp bậc là tiền cố định"]

  description TEXT // Mô tả
  created_at TIMESTAMP
  updated_at TIMESTAMP

  indexes {
    (name_position, name_level) [unique]
  }
}

// =======================
// TABLE: Nhân viên – Employees
// 1 nhân viên chỉ có 1 profile tạm thời để chung cho ít bảng
// =======================
Table employees 
{
    id_employee INT [pk, increment] // Khóa chính

    name VARCHAR(150) [not null] // Họ và tên nhân viên
    gender INT [note: "1=male, 0=female, 3=unknown"] // Giới tính
    cccd VARCHAR(20) [unique, not null, note: "giữ dạng text để không mất số 0 đầu"] // CCCD/CMND
    date_of_birth DATE // Ngày sinh
    address VARCHAR(300) // Địa chỉ
    email VARCHAR(150) [unique, not null] // Email công việc
    phone VARCHAR(15) // Số điện thoại

    bank_infor  VARCHAR(20) [note:"BankType_id"]// bank lương: const str = 'vietcombank_123456789'; const [bankName, accountNumber] = str.split('_');

    hire_date DATE // Ngày bắt đầu làm việc

    id_hierarchy INT [ref: > hierarchys.id_hierarchy] // FK -> hierarchy  

    status ENUM('active','inactive','resigned') // Trạng thái nhân viên

    description TEXT // Mô tả
    created_at TIMESTAMP
    updated_at TIMESTAMP
}



// =======================
// TABLE: Chấm công – Attendances
// 1 nhân viên có 1 bảng chấm công trong 1 ngày
// =======================
Table attendances 
{
    id_attendance INT [pk, increment] // Khóa chính
    id_employee INT [ref: > employees.id_employee] // FK -> employees

    of_date DATE // ngày nào
    office_hours DECIMAL(5,2)
    over_time DECIMAL(5,2) // luôn bằng 0 nếu office_hours < 8
    late_time DECIMAL(5,2)   // 8 - over_time > 0 <=>  office_hours > 0
    is_night_shift bool

    description TEXT // Mô tả thêm
    created_at TIMESTAMP
    updated_at timestamp
    indexes {
       (id_employee, of_date) [unique]
    }
}

// =======================
// TABLE: Hợp đồng không xác định thời hạn (indefinite)
// 1 nhân viên chỉ có thể có 1 hợp đồng có hiệu lực 
// nếu 2 hợp đồng thì sẽ có 2 lương: 8h mà lại có 2 lương=> bất khả thi
// =======================
Table contracts 
{
    id_contract INT [pk, increment] // Khóa chính
    id_employee INT [ref: > employees.id_employee] // FK -> employees
    
    contract_type ENUM('fixed_term','indefinite','seasonal') // Loại hợp đồng
    base_salary DECIMAL(15,2) // Lương cơ bản | lý do đặt ở đây vì đề phòng lương theo thỏa thuận

    effective_date DATE // Ngày bắt đầu hiệu lực
    expiry_date DATE // Ngày kết thúc hiệu lực (có thể NULL)
    status ENUM('active','expired','terminated') // Trạng thái hợp đồng

    description TEXT // Mô tả
    created_at TIMESTAMP
    updated_at TIMESTAMP

    note: "Ràng buộc: chỉ có thể tồn tại 1 bản hợp đồng còn hiệu lực"

}

// =======================
// TABLE: Lương chi tiết – Salary_details
// 1 bảng lương cơ bản(còn hiệu lực) có 1 bảng lương chi tiết / tháng
// =======================
Table salary_details
{
    id_salary_details INT [pk, increment] // Khóa chính
    id_contract INT [ref: > contracts.id_contract] // FK -> salaries
    approved_by INT [ref: > employees.id_employee]

    salary_month DATE [not null] // Tháng lương (dùng ngày = 01)

    overtime DECIMAL(15,2) [default: 0]
    bonus DECIMAL(15,2) [default: 0, not null] // Thưởng lễ , tết
    attendance_bonus DECIMAL(15,2) [default: 0] // Phụ cấp chuyên cần | nếu ko đủ ngày công trừ (50% phụ cấp)
    deduction DECIMAL(15,2) [default: 0, not null] // Khấu trừ | phạt | bảo hiểm | thuế
   
    net_salary DECIMAL(15,2) // Lương thực nhận

    status ENUM('pending','paid') [default: 'pending'] // Trạng thái trả lương

    description TEXT // Mô tả
    created_at TIMESTAMP [default: `current_timestamp`]
    updated_at TIMESTAMP [default: `current_timestamp`]

    indexes {
        (id_contract, salary_month) [unique] // Mỗi hợp đồng lương chỉ có 1 bản ghi/tháng
    }

    note: "Ràng buộc: id_employee phải khác approved_by (không cho tự duyệt)"
}



// =======================
// TABLE: Nghỉ phép – Leaves
// 1 nhân viên có nhiều lần nghỉ phép (không trùng thời gian)
// =======================
Table leaves 
{
    id_leave INT [pk, increment] // Khóa chính
    id_employee INT [ref: > employees.id_employee] // FK -> employees
    approved_by INT [ref: > employees.id_employee] // FK -> employees
    
    start_date DATE // Ngày bắt đầu nghỉ
    end_date DATE // Ngày kết thúc nghỉ
    type ENUM('annual','sick','unpaid','other') // Loại nghỉ phép
    reason TEXT // Lý do
    status ENUM('pending','approved','rejected') [default: 'pending'] // Trạng thái đơn
    
    description TEXT // Mô tả
    created_at TIMESTAMP
    updated_at TIMESTAMP

    indexes {
        (id_employee, start_date, end_date) 
    }

    note: "Ràng buộc: id_employee phải khác approved_by (không cho tự duyệt) | chỉ 1 bản phép có hiệu lực tồn tại"
}


// =======================
// TABLE: Quy định lương – Payroll_rules
// định nghĩa kiểu dữ liệu đặc trung cho sys. dùng chung cho toàn bộ nhân viên
// =======================
Table payroll_rules
{
    id_rule INT [pk, increment]

    type ENUM('attendance_bonus','overtime_rate','night_shift','holiday_bonus','meal_allowance','late_penalty','other')
    value_type ENUM('money','multiplier') [DEFAULT: 'money']
    value DECIMAL(15,2)  //-- số tiền hoặc % áp dụng
    
    effective_date DATE
    expiry_date DATE  //-- NULL nếu áp dụng vô thời hạn

    description TEXT
    created_at TIMESTAMP
    updated_at TIMESTAMP
}
