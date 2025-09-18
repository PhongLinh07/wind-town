-- XÓA CÁC BẢNG NẾU TỒN TẠI (THEO THỨ TỰ NGƯỢC ĐỂ TRÁNH LỖI KHÓA NGOẠI)
DROP TABLE IF EXISTS performance_reviews;
DROP TABLE IF EXISTS leaves;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS salaries;
DROP TABLE IF EXISTS attendances;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS employee_manager;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS positions;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS projects;

-- Bảng Phòng ban
CREATE TABLE departments (
    id_department INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Chức vụ
CREATE TABLE positions (
    id_position INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    level INT COMMENT 'Cấp bậc: 1=staff, 2=lead, 3=manager…',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Vai trò hệ thống / dự án
CREATE TABLE roles (
    id_role INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(80) UNIQUE NOT NULL COMMENT "admin, hr, employee, Project Leader, Developer, Tester, Mentor",
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Dự án
CREATE TABLE projects (
    id_project INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    start_date DATE,
    end_date DATE,
    status ENUM('planning','in_progress','completed','cancelled') DEFAULT 'planning',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Nhân viên
CREATE TABLE employees (
    id_employee INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    gender INT COMMENT '1=male, 0=female, 3=unknown',
    cccd VARCHAR(20) UNIQUE NOT NULL,
    date_of_birth DATE,
    address VARCHAR(300),
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(15),
    hire_date DATE,
    id_department INT,
    id_position INT,
    status ENUM('active','inactive','resigned') DEFAULT 'active',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Quản lý nhân viên
CREATE TABLE employee_manager (
    id_employee_manager INT PRIMARY KEY AUTO_INCREMENT,
    id_employee INT UNIQUE,
    id_manager INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Tài khoản
CREATE TABLE users (
    id_user INT PRIMARY KEY AUTO_INCREMENT,
    id_employee INT UNIQUE,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    id_role INT,
    last_login TIMESTAMP NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Chấm công
CREATE TABLE attendances (
    id_attendance INT PRIMARY KEY AUTO_INCREMENT,
    id_employee INT,
    check_in DATETIME,
    check_out DATETIME,
    work_hours DECIMAL(5,2) COMMENT 'số giờ làm',
    status ENUM('present','absent','late','leave') DEFAULT 'present',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Lương
CREATE TABLE salaries (
    id_salary INT PRIMARY KEY AUTO_INCREMENT,
    id_employee INT,
    month INT NOT NULL,
    year INT NOT NULL,
    base_salary DECIMAL(15,2),
    bonus DECIMAL(15,2) DEFAULT 0,
    allowance DECIMAL(15,2) DEFAULT 0,
    deduction DECIMAL(15,2) DEFAULT 0,
    net_salary DECIMAL(15,2) COMMENT 'lương thực nhận',
    status ENUM('pending','paid') DEFAULT 'pending',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Phân công dự án
CREATE TABLE assignments (
    id_employee INT,
    id_project INT,
    role VARCHAR(100) COMMENT 'vai trò trong dự án (dev, tester, PM…)',
    assigned_date DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_employee, id_project)
);

-- Bảng Nghỉ phép
CREATE TABLE leaves (
    id_leave INT PRIMARY KEY AUTO_INCREMENT,
    id_employee INT,
    start_date DATE,
    end_date DATE,
    type ENUM('annual','sick','unpaid','other') DEFAULT 'annual',
    reason TEXT,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Đánh giá hiệu suất
CREATE TABLE performance_reviews (
    id_review INT PRIMARY KEY AUTO_INCREMENT,
    id_employee INT,
    id_reviewer INT COMMENT 'người đánh giá',
    review_date DATE,
    score INT COMMENT '1-10',
    comments TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- Khóa ngoại cho Bảng `employees`
ALTER TABLE employees
ADD CONSTRAINT fk_employees_department
FOREIGN KEY (id_department) REFERENCES departments(id_department),
ADD CONSTRAINT fk_employees_position
FOREIGN KEY (id_position) REFERENCES positions(id_position);

-- Khóa ngoại cho Bảng `employee_manager`
ALTER TABLE employee_manager
ADD CONSTRAINT fk_em_employee
FOREIGN KEY (id_employee) REFERENCES employees(id_employee),
ADD CONSTRAINT fk_em_manager
FOREIGN KEY (id_manager) REFERENCES employees(id_employee);

-- Khóa ngoại cho Bảng `users`
ALTER TABLE users
ADD CONSTRAINT fk_users_employee
FOREIGN KEY (id_employee) REFERENCES employees(id_employee),
ADD CONSTRAINT fk_users_role
FOREIGN KEY (id_role) REFERENCES roles(id_role);

-- Khóa ngoại cho Bảng `attendances`
ALTER TABLE attendances
ADD CONSTRAINT fk_attendances_employee
FOREIGN KEY (id_employee) REFERENCES employees(id_employee);

-- Khóa ngoại cho Bảng `salaries`
ALTER TABLE salaries
ADD CONSTRAINT fk_salaries_employee
FOREIGN KEY (id_employee) REFERENCES employees(id_employee);

-- Khóa ngoại cho Bảng `assignments`
ALTER TABLE assignments
ADD CONSTRAINT fk_assignments_employee
FOREIGN KEY (id_employee) REFERENCES employees(id_employee),
ADD CONSTRAINT fk_assignments_project
FOREIGN KEY (id_project) REFERENCES projects(id_project);
ADD CONSTRAINT fk_assignments_role
FOREIGN KEY (id_role) REFERENCES roles(id_role);

-- Khóa ngoại cho Bảng `leaves`
ALTER TABLE leaves
ADD CONSTRAINT fk_leaves_employee
FOREIGN KEY (id_employee) REFERENCES employees(id_employee);

-- Khóa ngoại cho Bảng `performance_reviews`
ALTER TABLE performance_reviews
ADD CONSTRAINT fk_pr_employee
FOREIGN KEY (id_employee) REFERENCES employees(id_employee),
ADD CONSTRAINT fk_pr_reviewer
FOREIGN KEY (id_reviewer) REFERENCES employees(id_employee);


-- ===================================
-- DỮ LIỆU CÁC BẢNG CORE (KHÔNG PHỤ THUỘC)
-- ===================================

-- Thêm dữ liệu vào bảng `departments`
INSERT INTO departments (id_department, name, description) VALUES
(1, 'Phòng ban IT', 'Phòng ban chịu trách nhiệm về công nghệ thông tin và phát triển phần mềm.'),
(2, 'Phòng ban Marketing', 'Phòng ban phụ trách các chiến dịch tiếp thị và truyền thông.'),
(3, 'Phòng ban Nhân sự', 'Phòng ban quản lý nhân sự, tuyển dụng và đào tạo.'),
(4, 'Phòng ban Kế toán', 'Phòng ban xử lý các vấn đề tài chính và kế toán.');

-- Thêm dữ liệu vào bảng `positions`
INSERT INTO positions (id_position, name, level, description) VALUES
(1, 'Trưởng phòng', 3, 'Vị trí quản lý cấp cao, đứng đầu một phòng ban.'),
(2, 'Trưởng nhóm', 2, 'Vị trí quản lý nhóm nhỏ, chịu trách nhiệm về kết quả của nhóm.'),
(3, 'Nhân viên chính thức', 1, 'Vị trí cơ bản, thực hiện các công việc chuyên môn.'),
(4, 'Thực tập sinh', 1, 'Vị trí cho sinh viên mới ra trường hoặc chưa có kinh nghiệm.');

-- Thêm dữ liệu vào bảng `roles`
INSERT INTO roles (id_role, name, description) VALUES
(1, 'admin', 'Quản trị viên hệ thống.'),
(2, 'manager', 'Quản lý phòng ban, có quyền phê duyệt.'),
(3, 'employee', 'Vai trò cơ bản cho tất cả nhân viên.');

-- Thêm dữ liệu vào bảng `projects`
INSERT INTO projects (id_project, name, start_date, end_date, status, description) VALUES
(1, 'Dự án Hệ thống HRM', '2025-01-01', '2025-12-31', 'in_progress', 'Phát triển hệ thống quản lý nhân sự.'),
(2, 'Chiến dịch Quảng cáo Mùa hè', '2025-06-01', '2025-09-30', 'in_progress', 'Chạy quảng cáo cho sản phẩm mới.'),
(3, 'Tự động hóa Kế toán', '2025-03-10', '2025-08-30', 'completed', 'Tự động hóa các nghiệp vụ kế toán.'),
(4, 'Tuyển dụng nhân viên mới', '2025-05-01', '2025-10-31', 'planning', 'Chiến dịch tuyển dụng nhân sự cho các phòng ban.');

-- Thêm dữ liệu vào bảng `employees` (tạo 1 trưởng phòng, 2 trưởng nhóm và 7 nhân viên cho mỗi phòng ban)
-- Tổng cộng 40 nhân viên (10 mỗi phòng ban)
INSERT INTO employees (name, gender, cccd, date_of_birth, address, email, phone, hire_date, id_department, id_position, status, description) VALUES
-- IT Department (id_department = 1)
('Nguyễn Văn A', 1, '111111111111', '1985-05-10', 'Số 1, P.A, Q.1, TP.HCM', 'a.nguyen@company.com', '0901234567', '2015-01-10', 1, 1, 'active', 'Trưởng phòng IT'),
('Trần Thị B', 0, '222222222222', '1990-03-20', 'Số 2, P.B, Q.2, TP.HCM', 'b.tran@company.com', '0901234568', '2018-05-15', 1, 2, 'active', 'Trưởng nhóm Phát triển'),
('Lê Văn C', 1, '333333333333', '1992-07-25', 'Số 3, P.C, Q.3, TP.HCM', 'c.le@company.com', '0901234569', '2019-11-01', 1, 2, 'active', 'Trưởng nhóm Kiểm thử'),
('Phạm Thị D', 0, '444444444444', '1995-09-12', 'Số 4, P.D, Q.4, TP.HCM', 'd.pham@company.com', '0901234570', '2020-03-20', 1, 3, 'active', 'Lập trình viên Backend'),
('Hoàng Văn E', 1, '555555555555', '1996-11-30', 'Số 5, P.E, Q.5, TP.HCM', 'e.hoang@company.com', '0901234571', '2021-08-01', 1, 3, 'active', 'Lập trình viên Frontend'),
('Võ Thị F', 0, '666666666666', '1998-01-05', 'Số 6, P.F, Q.6, TP.HCM', 'f.vo@company.com', '0901234572', '2022-02-15', 1, 3, 'active', 'Nhân viên DevOps'),
('Đặng Văn G', 1, '777777777777', '1997-04-18', 'Số 7, P.G, Q.7, TP.HCM', 'g.dang@company.com', '0901234573', '2023-09-01', 1, 3, 'active', 'Nhân viên hỗ trợ kỹ thuật'),
('Bùi Thị H', 0, '888888888888', '1999-06-22', 'Số 8, P.H, Q.8, TP.HCM', 'h.bui@company.com', '0901234574', '2024-03-01', 1, 3, 'active', 'Nhân viên BA'),
('Trần Văn I', 1, '999999999999', '2000-08-14', 'Số 9, P.I, Q.9, TP.HCM', 'i.tran@company.com', '0901234575', '2025-01-20', 1, 4, 'active', 'Thực tập sinh IT'),
('Ngô Thị K', 0, '000000000000', '2001-10-21', 'Số 10, P.K, Q.10, TP.HCM', 'k.ngo@company.com', '0901234576', '2025-05-01', 1, 4, 'active', 'Thực tập sinh IT'),
-- Marketing Department (id_department = 2)
('Vũ Văn L', 1, '111111111112', '1987-12-05', 'Số 11, P.L, Q.11, TP.HCM', 'l.vu@company.com', '0901234577', '2016-02-25', 2, 1, 'active', 'Trưởng phòng Marketing'),
('Trịnh Thị M', 0, '222222222223', '1991-04-18', 'Số 12, P.M, Q.12, TP.HCM', 'm.trinh@company.com', '0901234578', '2019-06-10', 2, 2, 'active', 'Trưởng nhóm Content'),
('Đào Văn N', 1, '333333333334', '1993-08-28', 'Số 13, P.N, Q.Tân Bình, TP.HCM', 'n.dao@company.com', '0901234579', '2020-04-05', 2, 2, 'active', 'Trưởng nhóm Digital'),
('Chu Thị O', 0, '444444444445', '1995-10-09', 'Số 14, P.O, Q.Tân Phú, TP.HCM', 'o.chu@company.com', '0901234580', '2021-09-20', 2, 3, 'active', 'Chuyên viên SEO'),
('Bùi Văn P', 1, '555555555556', '1997-12-15', 'Số 15, P.P, Q.Gò Vấp, TP.HCM', 'p.bui@company.com', '0901234581', '2022-05-03', 2, 3, 'active', 'Chuyên viên SEM'),
('Hoàng Thị Q', 0, '666666666667', '1999-02-28', 'Số 16, P.Q, Q.Bình Thạnh, TP.HCM', 'q.hoang@company.com', '0901234582', '2023-06-10', 2, 3, 'active', 'Chuyên viên Content'),
('Võ Văn R', 1, '777777777778', '1998-04-10', 'Số 17, P.R, Q.Phú Nhuận, TP.HCM', 'r.vo@company.com', '0901234583', '2024-01-20', 2, 3, 'active', 'Chuyên viên Quan hệ công chúng'),
('Nguyễn Thị S', 0, '888888888889', '2000-06-12', 'Số 18, P.S, Q.Thủ Đức, TP.HCM', 's.nguyen@company.com', '0901234584', '2024-07-01', 2, 3, 'active', 'Chuyên viên Email Marketing'),
('Trần Văn T', 1, '999999999990', '2001-08-18', 'Số 19, P.T, Q.1, TP.HCM', 't.tran@company.com', '0901234585', '2025-01-15', 2, 4, 'active', 'Thực tập sinh Marketing'),
('Đinh Thị U', 0, '000000000001', '2002-10-25', 'Số 20, P.U, Q.2, TP.HCM', 'u.dinh@company.com', '0901234586', '2025-03-05', 2, 4, 'active', 'Thực tập sinh Marketing'),
-- Human Resources Department (id_department = 3)
('Phan Văn V', 1, '111111111113', '1986-07-07', 'Số 21, P.V, Q.3, TP.HCM', 'v.phan@company.com', '0901234587', '2015-02-18', 3, 1, 'active', 'Trưởng phòng Nhân sự'),
('Lê Thị W', 0, '222222222224', '1991-09-29', 'Số 22, P.W, Q.4, TP.HCM', 'w.le@company.com', '0901234588', '2018-08-05', 3, 2, 'active', 'Trưởng nhóm Tuyển dụng'),
('Võ Văn X', 1, '333333333335', '1994-01-08', 'Số 23, P.X, Q.5, TP.HCM', 'x.vo@company.com', '0901234589', '2019-12-10', 3, 2, 'active', 'Trưởng nhóm C&B'),
('Nguyễn Thị Y', 0, '444444444446', '1996-03-15', 'Số 24, P.Y, Q.6, TP.HCM', 'y.nguyen@company.com', '0901234590', '2020-05-20', 3, 3, 'active', 'Chuyên viên Tuyển dụng'),
('Trần Văn Z', 1, '555555555557', '1997-05-25', 'Số 25, P.Z, Q.7, TP.HCM', 'z.tran@company.com', '0901234591', '2021-07-15', 3, 3, 'active', 'Chuyên viên Đào tạo'),
('Lý Thị AA', 0, '666666666668', '1999-07-30', 'Số 26, P.AA, Q.8, TP.HCM', 'aa.ly@company.com', '0901234592', '2022-09-01', 3, 3, 'active', 'Chuyên viên C&B'),
('Mai Văn BB', 1, '777777777779', '2000-09-11', 'Số 27, P.BB, Q.9, TP.HCM', 'bb.mai@company.com', '0901234593', '2023-10-20', 3, 3, 'active', 'Nhân viên Hành chính'),
('Nguyễn Thị CC', 0, '888888888890', '2001-11-20', 'Số 28, P.CC, Q.10, TP.HCM', 'cc.nguyen@company.com', '0901234594', '2024-11-01', 3, 3, 'active', 'Chuyên viên Tuyển dụng'),
('Hoàng Văn DD', 1, '999999999991', '2002-01-08', 'Số 29, P.DD, Q.11, TP.HCM', 'dd.hoang@company.com', '0901234595', '2025-02-15', 3, 4, 'active', 'Thực tập sinh Nhân sự'),
('Trần Thị EE', 0, '000000000002', '2003-03-17', 'Số 30, P.EE, Q.12, TP.HCM', 'ee.tran@company.com', '0901234596', '2025-05-20', 3, 4, 'active', 'Thực tập sinh Nhân sự'),
-- Accounting Department (id_department = 4)
('Lý Văn FF', 1, '111111111114', '1988-09-19', 'Số 31, P.FF, Q.Tân Bình, TP.HCM', 'ff.ly@company.com', '0901234597', '2016-03-01', 4, 1, 'active', 'Trưởng phòng Kế toán'),
('Vương Thị GG', 0, '222222222225', '1993-01-28', 'Số 32, P.GG, Q.Tân Phú, TP.HCM', 'gg.vuong@company.com', '0901234598', '2019-07-20', 4, 2, 'active', 'Trưởng nhóm Kế toán'),
('Dương Văn HH', 1, '333333333336', '1995-05-05', 'Số 33, P.HH, Q.Gò Vấp, TP.HCM', 'hh.duong@company.com', '0901234599', '2020-08-10', 4, 2, 'active', 'Trưởng nhóm Thuế'),
('Nguyễn Văn II', 1, '444444444447', '1997-08-16', 'Số 34, P.II, Q.Bình Thạnh, TP.HCM', 'ii.nguyen@company.com', '0901234600', '2021-11-25', 4, 3, 'active', 'Kế toán tổng hợp'),
('Đỗ Thị JJ', 0, '555555555558', '1999-10-23', 'Số 35, P.JJ, Q.Phú Nhuận, TP.HCM', 'jj.do@company.com', '0901234601', '2022-12-10', 4, 3, 'active', 'Kế toán công nợ'),
('Phan Văn KK', 1, '666666666669', '2000-12-12', 'Số 36, P.KK, Q.Thủ Đức, TP.HCM', 'kk.phan@company.com', '0901234602', '2023-01-20', 4, 3, 'active', 'Kế toán thuế'),
('Lê Thị LL', 0, '777777777770', '2002-02-28', 'Số 37, P.LL, Q.1, TP.HCM', 'll.le@company.com', '0901234603', '2024-03-05', 4, 3, 'active', 'Kế toán nội bộ'),
('Nguyễn Văn MM', 1, '888888888891', '2003-04-10', 'Số 38, P.MM, Q.2, TP.HCM', 'mm.nguyen@company.com', '0901234604', '2024-06-15', 4, 3, 'active', 'Thủ quỹ'),
('Vũ Thị NN', 0, '999999999992', '2004-06-15', 'Số 39, P.NN, Q.3, TP.HCM', 'nn.vu@company.com', '0901234605', '2025-01-05', 4, 4, 'active', 'Thực tập sinh Kế toán'),
('Trần Văn OO', 1, '000000000003', '2005-08-20', 'Số 40, P.OO, Q.4, TP.HCM', 'oo.tran@company.com', '0901234606', '2025-03-01', 4, 4, 'active', 'Thực tập sinh Kế toán');

-- Dữ liệu cho Bảng `employee_manager`
-- Gán quản lý cho từng nhân viên (Trưởng phòng quản lý trưởng nhóm, Trưởng nhóm quản lý nhân viên)
INSERT INTO employee_manager (id_employee, id_manager) VALUES
-- IT
(2, 1), (3, 1),
(4, 2), (5, 2), (6, 2),
(7, 3), (8, 3), (9, 3), (10, 3),
-- Marketing
(12, 11), (13, 11),
(14, 12), (15, 12), (16, 12), (17, 12),
(18, 13), (19, 13), (20, 13),
-- Human Resources
(22, 21), (23, 21),
(24, 22), (25, 22), (26, 22),
(27, 23), (28, 23), (29, 23), (30, 23),
-- Accounting
(32, 31), (33, 31),
(34, 32), (35, 32),
(36, 33), (37, 33), (38, 33), (39, 33), (40, 33);

-- Dữ liệu cho Bảng `users`
INSERT INTO users (id_employee, email, password, id_role, last_login) VALUES
(1, 'a.nguyen@company.com', MD5('pass123'), 1, '2025-09-16 09:00:00'),
(2, 'b.tran@company.com', MD5('pass123'), 2, '2025-09-16 09:15:00'),
(3, 'c.le@company.com', MD5('pass123'), 2, '2025-09-16 09:10:00'),
(4, 'd.pham@company.com', MD5('pass123'), 3, '2025-09-16 09:20:00'),
(5, 'e.hoang@company.com', MD5('pass123'), 3, '2025-09-16 09:25:00'),
(6, 'f.vo@company.com', MD5('pass123'), 3, '2025-09-16 09:30:00'),
(7, 'g.dang@company.com', MD5('pass123'), 3, '2025-09-16 09:35:00'),
(8, 'h.bui@company.com', MD5('pass123'), 3, '2025-09-16 09:40:00'),
(9, 'i.tran@company.com', MD5('pass123'), 3, '2025-09-16 09:45:00'),
(10, 'k.ngo@company.com', MD5('pass123'), 3, '2025-09-16 09:50:00'),
(11, 'l.vu@company.com', MD5('pass123'), 2, '2025-09-16 08:30:00'),
(12, 'm.trinh@company.com', MD5('pass123'), 2, '2025-09-16 08:45:00'),
(13, 'n.dao@company.com', MD5('pass123'), 2, '2025-09-16 08:50:00'),
(14, 'o.chu@company.com', MD5('pass123'), 3, '2025-09-16 09:00:00'),
(15, 'p.bui@company.com', MD5('pass123'), 3, '2025-09-16 09:05:00'),
(16, 'q.hoang@company.com', MD5('pass123'), 3, '2025-09-16 09:10:00'),
(17, 'r.vo@company.com', MD5('pass123'), 3, '2025-09-16 09:15:00'),
(18, 's.nguyen@company.com', MD5('pass123'), 3, '2025-09-16 09:20:00'),
(19, 't.tran@company.com', MD5('pass123'), 3, '2025-09-16 09:25:00'),
(20, 'u.dinh@company.com', MD5('pass123'), 3, '2025-09-16 09:30:00'),
(21, 'v.phan@company.com', MD5('pass123'), 2, '2025-09-16 08:40:00'),
(22, 'w.le@company.com', MD5('pass123'), 2, '2025-09-16 08:50:00'),
(23, 'x.vo@company.com', MD5('pass123'), 2, '2025-09-16 08:55:00'),
(24, 'y.nguyen@company.com', MD5('pass123'), 3, '2025-09-16 09:00:00'),
(25, 'z.tran@company.com', MD5('pass123'), 3, '2025-09-16 09:05:00'),
(26, 'aa.ly@company.com', MD5('pass123'), 3, '2025-09-16 09:10:00'),
(27, 'bb.mai@company.com', MD5('pass123'), 3, '2025-09-16 09:15:00'),
(28, 'cc.nguyen@company.com', MD5('pass123'), 3, '2025-09-16 09:20:00'),
(29, 'dd.hoang@company.com', MD5('pass123'), 3, '2025-09-16 09:25:00'),
(30, 'ee.tran@company.com', MD5('pass123'), 3, '2025-09-16 09:30:00');

-- Dữ liệu cho Bảng `attendances` (Chấm công cho 3 ngày gần nhất)
-- Ngày 16/09/2025
INSERT INTO attendances (id_employee, check_in, check_out, work_hours, status, description) VALUES
(1, '2025-09-16 08:00:00', '2025-09-16 17:00:00', 8.00, 'present', 'Đi làm đúng giờ.'),
(2, '2025-09-16 08:05:00', '2025-09-16 17:05:00', 8.00, 'present', 'Đi làm đúng giờ.'),
(3, '2025-09-16 08:15:00', '2025-09-16 17:15:00', 8.00, 'late', 'Đến muộn do tắc đường.'),
(4, '2025-09-16 07:55:00', '2025-09-16 16:55:00', 8.00, 'present', 'Đi làm sớm.'),
(5, '2025-09-16 08:00:00', '2025-09-16 17:00:00', 8.00, 'present', 'Đi làm đúng giờ.');
-- Ngày 15/09/2025
INSERT INTO attendances (id_employee, check_in, check_out, work_hours, status, description) VALUES
(1, '2025-09-15 08:00:00', '2025-09-15 17:00:00', 8.00, 'present', 'Đi làm đúng giờ.'),
(2, '2025-09-15 08:00:00', '2025-09-15 17:00:00', 8.00, 'present', 'Đi làm đúng giờ.'),
(3, '2025-09-15 08:00:00', '2025-09-15 17:00:00', 8.00, 'present', 'Đi làm đúng giờ.'),
(4, '2025-09-15 08:30:00', '2025-09-15 17:30:00', 8.00, 'late', 'Đến muộn vì cuộc họp đột xuất.'),
(5, '2025-09-15 08:00:00', '2025-09-15 17:00:00', 8.00, 'present', 'Đi làm đúng giờ.');
-- Ngày 14/09/2025 (Thứ 7, một số người nghỉ)
INSERT INTO attendances (id_employee, check_in, check_out, work_hours, status, description) VALUES
(1, '2025-09-14 08:00:00', '2025-09-14 12:00:00', 4.00, 'present', 'Làm thêm giờ.'),
(2, '2025-09-14 08:00:00', '2025-09-14 12:00:00', 4.00, 'present', 'Làm thêm giờ.'),
(3, NULL, NULL, 0.00, 'absent', 'Nghỉ cuối tuần.'),
(4, NULL, NULL, 0.00, 'absent', 'Nghỉ cuối tuần.'),
(5, NULL, NULL, 0.00, 'absent', 'Nghỉ cuối tuần.');

-- Dữ liệu cho Bảng `salaries`
INSERT INTO salaries (id_employee, month, year, base_salary, bonus, allowance, deduction, net_salary, status) VALUES
(1, 9, 2025, 30000000.00, 5000000.00, 2000000.00, 1000000.00, 36000000.00, 'paid'),
(2, 9, 2025, 20000000.00, 3000000.00, 1000000.00, 500000.00, 23500000.00, 'paid'),
(3, 9, 2025, 18000000.00, 2500000.00, 1000000.00, 450000.00, 21050000.00, 'paid'),
(4, 9, 2025, 12000000.00, 1000000.00, 500000.00, 300000.00, 13200000.00, 'paid'),
(5, 9, 2025, 12000000.00, 1000000.00, 500000.00, 300000.00, 13200000.00, 'paid');

-- Dữ liệu cho Bảng `assignments`
INSERT INTO assignments (id_employee, id_project, role, assigned_date) VALUES
(1, 1, 'Project Manager', '2025-01-01'),
(2, 1, 'Technical Lead', '2025-01-05'),
(3, 1, 'Tester Lead', '2025-01-05'),
(4, 1, 'Developer', '2025-01-10'),
(5, 1, 'Developer', '2025-01-10'),
(11, 2, 'Project Manager', '2025-06-01'),
(12, 2, 'Content Strategist', '2025-06-05'),
(13, 2, 'Digital Marketing Manager', '2025-06-05'),
(31, 3, 'Project Manager', '2025-03-10'),
(32, 3, 'Accountant', '2025-03-15'),
(33, 3, 'Tax Specialist', '2025-03-15'),
(21, 4, 'Project Manager', '2025-05-01'),
(22, 4, 'Recruitment Specialist', '2025-05-05'),
(28, 4, 'Recruitment Specialist', '2025-05-05');

-- Dữ liệu cho Bảng `leaves`
INSERT INTO leaves (id_employee, start_date, end_date, type, reason, status) VALUES
(1, '2025-09-20', '2025-09-22', 'annual', 'Nghỉ phép cá nhân', 'pending'),
(2, '2025-09-15', '2025-09-15', 'sick', 'Ốm nhẹ', 'approved'),
(3, '2025-10-01', '2025-10-02', 'unpaid', 'Việc gia đình', 'approved'),
(4, '2025-09-16', '2025-09-16', 'sick', 'Đau đầu', 'rejected'),
(5, '2025-09-14', '2025-09-14', 'unpaid', 'Tham gia khóa học', 'approved');

-- Dữ liệu cho Bảng `performance_reviews`
INSERT INTO performance_reviews (id_employee, id_reviewer, review_date, score, comments) VALUES
(2, 1, '2025-09-10', 9, 'Hoàn thành xuất sắc dự án, vượt mục tiêu đề ra.'),
(3, 1, '2025-09-10', 8, 'Có kỹ năng chuyên môn tốt, cần cải thiện khả năng làm việc nhóm.'),
(4, 2, '2025-09-12', 7, 'Thực hiện tốt các case test, cần chủ động hơn trong công việc.'),
(5, 2, '2025-09-12', 7, 'Phát triển các tính năng hiệu quả, cần tập trung hơn vào tối ưu hiệu suất.'),
(12, 11, '2025-09-11', 9, 'Sáng tạo trong các chiến dịch, mang lại hiệu quả cao.'),
(14, 12, '2025-09-12', 8, 'Nội dung chất lượng, cần đa dạng hóa kênh phân phối.');