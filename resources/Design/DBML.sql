// =======================
// TABLE: Phòng ban – Departments
// =======================
Table departments 
{
    id_department INT [pk, increment] // Khóa chính
    name VARCHAR(100) [unique, not null] // Tên phòng ban, duy nhất (VD: IT, HR, Kinh doanh)

    description TEXT // Mô tả chi tiết phòng ban
    created_at TIMESTAMP // Thời gian tạo
    updated_at TIMESTAMP // Thời gian cập nhật
}

// =======================
// TABLE: Chức vụ – Positions
// =======================
Table positions 
{
    id_position INT [pk, increment] // Khóa chính
    name VARCHAR(100) [unique, not null] // Tên chức vụ (VD: Developer, Team Lead, Manager)
    level INT [note: "Cấp bậc: 1=staff, 2=lead, 3=manager…"] // Thứ bậc để phân quyền/so sánh

    description TEXT // Mô tả chức vụ
    created_at TIMESTAMP
    updated_at TIMESTAMP
}

// =======================
// TABLE: Nhân viên – Employees
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
    hire_date DATE // Ngày bắt đầu làm việc
    id_department INT [ref: > departments.id_department] // FK -> departments
    id_position INT [ref: > positions.id_position] // FK -> positions    
    status ENUM('active','inactive','resigned') // Trạng thái nhân viên
    description TEXT // Mô tả
    created_at TIMESTAMP
    updated_at TIMESTAMP
}

// =======================
// TABLE: employee_manager quản lí nhân viên
// =======================
Table employee_manager
{
    id_employee_manager INT [pk, increment] // Khóa chính tự tăng
    id_employee INT [ref: > employees.id_employee] // FK -> employees
    id_manager INT [ref: > employees.id_employee] // FK -> employees
    indexes {
        (id_employee, id_manager) [unique] // đảm bảo không trùng
    }
}


// =======================
// TABLE: Vai trò hệ thống / dự án – Roles
// =======================
Table roles 
{
    id_role INT [pk, increment] // Khóa chính
    name VARCHAR(80) [unique, not null, note: "admin','hr','employee, Project Leader, Developer, Tester, Mentor"] // Tên vai trò
    
    description TEXT // Mô tả chi tiết
    created_at TIMESTAMP
    updated_at TIMESTAMP
}

// =======================
// TABLE: Tài khoản – Users
// =======================
Table users 
{
    id_user INT [pk, increment] // Khóa chính
    id_employee INT [unique, ref: > employees.id_employee] // Liên kết với nhân viên
    email VARCHAR(100) [unique, not null] // Email đăng nhập
    password VARCHAR(255) [not null] // Mật khẩu (hash)
    id_role INT [ref: > roles.id_role] // FK -> roles
    last_login TIMESTAMP // Lần đăng nhập gần nhất
    
    description TEXT // Mô tả
    created_at TIMESTAMP
    updated_at TIMESTAMP
}

// =======================
// TABLE: Chấm công – Attendances
// =======================
Table attendances 
{
    id_attendance INT [pk, increment] // Khóa chính
    id_employee INT [ref: > employees.id_employee] // FK -> employees
    check_in DATETIME // Giờ vào
    check_out DATETIME // Giờ ra
    work_hours DECIMAL(5,2) [note: "số giờ làm"] // Số giờ làm việc
    status ENUM('present','absent','late','leave') [default: 'present'] // Trạng thái chấm công
    
    description TEXT // Mô tả thêm
    created_at TIMESTAMP
    updated_at TIMESTAMP
}

// =======================
// TABLE: Lương – Salaries
// =======================
Table salaries 
{
    id_salary INT [pk, increment] // Khóa chính
    id_employee INT [ref: > employees.id_employee] // FK -> employees
    month YEAR [not null] // Tháng lương
    base_salary DECIMAL(15,2) // Lương cơ bản
    bonus DECIMAL(15,2) // Thưởng
    allowance DECIMAL(15,2) // Phụ cấp
    deduction DECIMAL(15,2) // Khấu trừ
    net_salary DECIMAL(15,2) [note: "lương thực nhận"] // Lương thực nhận
    status ENUM('pending','paid') [default: 'pending'] // Trạng thái thanh toán

    description TEXT // Mô tả
    created_at TIMESTAMP
    updated_at TIMESTAMP
}

// =======================
// TABLE: Dự án – Projects
// =======================
Table projects 
{
    id_project INT [pk, increment] // Khóa chính
    name VARCHAR(150) [not null] // Tên dự án
    start_date DATE // Ngày bắt đầu
    end_date DATE // Ngày kết thúc
    status ENUM('planning','in_progress','completed','cancelled') [default: 'planning'] // Trạng thái
    
    description TEXT // Mô tả chi tiết
    created_at TIMESTAMP
    updated_at TIMESTAMP
}

// =======================
// TABLE: Phân công – Assignments
// =======================
Table assignments 
{
    id_employee INT [ref: > employees.id_employee] // FK -> employees
    id_project INT [ref: > projects.id_project] // FK -> projects
    role VARCHAR(100) [note: "vai trò trong dự án (dev, tester, PM…)"] // Vai trò
    assigned_date DATE // Ngày phân công
    
    description TEXT // Mô tả
    created_at TIMESTAMP
    updated_at TIMESTAMP
    primary key(id_employee, id_project) // Khóa chính ghép
}

// =======================
// TABLE: Nghỉ phép – Leaves
// =======================
Table leaves 
{
    id_leave INT [pk, increment] // Khóa chính
    id_employee INT [ref: > employees.id_employee] // FK -> employees
    start_date DATE // Ngày bắt đầu nghỉ
    end_date DATE // Ngày kết thúc nghỉ
    type ENUM('annual','sick','unpaid','other') // Loại nghỉ phép
    reason TEXT // Lý do
    status ENUM('pending','approved','rejected') [default: 'pending'] // Trạng thái đơn
   
    description TEXT // Mô tả
    created_at TIMESTAMP
    updated_at TIMESTAMP
}

// =======================
// TABLE: Đánh giá – Performance Reviews
// =======================
Table performance_reviews 
{
    id_review INT [pk, increment] // Khóa chính
    id_employee INT [ref: > employees.id_employee] // Nhân viên được đánh giá
    id_reviewer INT [ref: > employees.id_employee, note: "người đánh giá"] // Nhân viên đánh giá
    review_date DATE // Ngày đánh giá
    score INT [note: "1-10"] // Điểm đánh giá
    comments TEXT // Nhận xét
    
    description TEXT // Mô tả
    created_at TIMESTAMP
    updated_at TIMESTAMP
}
