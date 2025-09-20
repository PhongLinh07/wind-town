-- =======================
-- DROP BẢNG NẾU TỒN TẠI
-- Thứ tự: con → cha
-- =======================
DROP TABLE IF EXISTS salary_details;
DROP TABLE IF EXISTS leaves;
DROP TABLE IF EXISTS attendances;
DROP TABLE IF EXISTS contracts;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS hierarchys;
DROP TABLE IF EXISTS payroll_rules;

-- =======================
-- CREATE BẢNG CHA TRƯỚC
-- =======================
CREATE TABLE hierarchys (
    id_hierarchy INT PRIMARY KEY AUTO_INCREMENT,
    name_position VARCHAR(100) NOT NULL,
    name_level VARCHAR(50) NOT NULL,
    salary_multiplier FLOAT,
    allowance FLOAT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_position_level (name_position, name_level)
);

CREATE TABLE employees (
    id_employee INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    gender INT COMMENT '1=male, 0=female, 3=unknown',
    cccd VARCHAR(20) NOT NULL UNIQUE,
    date_of_birth DATE,
    address VARCHAR(300),
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(15),
    bank_infor VARCHAR(20) COMMENT 'BankType_id',
    hire_date DATE,
    id_hierarchy INT,
    status ENUM('active','inactive','resigned'),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE payroll_rules (
    id_rule INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(20) NOT NULL UNIQUE,
    value_type ENUM('Percentage','Fixed Amount') DEFAULT 'Fixed Amount',
    value FLOAT,
    effective_date DATE,
    expiry_date DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =======================
-- CREATE BẢNG CON
-- =======================
CREATE TABLE contracts (
    id_contract INT PRIMARY KEY AUTO_INCREMENT,
    id_employee INT,
    contract_type ENUM('fixed_term','indefinite','seasonal'),
    base_salary FLOAT,
    effective_date DATE,
    expiry_date DATE,
    status ENUM('active','expired','terminated'),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE attendances (
    id_attendance INT PRIMARY KEY AUTO_INCREMENT,
    id_employee INT,
    of_date DATE,
    office_hours DECIMAL(5,2),
    over_time DECIMAL(5,2),
    late_time DECIMAL(5,2),
    is_night_shift BOOLEAN,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_attendance (id_employee, of_date)
);

CREATE TABLE salary_details (
    id_salary_details INT PRIMARY KEY AUTO_INCREMENT,
    id_contract INT,
    approved_by INT,
    salary_month DATE NOT NULL,
    overtime FLOAT DEFAULT 0,
    bonus FLOAT DEFAULT 0 NOT NULL,
    attendance_bonus FLOAT DEFAULT 0,
    deduction FLOAT DEFAULT 0 NOT NULL,
    net_salary FLOAT,
    status ENUM('pending','paid') DEFAULT 'pending',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_salary (id_contract, salary_month)
);

CREATE TABLE leaves (
    id_leave INT PRIMARY KEY AUTO_INCREMENT,
    id_employee INT,
    approved_by INT,
    start_date DATE,
    end_date DATE,
    type ENUM('annual','sick','unpaid','other'),
    reason TEXT,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =======================
-- TẠO KHÓA NGOẠI
-- =======================
ALTER TABLE employees
ADD CONSTRAINT fk_employees_hierarchy
FOREIGN KEY (id_hierarchy) REFERENCES hierarchys(id_hierarchy);

ALTER TABLE contracts
ADD CONSTRAINT fk_contracts_employee
FOREIGN KEY (id_employee) REFERENCES employees(id_employee);

ALTER TABLE attendances
ADD CONSTRAINT fk_attendances_employee
FOREIGN KEY (id_employee) REFERENCES employees(id_employee);

ALTER TABLE salary_details
ADD CONSTRAINT fk_salarydetails_contract
FOREIGN KEY (id_contract) REFERENCES contracts(id_contract);

ALTER TABLE salary_details
ADD CONSTRAINT fk_salarydetails_approved_by
FOREIGN KEY (approved_by) REFERENCES employees(id_employee);

ALTER TABLE leaves
ADD CONSTRAINT fk_leaves_employee
FOREIGN KEY (id_employee) REFERENCES employees(id_employee);

ALTER TABLE leaves
ADD CONSTRAINT fk_leaves_approved_by
FOREIGN KEY (approved_by) REFERENCES employees(id_employee);

-- =======================
-- DỮ LIỆU GIẢ
-- =======================
-- hierarchys
INSERT INTO hierarchys (name_position, name_level, salary_multiplier, allowance, description) VALUES
('HR Specialist', 'Junior', 1.0, 400000, 'Chuyên viên nhân sự mới vào'),
('HR Specialist', 'Senior', 1.3, 800000, 'Chuyên viên nhân sự có kinh nghiệm'),
('Accountant', 'Junior', 1.0, 500000, 'Kế toán viên'),
('Accountant', 'Senior', 1.5, 1200000, 'Kế toán trưởng'),
('Marketing Executive', 'Junior', 1.1, 600000, 'Chuyên viên marketing mới'),
('Marketing Executive', 'Senior', 1.6, 1300000, 'Chuyên viên marketing có kinh nghiệm'),
('Graphic Designer', 'Junior', 1.0, 500000, 'Thiết kế đồ họa mới'),
('Graphic Designer', 'Senior', 1.4, 1100000, 'Thiết kế đồ họa có kinh nghiệm'),
('Business Analyst', 'Junior', 1.2, 700000, 'Chuyên viên phân tích nghiệp vụ mới'),
('Business Analyst', 'Senior', 1.8, 1500000, 'Chuyên viên phân tích nghiệp vụ cao cấp'),
('Project Manager', 'Mid', 2.0, 2000000, 'Quản lý dự án'),
('Project Manager', 'Senior', 2.5, 2500000, 'Quản lý dự án cấp cao');

-- employees
INSERT INTO employees (name, gender, cccd, date_of_birth, address, email, phone, bank_infor, hire_date, id_hierarchy, status) VALUES
('Le Thi Kim', 0, '112233445', '1995-02-15', 'Ha Noi', 'kim.le@example.com', '0912345601', 'vietcombank_112233445', '2023-03-01', 3, 'active'),
('Hoang Van Nam', 1, '223344556', '1990-08-20', 'Ho Chi Minh', 'nam.hoang@example.com', '0987654302', 'techcombank_223344556', '2022-05-10', 4, 'active'),
('Nguyen Thi Oanh', 0, '334455667', '1998-11-05', 'Da Nang', 'oanh.nguyen@example.com', '0901234503', 'acb_334455667', '2024-01-20', 1, 'active'),
('Tran Minh Quan', 1, '445566778', '1993-06-30', 'Can Tho', 'quan.tran@example.com', '0918765404', 'bidv_445566778', '2021-09-15', 2, 'active'),
('Pham Thi Yen', 0, '556677889', '1996-04-12', 'Hai Phong', 'yen.pham@example.com', '0966778805', 'sacombank_556677889', '2023-07-01', 5, 'active'),
('Vu Van Tuan', 1, '667788990', '1992-10-25', 'Nha Trang', 'tuan.vu@example.com', '0977889906', 'vietinbank_667788990', '2022-11-01', 6, 'active'),
('Do Thi Hoa', 0, '778899001', '1997-03-08', 'Vinh', 'hoa.do@example.com', '0909876507', 'vietcombank_778899001', '2024-02-10', 7, 'active'),
('Le Van Thang', 1, '889900112', '1994-09-18', 'Ha Noi', 'thang.le@example.com', '0919876508', 'techcombank_889900112', '2021-08-05', 8, 'active'),
('Huynh Thanh Nhan', 1, '990011223', '1991-05-01', 'Ho Chi Minh', 'nhan.huynh@example.com', '0988776609', 'bidv_990011223', '2022-04-20', 9, 'active'),
('Nguyen Thi Trang', 0, '001122334', '1995-12-28', 'Da Nang', 'trang.nguyen@example.com', '0909988710', 'acb_001122334', '2023-06-15', 10, 'active'),
('Tran Van Anh', 1, '113355779', '1990-01-01', 'Ha Noi', 'anh.tran@example.com', '0912233411', 'vietcombank_113355779', '2022-01-01', 11, 'active'),
('Le Mai Phuong', 0, '224466880', '1992-05-05', 'Hai Phong', 'phuong.le@example.com', '0907788912', 'techcombank_224466880', '2021-06-15', 12, 'active'),
('Vo Quoc Huy', 1, '335577991', '1998-03-20', 'Da Nang', 'huy.vo@example.com', '0913344513', 'acb_335577991', '2023-02-10', 1, 'active'),
('Phan Thi Ngoc', 0, '446688002', '1997-07-15', 'Vinh', 'ngoc.phan@example.com', '0988445514', 'bidv_446688002', '2023-05-20', 2, 'active'),
('Duong Van Luc', 1, '557799113', '1993-11-25', 'Ho Chi Minh', 'luc.duong@example.com', '0909010215', 'sacombank_557799113', '2022-08-01', 3, 'active'),
('Phan Trong Phu', 1, '668800224', '1996-09-02', 'Can Tho', 'phu.phan@example.com', '0918121316', 'vietinbank_668800224', '2024-01-05', 4, 'active'),
('Dinh Thi Huong', 0, '779911335', '1991-04-12', 'Ha Noi', 'huong.dinh@example.com', '0977788917', 'vietcombank_779911335', '2021-11-11', 5, 'active'),
('Mai Viet Cuong', 1, '880022446', '1994-06-30', 'Hai Phong', 'cuong.mai@example.com', '0966677818', 'techcombank_880022446', '2022-03-05', 6, 'active'),
('Nguyen Hoang Lam', 1, '991133557', '1995-08-10', 'Ha Noi', 'lam.nguyen@example.com', '0901122319', 'bidv_991133557', '2023-09-10', 7, 'active');

-- payroll_rules
INSERT INTO payroll_rules (type, value_type, value, effective_date)
VALUES
('attendance_bonus','Percentage',200000,'2025-01-01'),
('overtime_rate','Fixed Amount',1.5,'2025-01-01');

-- contracts
INSERT INTO contracts (id_employee, contract_type, base_salary, effective_date, status) VALUES
(1, 'indefinite', 10000000, '2022-01-01', 'active'),
(2, 'indefinite', 12000000, '2021-06-15', 'active'),
(3, 'indefinite', 9500000, '2023-03-01', 'active'),
(4, 'indefinite', 11000000, '2022-05-10', 'active'),
(5, 'fixed_term', 8500000, '2024-01-20', 'active'),
(6, 'indefinite', 10500000, '2021-09-15', 'active'),
(7, 'fixed_term', 9000000, '2023-07-01', 'active'),
(8, 'indefinite', 12000000, '2022-11-01', 'active'),
(9, 'indefinite', 8800000, '2024-02-10', 'active'),
(10, 'indefinite', 11500000, '2021-08-05', 'active'),
(11, 'indefinite', 13000000, '2022-04-20', 'active'),
(12, 'fixed_term', 9500000, '2023-06-15', 'active'),
(13, 'indefinite', 14000000, '2022-01-01', 'active'),
(14, 'indefinite', 16000000, '2021-06-15', 'active'),
(15, 'fixed_term', 8000000, '2023-02-10', 'active'),
(16, 'indefinite', 9500000, '2023-05-20', 'active'),
(17, 'fixed_term', 12500000, '2022-08-01', 'active'),
(18, 'indefinite', 10500000, '2024-01-05', 'active'),
(19, 'indefinite', 9000000, '2021-11-11', 'active');


-- attendances
INSERT INTO attendances (id_employee, of_date, office_hours, over_time, late_time, is_night_shift) VALUES
(1, '2025-09-01', 8.0, 2.0, 0, false),
(2, '2025-09-01', 7.5, 0, 0.5, false),
(3, '2025-09-01', 8.0, 0, 0, false),
(4, '2025-09-01', 8.0, 1.0, 0, false),
(5, '2025-09-01', 7.5, 0, 0.5, false),
(6, '2025-09-01', 8.0, 0, 0, false),
(7, '2025-09-01', 8.0, 2.0, 0, false),
(8, '2025-09-01', 8.0, 0, 0, false),
(9, '2025-09-01', 8.0, 0, 0, true),
(10, '2025-09-01', 7.0, 0, 1.0, false),
(11, '2025-09-01', 8.0, 0, 0, false),
(12, '2025-09-01', 8.0, 1.5, 0, false),
(13, '2025-09-01', 8.0, 0, 0, false),
(14, '2025-09-01', 8.0, 0, 0, false),
(15, '2025-09-01', 7.5, 0, 0.5, false),
(16, '2025-09-01', 8.0, 0, 0, false),
(17, '2025-09-01', 8.0, 2.0, 0, false),
(18, '2025-09-01', 8.0, 0, 0, false),
(19, '2025-09-01', 8.0, 0, 0, false);


-- salary_details
-- salary_details (sửa id_contract từ 1 → 19)
INSERT INTO salary_details (id_contract, approved_by, salary_month, overtime, bonus, attendance_bonus, deduction, net_salary, status) VALUES
(1, 2, '2025-09-01', 0, 500000, 200000, 50000, 9650000, 'paid'),
(2, 2, '2025-09-01', 1.0, 0, 200000, 0, 11200000, 'paid'),
(3, 2, '2025-09-01', 0, 0, 200000, 50000, 8650000, 'paid'),
(4, 2, '2025-09-01', 0, 100000, 200000, 0, 10800000, 'paid'),
(5, 2, '2025-09-01', 2.0, 0, 200000, 0, 9400000, 'pending'),
(6, 2, '2025-09-01', 0, 0, 200000, 0, 12200000, 'pending'),
(7, 2, '2025-09-01', 0, 50000, 200000, 0, 9050000, 'paid'),
(8, 2, '2025-09-01', 0, 0, 200000, 50000, 11650000, 'paid'),
(9, 2, '2025-09-01', 0, 0, 200000, 0, 13200000, 'paid'),
(10, 2, '2025-09-01', 1.5, 0, 200000, 0, 9700000, 'paid'),
(11, 2, '2025-09-01', 0, 0, 200000, 0, 14200000, 'pending'),
(12, 2, '2025-09-01', 0, 0, 200000, 0, 16200000, 'pending'),
(13, 2, '2025-09-01', 0, 0, 200000, 50000, 8150000, 'paid'),
(14, 2, '2025-09-01', 0, 100000, 200000, 0, 9800000, 'paid'),
(15, 2, '2025-09-01', 2.0, 0, 200000, 0, 12900000, 'paid'),
(16, 2, '2025-09-01', 0, 0, 200000, 0, 10700000, 'paid'),
(17, 2, '2025-09-01', 0, 0, 200000, 0, 9200000, 'paid'),
(18, 2, '2025-09-01', 0, 0, 200000, 0, 11200000, 'paid'),
(19, 2, '2025-09-01', 0, 0, 200000, 50000, 8650000, 'pending');


-- leaves
INSERT INTO leaves (id_employee, approved_by, start_date, end_date, type, reason, status) VALUES
(1, 2, '2025-09-10', '2025-09-12', 'annual', 'Du lịch', 'approved'),
(3, 1, '2025-09-15', '2025-09-15', 'sick', 'Ốm', 'approved'),
(4, 1, '2025-09-18', '2025-09-20', 'unpaid', 'Việc riêng', 'pending'),
(5, 1, '2025-09-25', '2025-09-26', 'annual', 'Nghỉ phép', 'approved'),
(6, 2, '2025-09-28', '2025-09-29', 'sick', 'Nghỉ ốm', 'approved'),
(7, 2, '2025-10-01', '2025-10-01', 'sick', 'Ốm', 'approved'),
(8, 2, '2025-10-05', '2025-10-06', 'annual', 'Du lịch', 'approved'),
(9, 2, '2025-10-10', '2025-10-12', 'unpaid', 'Việc riêng', 'pending'),
(10, 2, '2025-10-15', '2025-10-15', 'sick', 'Khám sức khỏe', 'approved'),
(11, 2, '2025-10-18', '2025-10-18', 'other', 'Gia đình', 'rejected'),
(12, 2, '2025-10-21', '2025-10-23', 'annual', 'Nghỉ phép', 'pending');