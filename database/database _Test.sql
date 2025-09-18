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
    salary_multiplier DECIMAL(15,2),
    allowance DECIMAL(15,2),
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
    type ENUM('attendance_bonus','overtime_rate','night_shift','holiday_bonus','meal_allowance','late_penalty','other'),
    value_type ENUM('money','multiplier') DEFAULT 'money',
    value DECIMAL(15,2),
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
    base_salary DECIMAL(15,2),
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
    overtime DECIMAL(15,2) DEFAULT 0,
    bonus DECIMAL(15,2) DEFAULT 0 NOT NULL,
    attendance_bonus DECIMAL(15,2) DEFAULT 0,
    deduction DECIMAL(15,2) DEFAULT 0 NOT NULL,
    net_salary DECIMAL(15,2),
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
('Developer', 'Junior', 1.0, 500000, 'Nhân viên mới'),
('Developer', 'Senior', 1.5, 1000000, 'Nhân viên kinh nghiệm'),
('Team Lead', 'Lead', 2.0, 2000000, 'Trưởng nhóm'),
('Manager', 'Senior', 3.0, 3000000, 'Quản lý cấp cao');

-- employees
INSERT INTO employees (name, gender, cccd, date_of_birth, address, email, phone, bank_infor, hire_date, id_hierarchy, status)
VALUES 
('Nguyen Van A', 1, '012345678', '1990-01-01', 'HN', 'a@example.com', '0901234567', 'vietcombank_123456789', '2022-01-01', 1, 'active'),
('Tran Thi B', 0, '987654321', '1992-05-05', 'HCM', 'b@example.com', '0907654321', 'vietcombank_987654321', '2021-06-15', 2, 'active');

-- payroll_rules
INSERT INTO payroll_rules (type, value_type, value, effective_date)
VALUES
('attendance_bonus','money',200000,'2025-01-01'),
('overtime_rate','multiplier',1.5,'2025-01-01');

-- contracts
INSERT INTO contracts (id_employee, contract_type, base_salary, effective_date, status)
VALUES
(1, 'indefinite', 10000000, '2022-01-01', 'active'),
(2, 'indefinite', 12000000, '2021-06-15', 'active');

-- attendances
INSERT INTO attendances (id_employee, of_date, office_hours, over_time, late_time, is_night_shift)
VALUES
(1, '2025-09-01', 8.0, 2.0, 0, false),
(2, '2025-09-01', 7.5, 0, 0.5, false);

-- salary_details
INSERT INTO salary_details (id_contract, approved_by, salary_month, overtime, bonus, attendance_bonus, deduction, net_salary, status)
VALUES
(1, 2, '2025-09-01', 2.0, 500000, 200000, 100000, 11700000, 'pending');

-- leaves
INSERT INTO leaves (id_employee, approved_by, start_date, end_date, type, reason, status)
VALUES
(1, 2, '2025-09-10', '2025-09-12', 'annual', 'Du lịch', 'approved');
