-- =============================================
-- DATABASE SCHEMA - CẤU TRÚC BẢNG
-- =============================================
SET FOREIGN_KEY_CHECKS = 0;


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
    name_position VARCHAR(100) ,
    name_level VARCHAR(50) ,
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
    name VARCHAR(150) ,
    gender TINYINT CHECK (gender IN (0, 1, 3)),
    cccd VARCHAR(20) UNIQUE ,
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
    id_salary_details INT AUTO_INCREMENT PRIMARY KEY,           -- Khóa chính
    id_contract INT ,                                   -- FK -> contracts
    approved_by INT NULL,                                       -- FK -> employees

    salary_month DATE ,                                 -- Tháng lương (luôn là ngày 01)

    base_salary DECIMAL(15,2) ,                         -- Lương cơ bản
    salary_multiplier DECIMAL(5,2) DEFAULT 1.00 ,       -- Hệ số lương

    office_hours DECIMAL(15,2) DEFAULT 0,                       -- Số giờ làm việc
    over_time DECIMAL(15,2) DEFAULT 0,                          -- Giờ OT (0 nếu office_hours < 8)
    late_time DECIMAL(15,2) DEFAULT 0,                          -- Giờ đi muộn (tính từ 8h - office_hours)

    bonus DECIMAL(15,2)  DEFAULT 0,                     -- Thưởng lễ, tết
    attendance_bonus DECIMAL(15,2) DEFAULT 0,                   -- Phụ cấp chuyên cần
    deduction DECIMAL(15,2)  DEFAULT 0,                 -- Khấu trừ (phạt, BHXH, thuế)

    net_salary DECIMAL(15,2) ,                          -- Lương thực nhận

    status ENUM('pending','paid') DEFAULT 'pending' ,   -- Trạng thái trả lương
    description TEXT NULL,                                      -- Mô tả

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_salary_details_contract FOREIGN KEY (id_contract) REFERENCES contracts(id_contract),
    CONSTRAINT fk_salary_details_approver FOREIGN KEY (approved_by) REFERENCES employees(id_employee),

    UNIQUE KEY uq_contract_month (id_contract, salary_month)    -- 1 contract chỉ có 1 bản ghi / tháng
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
-- IT Department
('Trainee', 'Fresher', 1.0, 200000, 'Thực tập sinh'),
('Developer', 'Junior', 1.1, 300000, 'Lập trình viên cơ bản'),
('Developer', 'Middle', 1.3, 600000, 'Lập trình viên trung cấp'),
('Developer', 'Senior', 1.5, 1000000, 'Lập trình viên cao cấp'),
('Developer', 'Lead', 1.7, 1500000, 'Trưởng nhóm phát triển'),
('QA Engineer', 'Junior', 1.05, 250000, 'Kiểm thử viên cơ bản'),
('QA Engineer', 'Senior', 1.4, 900000, 'Kiểm thử viên cao cấp'),
('DevOps', 'Middle', 1.35, 700000, 'Vận hành hệ thống'),
('DevOps', 'Senior', 1.55, 1200000, 'Quản trị hệ thống cao cấp'),

-- Management
('Team Lead', 'Middle', 1.6, 1200000, 'Trưởng nhóm'),
('Project Manager', 'Senior', 1.8, 2000000, 'Quản lý dự án'),
('Department Head', 'Director', 2.0, 3000000, 'Trưởng phòng'),

-- HR & Admin
('HR Specialist', 'Junior', 1.05, 200000, 'Chuyên viên nhân sự'),
('HR Manager', 'Senior', 1.5, 800000, 'Quản lý nhân sự'),
('Admin Staff', 'Junior', 1.0, 150000, 'Nhân viên hành chính'),

-- Finance & Accounting
('Accountant', 'Junior', 1.1, 300000, 'Kế toán viên'),
('Accountant', 'Senior', 1.4, 800000, 'Kế toán trưởng'),
('Financial Analyst', 'Middle', 1.45, 900000, 'Chuyên viên phân tích tài chính'),

-- Sales & Marketing
('Sales Executive', 'Junior', 1.05, 250000, 'Nhân viên kinh doanh'),
('Sales Manager', 'Senior', 1.5, 1200000, 'Quản lý kinh doanh'),
('Marketing Specialist', 'Middle', 1.35, 700000, 'Chuyên viên marketing'),

-- Design
('Designer', 'Junior', 1.1, 300000, 'Thiết kế đồ họa'),
('Designer', 'Senior', 1.4, 900000, 'Trưởng nhóm thiết kế'),

-- Support
('Customer Support', 'Junior', 1.0, 200000, 'Hỗ trợ khách hàng'),
('Technical Support', 'Middle', 1.2, 500000, 'Hỗ trợ kỹ thuật');


-- 📊 EMPLOYEES (50 bản ghi)
INSERT INTO employees (name, gender, cccd, date_of_birth, address, email, phone, bank_infor, hire_date, id_hierarchy, status, description) VALUES
-- Developer Team (15 người)
('Nguyễn Văn An', 1, '001201123456', '1990-05-15', 'Hà Nội', 'an.nguyen@company.com', '0912345678', 'vietcombank_123456789', '2020-03-01', 2, 'active', 'Nhân viên chính thức'),
('Trần Thị Bình', 0, '001201123457', '1992-08-20', 'Hồ Chí Minh', 'binh.tran@company.com', '0912345679', 'techcombank_123456790', '2021-06-15', 3, 'active', 'Developer có kinh nghiệm'),
('Lê Văn Cường', 1, '001201123458', '1988-12-10', 'Đà Nẵng', 'cuong.le@company.com', '0912345680', 'bidv_123456791', '2019-01-10', 4, 'active', 'Senior developer'),
('Phạm Thị Dung', 0, '001201123459', '1995-03-25', 'Hải Phòng', 'dung.pham@company.com', '0912345681', 'vietinbank_123456792', '2022-02-20', 2, 'active', 'Mới tuyển dụng'),
('Hoàng Văn Đạt', 1, '001201123460', '1991-07-30', 'Cần Thơ', 'dat.hoang@company.com', '0912345682', 'agribank_123456793', '2020-11-05', 5, 'active', 'Team lead developer'),
('Vũ Thị Én', 0, '001201123461', '1993-09-12', 'Hà Nội', 'en.vu@company.com', '0912345683', 'vietcombank_123456794', '2021-09-18', 3, 'active', 'Middle developer'),
('Đặng Văn Phong', 1, '001201123462', '1989-04-05', 'Hồ Chí Minh', 'phong.dang@company.com', '0912345684', 'techcombank_123456795', '2018-07-22', 4, 'active', 'Senior fullstack'),
('Bùi Thị Giang', 0, '001201123463', '1994-11-18', 'Đà Nẵng', 'giang.bui@company.com', '0912345685', 'bidv_123456796', '2023-01-30', 2, 'active', 'Frontend developer'),
('Ngô Văn Hải', 1, '001201123464', '1990-06-22', 'Hải Phòng', 'hai.ngo@company.com', '0912345686', 'vietinbank_123456797', '2020-08-14', 3, 'active', 'Backend developer'),
('Đỗ Thị Hương', 0, '001201123465', '1992-02-14', 'Cần Thơ', 'huong.do@company.com', '0912345687', 'agribank_123456798', '2021-12-01', 4, 'active', 'Senior mobile dev'),
('Trịnh Văn Khôi', 1, '001201123466', '1987-10-08', 'Hà Nội', 'khoi.trinh@company.com', '0912345688', 'vietcombank_123456799', '2017-05-20', 5, 'active', 'Technical lead'),
('Lý Thị Lan', 0, '001201123467', '1996-01-30', 'Hồ Chí Minh', 'lan.ly@company.com', '0912345689', 'techcombank_123456800', '2023-03-10', 2, 'active', 'Fresher developer'),
('Võ Văn Minh', 1, '001201123468', '1991-08-17', 'Đà Nẵng', 'minh.vo@company.com', '0912345690', 'bidv_123456801', '2020-10-25', 3, 'active', 'DevOps kiêm developer'),
('Chu Thị Nga', 0, '001201123469', '1993-12-03', 'Hải Phòng', 'nga.chu@company.com', '0912345691', 'vietinbank_123456802', '2022-04-15', 4, 'active', 'Senior QA engineer'),
('Phan Văn Oanh', 1, '001201123470', '1989-05-28', 'Cần Thơ', 'oanh.phan@company.com', '0912345692', 'agribank_123456803', '2019-09-08', 6, 'active', 'QA engineer'),

-- QA Engineers (5 người)
('Lâm Thị Phương', 0, '001201123471', '1994-07-19', 'Hà Nội', 'phuong.lam@company.com', '0912345693', 'vietcombank_123456804', '2021-11-12', 7, 'active', 'Senior QA'),
('Hồ Văn Quân', 1, '001201123472', '1990-03-08', 'Hồ Chí Minh', 'quan.ho@company.com', '0912345694', 'techcombank_123456805', '2020-02-28', 6, 'active', 'Automation QA'),
('Nguyễn Thị Rò', 0, '001201123473', '1995-09-21', 'Đà Nẵng', 'ro.nguyen@company.com', '0912345695', 'bidv_123456806', '2023-05-05', 7, 'active', 'Manual testing'),
('Trần Văn Sơn', 1, '001201123474', '1988-11-14', 'Hải Phòng', 'son.tran@company.com', '0912345696', 'vietinbank_123456807', '2018-12-10', 6, 'active', 'QA lead'),

-- DevOps (4 người)
('Lê Thị Tuyết', 0, '001201123475', '1992-04-26', 'Cần Thơ', 'tuyet.le@company.com', '0912345697', 'agribank_123456808', '2021-07-30', 8, 'active', 'DevOps engineer'),
('Phạm Văn Uy', 1, '001201123476', '1987-06-09', 'Hà Nội', 'uy.pham@company.com', '0912345698', 'vietcombank_123456809', '2017-08-15', 9, 'active', 'Senior DevOps'),
('Hoàng Thị Vân', 0, '001201123477', '1993-10-31', 'Hồ Chí Minh', 'van.hoang@company.com', '0912345699', 'techcombank_123456810', '2022-01-20', 8, 'active', 'System admin'),

-- Management (6 người)
('Vũ Văn Xuyên', 1, '001201123478', '1985-02-18', 'Đà Nẵng', 'xuyen.vu@company.com', '0912345700', 'bidv_123456811', '2015-04-01', 10, 'active', 'Team lead IT'),
('Đặng Thị Yến', 0, '001201123479', '1986-07-24', 'Hải Phòng', 'yen.dang@company.com', '0912345701', 'vietinbank_123456812', '2016-03-15', 11, 'active', 'Project manager'),
('Bùi Văn Zũ', 1, '001201123480', '1984-01-11', 'Cần Thơ', 'zu.bui@company.com', '0912345702', 'agribank_123456813', '2014-11-20', 12, 'active', 'IT department head'),

-- HR & Admin (5 người)
('Ngô Thị Ánh', 0, '001201123481', '1994-08-05', 'Hà Nội', 'anh.ngo@company.com', '0912345703', 'vietcombank_123456814', '2022-06-10', 13, 'active', 'HR specialist'),
('Đỗ Văn Bằng', 1, '001201123482', '1990-12-19', 'Hồ Chí Minh', 'bang.do@company.com', '0912345704', 'techcombank_123456815', '2020-09-25', 14, 'active', 'HR manager'),
('Trịnh Thị Chi', 0, '001201123483', '1996-03-22', 'Đà Nẵng', 'chi.trinh@company.com', '0912345705', 'bidv_123456816', '2023-08-12', 15, 'active', 'Admin staff'),

-- Finance & Accounting (5 người)
('Lý Văn Dũng', 1, '001201123484', '1991-09-07', 'Hải Phòng', 'dung.ly@company.com', '0912345706', 'vietinbank_123456817', '2021-04-18', 16, 'active', 'Junior accountant'),
('Võ Thị Eo', 0, '001201123485', '1989-05-14', 'Cần Thơ', 'eo.vo@company.com', '0912345707', 'agribank_123456818', '2019-02-22', 17, 'active', 'Senior accountant'),
('Chu Văn Phúc', 1, '001201123486', '1988-11-28', 'Hà Nội', 'phuc.chu@company.com', '0912345708', 'vietcombank_123456819', '2018-10-05', 18, 'active', 'Financial analyst'),

-- Sales & Marketing (5 người)
('Phan Thị Giao', 0, '001201123487', '1993-04-16', 'Hồ Chí Minh', 'giao.phan@company.com', '0912345709', 'techcombank_123456820', '2022-07-30', 19, 'active', 'Sales executive'),
('Lâm Văn Hùng', 1, '001201123488', '1990-10-23', 'Đà Nẵng', 'hung.lam@company.com', '0912345710', 'bidv_123456821', '2020-12-14', 20, 'active', 'Sales manager'),
('Hồ Thị Iris', 0, '001201123489', '1995-06-09', 'Hải Phòng', 'iris.ho@company.com', '0912345711', 'vietinbank_123456822', '2023-02-28', 21, 'active', 'Marketing specialist'),

-- Design (3 người)
('Nguyễn Văn John', 1, '001201123490', '1992-07-12', 'Cần Thơ', 'john.nguyen@company.com', '0912345712', 'agribank_123456823', '2021-05-17', 22, 'active', 'Junior designer'),
('Trần Thị Kelly', 0, '001201123491', '1994-01-25', 'Hà Nội', 'kelly.tran@company.com', '0912345713', 'vietcombank_123456824', '2022-09-03', 23, 'active', 'Senior designer'),

-- Support (2 người)
('Lê Văn Long', 1, '001201123492', '1996-08-30', 'Hồ Chí Minh', 'long.le@company.com', '0912345714', 'techcombank_123456825', '2023-11-15', 24, 'active', 'Customer support'),
('Phạm Thị My', 0, '001201123493', '1993-03-17', 'Đà Nẵng', 'my.pham@company.com', '0912345715', 'bidv_123456826', '2021-08-22', 25, 'active', 'Technical support'),

-- Thêm nhân viên để đủ 50 (5 người nữa)
('Hoàng Văn Nam', 1, '001201123494', '1991-12-04', 'Hải Phòng', 'nam.hoang@company.com', '0912345716', 'vietinbank_123456827', '2020-06-11', 3, 'active', 'Backend developer'),
('Vũ Thị Oanh', 0, '001201123495', '1995-02-27', 'Cần Thơ', 'oanh.vu@company.com', '0912345717', 'agribank_123456828', '2023-04-19', 2, 'active', 'Frontend fresher'),
('Đặng Văn Phú', 1, '001201123496', '1989-09-13', 'Hà Nội', 'phu.dang@company.com', '0912345718', 'vietcombank_123456829', '2019-07-26', 4, 'active', 'Senior fullstack'),
('Bùi Thị Quỳnh', 0, '001201123497', '1994-05-08', 'Hồ Chí Minh', 'quynh.bui@company.com', '0912345719', 'techcombank_123456830', '2022-10-08', 6, 'active', 'QA engineer'),
('Ngô Văn Rồng', 1, '001201123498', '1990-11-21', 'Đà Nẵng', 'rong.ngo@company.com', '0912345720', 'bidv_123456831', '2021-01-14', 8, 'active', 'DevOps engineer'),

-- Nhân viên resigned (2 người để demo)
('Trịnh Thị Sao', 0, '001201123499', '1992-06-15', 'Hải Phòng', 'sao.trinh@company.com', '0912345721', 'vietinbank_123456832', '2020-03-20', 2, 'resigned', 'Đã nghỉ việc'),
('Lý Văn Tú', 1, '001201123500', '1993-10-02', 'Cần Thơ', 'tu.ly@company.com', '0912345722', 'agribank_123456833', '2021-11-30', 3, 'inactive', 'Tạm nghỉ');


-- 📊 CONTRACTS (60 bản ghi - mỗi nhân viên có 1-2 hợp đồng)
INSERT INTO contracts (id_employee, contract_type, base_salary, effective_date, expiry_date, status, description) VALUES
-- Hợp đồng còn hạn (năm 2030) cho tất cả nhân viên active
(1, 2, 15000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng không xác định thời hạn'),
(2, 2, 18000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng chính thức'),
(3, 2, 22000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng senior'),
(4, 1, 12000000, '2025-01-01', '2026-12-31', 'active', 'Hợp đồng thử việc 3 năm'),
(5, 2, 28000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng team lead'),
(6, 2, 19000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng chính thức'),
(7, 2, 23000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng senior fullstack'),
(8, 1, 11000000, '2025-01-01', '2025-12-31', 'active', 'Hợp đồng fresher 2 năm'),
(9, 2, 20000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng backend developer'),
(10, 2, 24000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng senior mobile'),
(11, 2, 30000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng technical lead'),
(12, 1, 10000000, '2025-01-01', '2025-12-31', 'active', 'Hợp đồng thử việc 1 năm'),
(13, 2, 21000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng DevOps developer'),
(14, 2, 25000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng senior QA'),
(15, 2, 16000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng QA engineer'),
(16, 2, 26000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng senior QA'),
(17, 2, 17000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng automation QA'),
(18, 1, 15000000, '2025-01-01', '2025-06-30', 'active', 'Hợp đồng QA 1.5 năm'),
(19, 2, 27000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng QA lead'),
(20, 2, 20000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng DevOps'),
(21, 2, 32000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng senior DevOps'),
(22, 1, 18000000, '2025-01-01', '2025-12-31', 'active', 'Hợp đồng system admin thử việc'),
(23, 2, 35000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng team lead IT'),
(24, 2, 40000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng project manager'),
(25, 2, 50000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng department head'),
(26, 2, 13000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng HR specialist'),
(27, 2, 25000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng HR manager'),
(28, 1, 9000000, '2025-01-01', '2025-06-30', 'active', 'Hợp đồng admin staff thử việc'),
(29, 2, 14000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng junior accountant'),
(30, 2, 26000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng senior accountant'),
(31, 2, 30000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng financial analyst'),
(32, 1, 12000000, '2025-01-01', '2025-12-31', 'active', 'Hợp đồng sales executive thử việc'),
(33, 2, 32000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng sales manager'),
(34, 2, 22000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng marketing specialist'),
(35, 1, 11000000, '2025-01-01', '2025-01-01', 'active', 'Hợp đồng junior designer'),
(36, 2, 24000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng senior designer'),
(37, 1, 8000000, '2025-01-01', '2025-12-31', 'active', 'Hợp đồng customer support'),
(38, 2, 15000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng technical support'),
(39, 2, 19000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng backend developer'),
(40, 1, 10000000, '2025-01-01', '2025-12-31', 'active', 'Hợp đồng frontend fresher'),
(41, 2, 23000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng senior fullstack'),
(42, 2, 16000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng QA engineer'),
(43, 2, 20000000, '2025-01-01', '2030-12-31', 'active', 'Hợp đồng DevOps engineer'),

-- Hợp đồng đã hết hạn (cho nhân viên active - để demo lịch sử)
(1, 1, 12000000, '2020-03-01', '2023-12-31', 'expired', 'Hợp đồng thử việc đầu tiên'),
(2, 1, 15000000, '2021-06-15', '2023-12-31', 'expired', 'Hợp đồng có thời hạn'),
(3, 1, 18000000, '2019-01-10', '2023-12-31', 'expired', 'Hợp đồng 5 năm'),
(5, 1, 22000000, '2020-11-05', '2023-12-31', 'expired', 'Hợp đồng team lead cũ'),
(7, 1, 19000000, '2018-07-22', '2023-12-31', 'expired', 'Hợp đồng 5 năm'),
(11, 1, 25000000, '2017-05-20', '2023-12-31', 'expired', 'Hợp đồng technical lead cũ'),
(14, 1, 20000000, '2022-04-15', '2023-12-31', 'expired', 'Hợp đồng QA 1 năm'),
(16, 1, 22000000, '2021-11-12', '2023-12-31', 'expired', 'Hợp đồng senior QA cũ'),
(21, 1, 28000000, '2017-08-15', '2023-12-31', 'expired', 'Hợp đồng senior DevOps cũ'),
(24, 1, 35000000, '2016-03-15', '2023-12-31', 'expired', 'Hợp đồng project manager cũ'),
(25, 1, 45000000, '2014-11-20', '2023-12-31', 'expired', 'Hợp đồng department head cũ'),
(27, 1, 22000000, '2020-09-25', '2023-12-31', 'expired', 'Hợp đồng HR manager cũ'),
(30, 1, 23000000, '2019-02-22', '2023-12-31', 'expired', 'Hợp đồng senior accountant cũ'),
(33, 1, 28000000, '2020-12-14', '2023-12-31', 'expired', 'Hợp đồng sales manager cũ'),

-- Hợp đồng cho nhân viên resigned/inactive
(49, 1, 10000000, '2020-03-20', '2023-12-31', 'terminated', 'Hợp đồng đã kết thúc'),
(50, 1, 15000000, '2021-11-30', '2023-06-30', 'terminated', 'Hợp đồng tạm nghỉ'),

-- Thêm hợp đồng thời vụ (contract_type = 3)
(44, 3, 8000000, '2025-01-01', '2025-06-30', 'active', 'Hợp đồng thời vụ 6 tháng'),
(45, 3, 9000000, '2025-02-01', '2025-08-31', 'active', 'Hợp đồng theo dự án');



-- 📊 ATTENDANCES (Tháng 9 & Dữ liệu bổ sung - 120 bản ghi)
INSERT INTO attendances (id_employee, of_date, office_hours, over_time, late_time, is_night_shift) VALUES
-- Tháng 9/2024 (80 bản ghi)
-- Nhân viên 1-15
(1, '2025-09-02', 8.0, 0.0, 0.0, 0), (1, '2025-09-03', 8.0, 1.0, 0.0, 0), (1, '2025-09-04', 8.0, 0.0, 0.0, 0),
(1, '2025-09-05', 7.5, 0.0, 0.5, 0), (1, '2025-09-06', 8.0, 2.0, 0.0, 0), (1, '2025-09-09', 8.0, 0.0, 0.0, 0),
(2, '2025-09-02', 8.0, 0.0, 0.0, 0), (2, '2025-09-03', 8.0, 1.5, 0.0, 0), (2, '2025-09-04', 8.0, 0.0, 0.0, 0),
(3, '2025-09-02', 8.0, 3.0, 0.0, 0), (3, '2025-09-03', 8.0, 0.0, 0.0, 0), (3, '2025-09-04', 8.0, 2.0, 0.0, 0),

-- Nhân viên 16-30
(16, '2025-09-02', 8.0, 0.0, 0.0, 0), (16, '2025-09-03', 8.0, 1.0, 0.0, 0), (16, '2025-09-04', 7.0, 0.0, 1.0, 0),
(17, '2025-09-02', 8.0, 2.0, 0.0, 0), (17, '2025-09-03', 8.0, 0.0, 0.0, 0), (17, '2025-09-05', 8.0, 1.5, 0.0, 0),
(18, '2025-09-02', 8.0, 0.0, 0.0, 0), (18, '2025-09-03', 6.5, 0.0, 1.5, 0), (18, '2025-09-04', 8.0, 0.0, 0.0, 0),

-- Dữ liệu đa dạng hóa (40 bản ghi)
-- Nghỉ ốm (office_hours = 0)
(4, '2025-07-10', 0.0, 0.0, 0.0, 0), (7, '2025-08-12', 0.0, 0.0, 0.0, 0), (12, '2025-09-10', 0.0, 0.0, 0.0, 0),

-- Làm nửa ngày
(5, '2025-07-15', 4.0, 0.0, 0.0, 0), (8, '2025-08-20', 3.5, 0.0, 0.0, 0), (14, '2025-09-15', 4.0, 0.0, 0.0, 0),

-- Đi muộn nhiều
(6, '2025-07-18', 6.0, 0.0, 2.0, 0), (9, '2025-08-22', 5.5, 0.0, 2.5, 0), (16, '2025-09-18', 5.0, 0.0, 3.0, 0),

-- Tăng ca nhiều
(10, '2025-07-20', 8.0, 4.0, 0.0, 0), (13, '2025-08-25', 8.0, 5.0, 0.0, 0), (19, '2025-09-20', 8.0, 6.0, 0.0, 0),

-- Ca đêm (is_night_shift = 1)
(11, '2025-07-22', 8.0, 2.0, 0.0, 1), (15, '2025-08-26', 8.0, 3.0, 0.0, 1), (20, '2025-09-22', 8.0, 1.0, 0.0, 1),

-- Cuối tuần làm thêm (thứ 7, CN)
(1, '2025-07-06', 8.0, 3.0, 0.0, 0), (3, '2025-07-07', 8.0, 2.5, 0.0, 0),
(5, '2025-08-03', 8.0, 4.0, 0.0, 0), (7, '2025-08-04', 8.0, 3.0, 0.0, 0),
(9, '2025-09-07', 8.0, 2.0, 0.0, 0), (11, '2025-09-08', 8.0, 3.5, 0.0, 0),



-- Nhân viên part-time (ít ngày làm)
(44, '2025-07-01', 4.0, 0.0, 0.0, 0), (44, '2025-07-03', 4.0, 0.0, 0.0, 0), (44, '2025-07-05', 4.0, 0.0, 0.0, 0),
(45, '2025-08-01', 5.0, 0.0, 0.0, 0), (45, '2025-08-03', 5.0, 0.0, 0.0, 0), (45, '2025-08-05', 5.0, 0.0, 0.0, 0),

-- Nhân viên resigned (ít dữ liệu)
(49, '2025-07-01', 8.0, 0.0, 0.0, 0), (49, '2025-07-02', 8.0, 0.0, 0.0, 0),
(50, '2025-07-01', 8.0, 0.0, 0.0, 0), (50, '2025-07-02', 7.5, 0.0, 0.5, 0);



-- 📊 LEAVES (40 bản ghi - đơn xin nghỉ phép)
INSERT INTO leaves (id_employee, approved_by, start_date, end_date, is_paid, reason, status) VALUES
-- Nghỉ phép có lương
(1, 15, '2025-01-10', '2025-01-12', 1, 'Nghỉ ốm', 'approved'),
(2, 15, '2025-02-15', '2025-02-16', 1, 'Việc gia đình', 'approved'),
(3, 16, '2025-03-01', '2025-03-03', 1, 'Nghỉ lễ', 'approved'),

-- Nghỉ không lương
(4, 15, '2025-01-20', '2025-01-22', 0, 'Việc cá nhân', 'approved'),
(5, 16, '2025-02-10', '2025-02-11', 0, 'Khám sức khỏe', 'approved'),

-- Đơn chờ duyệt
(6, 15, '2025-04-01', '2025-04-03', 1, 'Nghỉ phép năm', 'pending'),

-- Đơn bị từ chối
(7, 16, '2025-01-15', '2025-01-18', 1, 'Du lịch', 'rejected');


-- 📊 PAYROLL_RULES (15 bản ghi - quy định lương)
INSERT INTO payroll_rules (type, value_type, value, effective_date, expiry_date, description) VALUES
('OT_RATE', 'percentage', 150.0, '2025-01-01', NULL, 'Tỷ lệ tính OT (150% lương cơ bản)'),
('OT_NIGHT_RATE', 'percentage', 200.0, '2025-01-01', NULL, 'Tỷ lệ tính OT ca đêm'),
('NIGHT_SHIFT_BONUS', 'fixed_amount', 50000.0, '2025-01-01', NULL, 'Phụ cấp ca đêm'),
('INSURANCE', 'percentage', 10.5, '2025-01-01', '2025-12-31', 'Bảo hiểm xã hội'),
('HEALTH_INSURANCE', 'percentage', 1.5, '2025-01-01', '2025-12-31', 'Bảo hiểm y tế'),
('UNEMPLOYMENT_INSURANCE', 'percentage', 1.0, '2025-01-01', '2025-12-31', 'Bảo hiểm thất nghiệp'),
('TAX_THRESHOLD', 'fixed_amount', 11000000.0, '2025-01-01', NULL, 'Ngưỡng đóng thuế'),
('TAX_RATE_1', 'percentage', 5.0, '2025-01-01', NULL, 'Thuế suất bậc 1'),
('TAX_RATE_2', 'percentage', 10.0, '2025-01-01', NULL, 'Thuế suất bậc 2'),
('LUNCH_ALLOWANCE', 'fixed_amount', 700000.0, '2025-01-01', NULL, 'Phụ cấp ăn trưa'),
('PHONE_ALLOWANCE', 'fixed_amount', 200000.0, '2025-01-01', NULL, 'Phụ cấp điện thoại'),
('TRANSPORT_ALLOWANCE', 'fixed_amount', 500000.0, '2025-01-01', NULL, 'Phụ cấp đi lại'),
('ATTENDANCE_BONUS', 'fixed_amount', 500000.0, '2025-01-01', NULL, 'Thưởng chuyên cần'),
('PERFORMANCE_BONUS', 'percentage', 10.0, '2025-01-01', NULL, 'Thưởng hiệu suất tối đa'),
('LATE_PENALTY', 'fixed_amount', 100000.0, '2025-01-01', NULL, 'Phạt đi muộn');



SET FOREIGN_KEY_CHECKS = 1;

