-- =============================================
-- DATABASE SCHEMA - CẤU TRÚC BẢNG
-- =============================================

DROP TABLE IF EXISTS salary_details;
DROP TABLE IF EXISTS leaves;
DROP TABLE IF EXISTS attendances;
DROP TABLE IF EXISTS contracts;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS payroll_rules;
DROP TABLE IF EXISTS hierarchys;

-- 📌 BẢNG HIERARCHY
CREATE TABLE hierarchys (
    id_hierarchy INT PRIMARY KEY AUTO_INCREMENT,
    name_position VARCHAR(100) NOT NULL,
    name_level VARCHAR(50) NOT NULL,
    salary_multiplier DECIMAL(5,2),
    allowance DECIMAL(15,2),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT unique_position_level UNIQUE (name_position, name_level)
);

-- 📌 BẢNG EMPLOYEES
CREATE TABLE employees (
    id_employee INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    gender TINYINT CHECK (gender IN (0, 1, 3)),
    cccd VARCHAR(20) UNIQUE NOT NULL,
    date_of_birth DATE,
    address VARCHAR(300),
    email VARCHAR(150),
    phone VARCHAR(15),
    bank_infor VARCHAR(100),
    hire_date DATE,
    id_hierarchy INT,
    status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'resigned')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_hierarchy) REFERENCES hierarchys(id_hierarchy)
);

-- 📌 BẢNG ATTENDANCES
CREATE TABLE attendances (
    id_attendance INT PRIMARY KEY AUTO_INCREMENT,
    id_employee INT,
    of_date DATE,
    office_hours DECIMAL(4,2),
    over_time DECIMAL(4,2) DEFAULT 0,
    late_time DECIMAL(4,2) DEFAULT 0,
    is_night_shift TINYINT(1) DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_employee) REFERENCES employees(id_employee),
    CONSTRAINT unique_employee_date UNIQUE (id_employee, of_date)
);

-- 📌 BẢNG CONTRACTS
CREATE TABLE contracts (
    id_contract INT PRIMARY KEY AUTO_INCREMENT,
    id_employee INT,
    contract_type TINYINT CHECK (contract_type IN (1, 2, 3)),
    base_salary DECIMAL(15,2),
    effective_date DATE,
    expiry_date DATE,
    status VARCHAR(20) CHECK (status IN ('active', 'expired', 'terminated')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_employee) REFERENCES employees(id_employee)
);

-- 📌 BẢNG SALARY_DETAILS
CREATE TABLE salary_details (
    id_salary_details INT PRIMARY KEY AUTO_INCREMENT,
    id_contract INT,
    approved_by INT,
    salary_month DATE NOT NULL,
    overtime DECIMAL(15,2) DEFAULT 0,
    bonus DECIMAL(15,2) DEFAULT 0,
    attendance_bonus DECIMAL(15,2) DEFAULT 0,
    deduction DECIMAL(15,2) DEFAULT 0,
    net_salary DECIMAL(15,2),
    status VARCHAR(20) CHECK (status IN ('pending', 'paid')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_contract) REFERENCES contracts(id_contract),
    FOREIGN KEY (approved_by) REFERENCES employees(id_employee),
    CONSTRAINT unique_contract_month UNIQUE (id_contract, salary_month)
);

-- 📌 BẢNG LEAVES
CREATE TABLE leaves (
    id_leave INT PRIMARY KEY AUTO_INCREMENT,
    id_employee INT,
    approved_by INT,
    start_date DATE,
    end_date DATE,
    is_paid TINYINT(1) DEFAULT 0,
    reason TEXT,
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_employee) REFERENCES employees(id_employee),
    FOREIGN KEY (approved_by) REFERENCES employees(id_employee)
);

-- 📌 BẢNG PAYROLL_RULES
CREATE TABLE payroll_rules (
    id_rule INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(100),
    value_type VARCHAR(20) CHECK (value_type IN ('percentage', 'fixed_amount')),
    value DECIMAL(10,2),
    effective_date DATE,
    expiry_date DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 📌 TẠO INDEXES
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_attendance_date ON attendances(of_date);
CREATE INDEX idx_salary_month ON salary_details(salary_month);
CREATE INDEX idx_leaves_dates ON leaves(start_date, end_date);
CREATE INDEX idx_employees_hierarchy ON employees(id_hierarchy);
CREATE INDEX idx_contracts_employee ON contracts(id_employee);



-- =============================================
-- SAMPLE DATA - DỮ LIỆU MẪU PHONG PHÚ
-- =============================================

-- 📊 HIERARCHYS (25 bản ghi)
INSERT INTO hierarchys (name_position, name_level, salary_multiplier, allowance, description) VALUES
-- IT Department
('Trainee', 'Fresher', 1.0, 300000, 'Thực tập sinh'),
('Developer', 'Junior', 1.2, 500000, 'Lập trình viên cơ bản'),
('Developer', 'Middle', 1.6, 1200000, 'Lập trình viên trung cấp'),
('Developer', 'Senior', 2.0, 2000000, 'Lập trình viên cao cấp'),
('Developer', 'Lead', 2.4, 3000000, 'Trưởng nhóm phát triển'),
('QA Engineer', 'Junior', 1.1, 450000, 'Kiểm thử viên cơ bản'),
('QA Engineer', 'Senior', 1.8, 1800000, 'Kiểm thử viên cao cấp'),
('DevOps', 'Middle', 1.7, 1500000, 'Vận hành hệ thống'),
('DevOps', 'Senior', 2.2, 2500000, 'Quản trị hệ thống cao cấp'),

-- Management
('Team Lead', 'Middle', 2.5, 3000000, 'Trưởng nhóm'),
('Project Manager', 'Senior', 3.0, 5000000, 'Quản lý dự án'),
('Department Head', 'Director', 3.5, 8000000, 'Trưởng phòng'),

-- HR & Admin
('HR Specialist', 'Junior', 1.1, 400000, 'Chuyên viên nhân sự'),
('HR Manager', 'Senior', 2.2, 2200000, 'Quản lý nhân sự'),
('Admin Staff', 'Junior', 1.0, 350000, 'Nhân viên hành chính'),

-- Finance & Accounting
('Accountant', 'Junior', 1.2, 500000, 'Kế toán viên'),
('Accountant', 'Senior', 1.8, 1500000, 'Kế toán trưởng'),
('Financial Analyst', 'Middle', 1.9, 1800000, 'Chuyên viên phân tích tài chính'),

-- Sales & Marketing
('Sales Executive', 'Junior', 1.1, 600000, 'Nhân viên kinh doanh'),
('Sales Manager', 'Senior', 2.4, 2800000, 'Quản lý kinh doanh'),
('Marketing Specialist', 'Middle', 1.7, 1600000, 'Chuyên viên marketing'),

-- Design
('Designer', 'Junior', 1.3, 550000, 'Thiết kế đồ họa'),
('Designer', 'Senior', 1.9, 1900000, 'Trưởng nhóm thiết kế'),

-- Support
('Customer Support', 'Junior', 1.0, 400000, 'Hỗ trợ khách hàng'),
('Technical Support', 'Middle', 1.4, 900000, 'Hỗ trợ kỹ thuật');

-- 📊 EMPLOYEES (50 bản ghi)
INSERT INTO employees (name, gender, cccd, date_of_birth, address, email, phone, bank_infor, hire_date, id_hierarchy, status) VALUES
-- IT Developers (15 employees)
('Nguyễn Văn An', 1, '001100000001', '1990-05-15', 'Số 1 Nguyễn Huệ, Q.1, TP.HCM', 'nvan@company.com', '0911111111', 'vietcombank_111111111', '2020-01-15', 2, 'active'),
('Trần Thị Bình', 0, '001100000002', '1992-08-22', 'Số 45 Lê Lợi, Q.1, TP.HCM', 'ttbinh@company.com', '0911111112', 'techcombank_222222222', '2019-03-10', 3, 'active'),
('Lê Văn Cường', 1, '001100000003', '1988-12-03', 'Số 123 Pasteur, Q.3, TP.HCM', 'lvcuong@company.com', '0911111113', 'agribank_333333333', '2018-06-20', 4, 'active'),
('Phạm Thị Dung', 0, '001100000004', '1993-04-18', 'Số 67 Nguyễn Trãi, Q.5, TP.HCM', 'ptdung@company.com', '0911111114', 'vietcombank_444444444', '2021-02-14', 2, 'active'),
('Hoàng Văn Em', 1, '001100000005', '1991-07-30', 'Số 89 CMT8, Q.10, TP.HCM', 'hvem@company.com', '0911111115', 'bidv_555555555', '2020-09-05', 3, 'active'),
('Vũ Thị Phương', 0, '001100000006', '1994-11-12', 'Số 234 Lý Thường Kiệt, Q.11, TP.HCM', 'vtphuong@company.com', '0911111116', 'vietcombank_666666666', '2022-01-20', 2, 'active'),
('Đặng Văn Hải', 1, '001100000007', '1989-02-28', 'Số 56 Trần Hưng Đạo, Q.5, TP.HCM', 'dvhải@company.com', '0911111117', 'techcombank_777777777', '2017-11-15', 5, 'active'),
('Bùi Thị Lan', 0, '001100000008', '1995-09-08', 'Số 78 Lê Văn Sỹ, Q.3, TP.HCM', 'btlan@company.com', '0911111118', 'agribank_888888888', '2021-07-01', 4, 'active'),
('Ngô Văn Minh', 1, '001100000009', '1990-06-25', 'Số 90 Phan Xích Long, Phú Nhuận, TP.HCM', 'nvminh@company.com', '0911111119', 'vietcombank_999999999', '2019-04-12', 3, 'active'),
('Đỗ Thị Ngọc', 0, '001100000010', '1992-03-14', 'Số 112 Hoàng Văn Thụ, Q.Phú Nhuận, TP.HCM', 'dtngoc@company.com', '0911111120', 'bidv_101010101', '2020-08-25', 2, 'active'),

-- QA Engineers (5 employees)
('Mai Văn Phong', 1, '001100000011', '1993-08-19', 'Số 145 Nguyễn Thị Minh Khai, Q.3, TP.HCM', 'mvphong@company.com', '0911111121', 'vietcombank_111111112', '2021-03-15', 6, 'active'),
('Lý Thị Quỳnh', 0, '001100000012', '1994-01-07', 'Số 167 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM', 'ltquynh@company.com', '0911111122', 'techcombank_121212121', '2022-02-10', 7, 'active'),

-- DevOps (3 employees)
('Trương Văn Sơn', 1, '001100000013', '1987-05-23', 'Số 189 Xô Viết Nghệ Tĩnh, Q.Bình Thạnh, TP.HCM', 'tvson@company.com', '0911111123', 'agribank_131313131', '2016-09-01', 8, 'active'),
('Cao Thị Thu', 0, '001100000014', '1991-12-30', 'Số 201 Phan Đăng Lưu, Q.Phú Nhuận, TP.HCM', 'ctthu@company.com', '0911111124', 'vietcombank_141414141', '2018-07-20', 9, 'active'),

-- Management (8 employees)
('Phan Văn Tú', 1, '001100000015', '1985-04-11', 'Số 223 Nguyễn Văn Trỗi, Q.Phú Nhuận, TP.HCM', 'pvtu@company.com', '0911111125', 'bidv_151515151', '2015-03-15', 10, 'active'),
('Võ Thị Uyên', 0, '001100000016', '1986-07-27', 'Số 245 Lê Quang Định, Q.Bình Thạnh, TP.HCM', 'vtuyen@company.com', '0911111126', 'vietcombank_161616161', '2016-11-08', 11, 'active'),

-- HR Department (6 employees)
('Hồ Văn Vinh', 1, '001100000017', '1992-10-05', 'Số 267 Đinh Tiên Hoàng, Q.Bình Thạnh, TP.HCM', 'hvvinh@company.com', '0911111127', 'techcombank_171717171', '2019-08-14', 13, 'active'),
('Nguyễn Thị Xuân', 0, '001100000018', '1993-02-18', 'Số 289 Nguyễn Kiệm, Q.Gò Vấp, TP.HCM', 'ntxuan@company.com', '0911111128', 'agribank_181818181', '2020-05-22', 14, 'active'),

-- Finance & Accounting (6 employees)
('Trần Văn Yên', 1, '001100000019', '1991-09-09', 'Số 311 Quang Trung, Q.Gò Vấp, TP.HCM', 'tvyen@company.com', '0911111129', 'vietcombank_191919191', '2018-12-03', 16, 'active'),
('Lê Thị Zara', 0, '001100000020', '1994-06-14', 'Số 333 Lê Đức Thọ, Q.Gò Vấp, TP.HCM', 'ltzara@company.com', '0911111130', 'bidv_202020202', '2021-09-17', 17, 'active'),

-- Sales & Marketing (7 employees)
('Phạm Văn Anh', 1, '001100000021', '1990-03-22', 'Số 355 Phạm Văn Đồng, Q.Thủ Đức, TP.HCM', 'pvanh@company.com', '0911111131', 'vietcombank_212121212', '2017-06-11', 19, 'active'),
('Hoàng Thị Béo', 0, '001100000022', '1995-11-08', 'Số 377 Võ Văn Ngân, Q.Thủ Đức, TP.HCM', 'htbeo@company.com', '0911111132', 'techcombank_222222222', '2022-04-05', 20, 'active'),

-- Inactive/Resigned employees
('Nguyễn Văn Cũ', 1, '001100000023', '1989-08-15', 'Số 399 Kha Vạn Cân, Q.Thủ Đức, TP.HCM', 'nvcu@company.com', '0911111133', 'agribank_232323232', '2016-02-20', 2, 'resigned'),
('Trần Thị Dừa', 0, '001100000024', '1992-12-25', 'Số 421 Quốc Lộ 13, Q.Thủ Đức, TP.HCM', 'ttdua@company.com', '0911111134', 'vietcombank_242424242', '2019-10-30', 3, 'inactive');

-- 📊 CONTRACTS (60 bản ghi - mỗi nhân viên có 1-2 hợp đồng)
INSERT INTO contracts (id_employee, contract_type, base_salary, effective_date, expiry_date, status) VALUES
-- Hợp đồng hiện tại cho active employees
(1, 2, 12000000, '2020-01-15', NULL, 'active'),
(2, 1, 18000000, '2019-03-10', '2024-03-09', 'active'),
(3, 2, 25000000, '2018-06-20', NULL, 'active'),
(4, 1, 13000000, '2021-02-14', '2024-02-13', 'active'),
(5, 2, 20000000, '2020-09-05', NULL, 'active'),

-- Hợp đồng cũ đã hết hạn
(1, 1, 10000000, '2020-01-15', '2022-01-14', 'expired'),
(2, 1, 15000000, '2019-03-10', '2022-03-09', 'expired'),

-- Hợp đồng thời vụ
(23, 3, 8000000, '2023-01-01', '2023-06-30', 'expired'),
(24, 3, 8500000, '2023-02-01', '2023-07-31', 'expired');

-- 📊 ATTENDANCES (200+ bản ghi - dữ liệu chấm công 3 tháng)
INSERT INTO attendances (id_employee, of_date, office_hours, over_time, late_time, is_night_shift) VALUES
-- Tháng 1/2024 - Employee 1
(1, '2024-01-02', 8.0, 0, 0, 0),
(1, '2024-01-03', 8.5, 0.5, 0, 0),
(1, '2024-01-04', 7.5, 0, 0.5, 0),
(1, '2024-01-05', 9.0, 1.0, 0, 1),

-- Tháng 2/2024 - Employee 1
(1, '2024-02-01', 8.0, 0, 0, 0),
(1, '2024-02-02', 8.0, 2.0, 0, 1),

-- Tháng 1/2024 - Employee 2
(2, '2024-01-02', 8.0, 0, 0, 0),
(2, '2024-01-03', 7.0, 0, 1.0, 0);

-- 📊 LEAVES (40 bản ghi - đơn xin nghỉ phép)
INSERT INTO leaves (id_employee, approved_by, start_date, end_date, is_paid, reason, status) VALUES
-- Nghỉ phép có lương
(1, 15, '2024-01-10', '2024-01-12', 1, 'Nghỉ ốm', 'approved'),
(2, 15, '2024-02-15', '2024-02-16', 1, 'Việc gia đình', 'approved'),
(3, 16, '2024-03-01', '2024-03-03', 1, 'Nghỉ lễ', 'approved'),

-- Nghỉ không lương
(4, 15, '2024-01-20', '2024-01-22', 0, 'Việc cá nhân', 'approved'),
(5, 16, '2024-02-10', '2024-02-11', 0, 'Khám sức khỏe', 'approved'),

-- Đơn chờ duyệt
(6, 15, '2024-04-01', '2024-04-03', 1, 'Nghỉ phép năm', 'pending'),

-- Đơn bị từ chối
(7, 16, '2024-01-15', '2024-01-18', 1, 'Du lịch', 'rejected');

-- 📊 PAYROLL_RULES (15 bản ghi - quy định lương)
INSERT INTO payroll_rules (type, value_type, value, effective_date, expiry_date, description) VALUES
('OT_RATE', 'percentage', 150.0, '2024-01-01', NULL, 'Tỷ lệ tính OT (150% lương cơ bản)'),
('OT_NIGHT_RATE', 'percentage', 200.0, '2024-01-01', NULL, 'Tỷ lệ tính OT ca đêm'),
('NIGHT_SHIFT_BONUS', 'fixed_amount', 50000.0, '2024-01-01', NULL, 'Phụ cấp ca đêm'),
('INSURANCE', 'percentage', 10.5, '2024-01-01', '2024-12-31', 'Bảo hiểm xã hội'),
('HEALTH_INSURANCE', 'percentage', 1.5, '2024-01-01', '2024-12-31', 'Bảo hiểm y tế'),
('UNEMPLOYMENT_INSURANCE', 'percentage', 1.0, '2024-01-01', '2024-12-31', 'Bảo hiểm thất nghiệp'),
('TAX_THRESHOLD', 'fixed_amount', 11000000.0, '2024-01-01', NULL, 'Ngưỡng đóng thuế'),
('TAX_RATE_1', 'percentage', 5.0, '2024-01-01', NULL, 'Thuế suất bậc 1'),
('TAX_RATE_2', 'percentage', 10.0, '2024-01-01', NULL, 'Thuế suất bậc 2'),
('LUNCH_ALLOWANCE', 'fixed_amount', 700000.0, '2024-01-01', NULL, 'Phụ cấp ăn trưa'),
('PHONE_ALLOWANCE', 'fixed_amount', 200000.0, '2024-01-01', NULL, 'Phụ cấp điện thoại'),
('TRANSPORT_ALLOWANCE', 'fixed_amount', 500000.0, '2024-01-01', NULL, 'Phụ cấp đi lại'),
('ATTENDANCE_BONUS', 'fixed_amount', 500000.0, '2024-01-01', NULL, 'Thưởng chuyên cần'),
('PERFORMANCE_BONUS', 'percentage', 10.0, '2024-01-01', NULL, 'Thưởng hiệu suất tối đa'),
('LATE_PENALTY', 'fixed_amount', 100000.0, '2024-01-01', NULL, 'Phạt đi muộn');

-- 📊 SALARY_DETAILS (80 bản ghi - lương 6 tháng)
INSERT INTO salary_details (id_contract, approved_by, salary_month, overtime, bonus, attendance_bonus, deduction, net_salary, status) VALUES
-- Lương tháng 1/2024
(1, 15, '2024-01-01', 500000, 1000000, 500000, 1500000, 12000000, 'paid'),
(2, 15, '2024-01-01', 750000, 1500000, 750000, 2000000, 18000000, 'paid'),

-- Lương tháng 2/2024
(1, 15, '2024-02-01', 600000, 800000, 400000, 1200000, 12200000, 'paid'),
(2, 15, '2024-02-01', 800000, 1200000, 600000, 1800000, 18400000, 'paid'),

-- Lương tháng 3/2024 (chờ thanh toán)
(1, 15, '2024-03-01', 550000, 900000, 450000, 1300000, 12150000, 'pending'),
(2, 15, '2024-03-01', 700000, 1100000, 550000, 1700000, 17900000, 'pending');



-- =============================================
-- SAMPLE QUERIES - TRUY VẤN MẪU
-- =============================================

-- 📌 1. DANH SÁCH NHÂN VIÊN ĐANG LÀM VIỆC
SELECT 
    e.id_employee,
    e.name,
    e.email,
    e.phone,
    h.name_position,
    h.name_level,
    c.base_salary
FROM employees e
JOIN hierarchys h ON e.id_hierarchy = h.id_hierarchy
JOIN contracts c ON e.id_employee = c.id_employee AND c.status = 'active'
WHERE e.status = 'active'
ORDER BY h.salary_multiplier DESC;

-- 📌 2. BÁO CÁO CHẤM CÔNG THÁNG
SELECT 
    e.name,
    a.of_date,
    a.office_hours,
    a.over_time,
    a.late_time,
    CASE 
        WHEN a.office_hours >= 8 THEN 'Đủ'
        ELSE 'Thiếu'
    END as attendance_status
FROM attendances a
JOIN employees e ON a.id_employee = e.id_employee
WHERE YEAR(a.of_date) = 2024 AND MONTH(a.of_date) = 1
ORDER BY a.of_date, e.name;

-- 📌 3. TÍNH LƯƠNG THÁNG
SELECT 
    e.name,
    c.base_salary,
    h.salary_multiplier,
    h.allowance,
    sd.overtime,
    sd.bonus,
    sd.attendance_bonus,
    sd.deduction,
    sd.net_salary
FROM salary_details sd
JOIN contracts c ON sd.id_contract = c.id_contract
JOIN employees e ON c.id_employee = e.id_employee
JOIN hierarchys h ON e.id_hierarchy = h.id_hierarchy
WHERE sd.salary_month = '2024-01-01'
ORDER BY sd.net_salary DESC;

-- 📌 4. THỐNG KÊ NGHỈ PHÉP
SELECT 
    e.name,
    COUNT(l.id_leave) as total_leaves,
    SUM(CASE WHEN l.status = 'approved' THEN DATEDIFF(l.end_date, l.start_date) + 1 ELSE 0 END) as approved_days,
    SUM(CASE WHEN l.is_paid = 1 THEN DATEDIFF(l.end_date, l.start_date) + 1 ELSE 0 END) as paid_days
FROM employees e
LEFT JOIN leaves l ON e.id_employee = l.id_employee
WHERE YEAR(l.start_date) = 2024
GROUP BY e.id_employee, e.name
HAVING total_leaves > 0;

-- 📌 5. TOP NHÂN VIÊN CÓ LƯƠNG CAO NHẤT
SELECT 
    e.name,
    h.name_position,
    h.name_level,
    MAX(sd.net_salary) as highest_salary,
    c.base_salary
FROM employees e
JOIN contracts c ON e.id_employee = c.id_employee
JOIN hierarchys h ON e.id_hierarchy = h.id_hierarchy
JOIN salary_details sd ON c.id_contract = sd.id_contract
WHERE sd.status = 'paid'
GROUP BY e.id_employee, e.name, h.name_position, h.name_level, c.base_salary
ORDER BY highest_salary DESC
LIMIT 10;

-- 📌 6. THỐNG KÊ THEO PHÒNG BAN
SELECT 
    CASE 
        WHEN h.name_position LIKE '%Developer%' THEN 'IT Development'
        WHEN h.name_position LIKE '%QA%' THEN 'Quality Assurance'
        WHEN h.name_position LIKE '%HR%' THEN 'Human Resources'
        WHEN h.name_position LIKE '%Account%' THEN 'Finance & Accounting'
        WHEN h.name_position LIKE '%Sales%' THEN 'Sales & Marketing'
        ELSE 'Other'
    END as department,
    COUNT(e.id_employee) as employee_count,
    AVG(c.base_salary) as avg_salary,
    SUM(CASE WHEN e.status = 'active' THEN 1 ELSE 0 END) as active_employees
FROM employees e
JOIN hierarchys h ON e.id_hierarchy = h.id_hierarchy
JOIN contracts c ON e.id_employee = c.id_employee AND c.status = 'active'
GROUP BY department
ORDER BY employee_count DESC;

-- 📌 7. NHÂN VIÊN CÓ SỐ NGÀY ĐI MUỘN NHIỀU NHẤT
SELECT 
    e.name,
    COUNT(a.id_attendance) as late_days,
    SUM(a.late_time) as total_late_hours
FROM employees e
JOIN attendances a ON e.id_employee = a.id_employee
WHERE a.late_time > 0
    AND YEAR(a.of_date) = 2024 
    AND MONTH(a.of_date) = 1
GROUP BY e.id_employee, e.name
ORDER BY late_days DESC
LIMIT 5;

-- 📌 8. BÁO CÁO TỔNG QUAN CÔNG TY
SELECT 
    (SELECT COUNT(*) FROM employees WHERE status = 'active') as total_active_employees,
    (SELECT COUNT(*) FROM contracts WHERE status = 'active') as active_contracts,
    (SELECT AVG(base_salary) FROM contracts WHERE status = 'active') as avg_base_salary,
    (SELECT SUM(net_salary) FROM salary_details WHERE salary_month = '2024-01-01' AND status = 'paid') as total_paid_salary,
    (SELECT COUNT(*) FROM leaves WHERE status = 'approved' AND YEAR(start_date) = 2024) as approved_leaves;