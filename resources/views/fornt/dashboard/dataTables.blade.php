<!-- https://wind-town.test/dataTables -->
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tabulator CRUD Multi-Tab</title>

    <!-- Tabulator CSS -->
    <link href="https://unpkg.com/tabulator-tables@6.3/dist/css/tabulator.min.css" rel="stylesheet">
    <!-- Tabulator JS UMD đầy đủ -->
    <script src="https://unpkg.com/tabulator-tables@6.3/dist/js/tabulator.min.js"></script>

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <style>
        body {
            font-family: Arial, sans-serif;
        }

        ul.tab {
            list-style: none;
            display: flex;
            padding: 0;
            border-bottom: 2px solid #ccc;
        }

        ul.tab li {
            padding: 10px 20px;
            cursor: pointer;
            border: 1px solid transparent;
            border-bottom: none;
        }

        ul.tab li.active {
            border: 1px solid #ccc;
            background: #f1f1f1;
            font-weight: bold;
        }

        .tabcontent {
            display: none;
            padding: 20px;
            border: 1px solid #ccc;
            border-top: none;
        }

        .search-container {
            margin-bottom: 15px;
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .search-container input[type="text"] {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            width: 300px;
        }
    </style>
</head>

<body>

    <div>
        <!-- Tab links -->
        <ul class="tab">
            <li class="tablinks active" data-tabid="attendanceTab">Attendance</li>
            <li class="tablinks" data-tabid="contractTab">Contract</li>
            <li class="tablinks" data-tabid="employeeTab">Employees</li>
            <li class="tablinks" data-tabid="hierarchyTab">Hierarchy</li>
            <li class="tablinks" data-tabid="leaveTab">Leave</li>
            <li class="tablinks" data-tabid="payrollRuleTab">PayrollRule</li>
            <li class="tablinks" data-tabid="salaryDetailTab">SalaryDetail</li>
            
        </ul>

        <!-- Tab contents -->
        <div class="tabcontent" id="attendanceTab">
            <div class="search-container">
                <input type="text" id="attendance-search-input" placeholder="Tìm kiếm...">
                <button class="add-row-btn" data-tab="attendanceTab">Add Department</button>
                <button class="delete-selected-btn" data-tab="attendanceTab">Delete Selected</button>
                <span class="select-stats"></span>
            </div>
            <div id="attendanceTable"></div>
        </div>

        <div class="tabcontent" id="contractTab">
            <div class="search-container">
                <input type="text" id="contract-search-input" placeholder="Tìm kiếm...">
                <button class="add-row-btn" data-tab="contractTab">Add Position</button>
                <button class="delete-selected-btn" data-tab="contractTab">Delete Selected</button>
                <span class="select-stats"></span>
            </div>
            <div id="contractTable"></div>
        </div>

        <div class="tabcontent" id="employeeTab">
            <div class="search-container">
                <input type="text" id="employee-search-input" placeholder="Tìm kiếm...">
                <button class="add-row-btn" data-tab="employeeTab">Add Employee</button>
                <button class="delete-selected-btn" data-tab="employeeTab">Delete Selected</button>
                <span class="select-stats"></span>
            </div>
            <div id="employeeTable"></div>
        </div>

        <div class="tabcontent" id="hierarchyTab">
            <div class="search-container">
                <input type="text" id="hierarchy-search-input" placeholder="Tìm kiếm...">
                <button class="add-row-btn" data-tab="hierarchyTab">Add Role</button>
                <button class="delete-selected-btn" data-tab="hierarchyTab">Delete Selected</button>
                <span class="select-stats"></span>
            </div>
            <div id="hierarchyTable"></div>
        </div>

        <div class="tabcontent" id="leaveTab">
            <div class="search-container">
                <input type="text" id="leave-search-input" placeholder="Tìm kiếm...">
                <button class="add-row-btn" data-tab="leaveTab">Add User</button>
                <button class="delete-selected-btn" data-tab="leaveTab">Delete Selected</button>
                <span class="select-stats"></span>
            </div>
            <div id="leaveTable"></div>
        </div>

        <div class="tabcontent" id="payrollRuleTab">
            <div class="search-container">
                <input type="text" id="payrollRule-search-input" placeholder="Tìm kiếm...">
                <button class="add-row-btn" data-tab="payrollRuleTab">Add Project</button>
                <button class="delete-selected-btn" data-tab="payrollRuleTab">Delete Selected</button>
                <span class="select-stats"></span>
            </div>
            <div id="payrollRuleTable"></div>
        </div>

        <div class="tabcontent" id="salaryDetailTab">
            <div class="search-container">
                <input type="text" id="salaryDetail-search-input" placeholder="Tìm kiếm...">
                <button class="add-row-btn" data-tab="salaryDetailTab">Add Assignment</button>
                <button class="delete-selected-btn" data-tab="salaryDetailTab">Delete Selected</button>
                <span class="select-stats"></span>
            </div>
            <div id="salaryDetailTable"></div>
        </div>

       

    <script>
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
/*
        // Options for selects
        window.employeeOptions = {};
        window.hierarchyOptions = {};
        window.payrollRuleOptions = {};
        window.attendanceOptions = {};
        window.contractOptions = {};
        


        window.loadOptions = async function () {
            const [empRes, roleRes, projRes, depRes, posRes] = await Promise.all([
                fetch('/dataTables/employee'),
                fetch('/dataTables/hierarchy'),
                fetch('/dataTables/payrollRule'),
                fetch('/dataTables/attendance'),
                fetch('/dataTables/contract'),
            ]);
            const [empData, roleData, projData, depData, posData] = await Promise.all([
                empRes.json(), roleRes.json(), projRes.json(), depRes.json(), posRes.json()
            ]);

            empData.forEach(e => window.employeeOptions[e.id_employee] = e.name || e.full_name);
            roleData.forEach(r => window.hierarchyOptions[r.id_role] = r.name);
            projData.forEach(p => window.payrollRuleOptions[p.id_project] = p.name);
            depData.forEach(d => window.attendanceOptions[d.id_department] = d.name);
            posData.forEach(p => window.contractOptions[p.id_position] = p.name);
        };
*/
        // Table storage
        const tables = {};
        const tableConfigs = {
            attendanceTab: {
                selector: "#attendanceTable",
                tableName: "attendances",
                searchInput: "#attendance-search-input",
                primaryKey: "id_attendance",
                columns: [
                    { title: "ID", field: "id_attendance", editor: false },
                    { title: "ID_Employee", field: "id_employee", editor: false },
                    { title: "Date", field: "of_date", editor: false },
                    { title: "Office Hours", field: "office_hours", editor: false },
                    { title: "Over Time", field: "over_time", editor: false },
                    { title: "late Time", field: "late_time", editor: false },
                    { title: "Is Night Shift", field: "is_night_shift", editor: false },
                    { title: "Description", field: "description", editor: false },
                    { title: "Create At", field: "created_at", editor: false },
                    { title: "Update At", field: "updated_at", editor: false, formatter: "tickCross"}
                ]
            },
            employeeTab: {
                selector: "#employeeTable",
                tableName: "employees",
                searchInput: "#employee-search-input",
                primaryKey: "id_employee",
                columns: [
                    { title: "ID", field: "id_employee", editor: false },
                    { title: "Name", field: "name", editor: "input" },
                    { title: "Gender", field: "gender", editor: "input", headerFilter: "input" },
                    { title: "CCCD", field: "cccd", editor: "input", headerFilter: "input" },
                    { title: "Date of Birth", field: "date_of_birth", editor: "input" },
                    { title: "Address", field: "address", editor: "input" },
                    { title: "Email", field: "email", editor: "input" },
                   // { title: "Phone", field: "phone", editor: "list", editorParams: { values: window.attendanceOptions }, formatter: "lookup", formatterParams: window.attendanceOptions },
                  //  { title: "Bank Infor", field: "bank_infor", editor: "list", editorParams: { values: window.contractOptions }, formatter: "lookup", formatterParams: window.contractOptions },
                    { title: "Hire Date", field: "hire_date", editor: "tickCross", formatter: "tickCross" },
                    { title: "Hierarchy", field: "id_hierarchy", editor: "tickCross", formatter: "tickCross" },
                    { title: "Status", field: "status", editor: "tickCross", formatter: "tickCross" },
                    { title: "Description", field: "description", editor: false },
                    { title: "Create At", field: "created_at", editor: false },
                    { title: "Update At", field: "updated_at", editor: false, formatter: "tickCross"}
                ]
            },
            hierarchyTab: {
                selector: "#hierarchyTable",
                tableName: "hierarchys",
                searchInput: "#hierarchy-search-input",
                primaryKey: "id_hierarchy",
                columns: [
                    { title: "ID", field: "id_hierarchy", editor: false },
                    { title: "Position", field: "name_position", editor: "input" },
                    { title: "Level", field: "name_level", editor: "input" },
                    { title: "Salary Multiplier", field: "salary_multiplier", editor: false },
                    { title: "Allowance", field: "allowance", editor: false },
                    { title: "Description", field: "description", editor: false },
                    { title: "Create At", field: "created_at", editor: false },
                    { title: "Update At", field: "updated_at", editor: false, formatter: "tickCross"}
                ]
            },
            leaveTab: {
                selector: "#leaveTable",
                tableName: "leaves",
                searchInput: "#leave-search-input",
                primaryKey: "id_leave",
                columns: [
                    { title: "ID", field: "id_leave", editor: false },
                    { title: "ID_Employee", field: "id_employee", editor: "input" },
                   // { title: "Approved by", field: "approved_by", editor: "list", editorParams: { values: window.employeeOptions }, formatter: "lookup", formatterParams: window.employeeOptions },
                   // { title: "Start Date", field: "start_date", editor: "list", editorParams: { values: window.hierarchyOptions }, formatter: "lookup", formatterParams: window.hierarchyOptions },
                    { title: "End Date", field: "end_date", editor: false },
                    { title: "Type", field: "type", editor: false },
                    { title: "Reason", field: "reason", editor: false },
                    { title: "Status", field: "status", editor: false },
                    { title: "Description", field: "description", editor: false },
                    { title: "Create At", field: "created_at", editor: false },
                    { title: "Update At", field: "updated_at", editor: false, formatter: "tickCross"}
                ]
            },
            payrollRuleTab: {
                selector: "#payrollRuleTable",
                tableName: "payroll_rules",
                searchInput: "#payrollRule-search-input",
                primaryKey: "id_rule",
                columns: [
                    { title: "ID", field: "id_rule", editor: false },
                    { title: "Type", field: "type", editor: "input" },
                    { title: "Value Type", field: "value_type", editor: "input", headerFilter: "input" },
                    { title: "Value", field: "value", editor: "input" },
                    { title: "Effective Date", field: "effective_date", editor: "input" },
                    { title: "Expiry Date", field: "expiry_date", editor: "input" },
                    { title: "Description", field: "description", editor: false },
                    { title: "Create At", field: "created_at", editor: false },
                    { title: "Update At", field: "updated_at", editor: false, formatter: "tickCross"}
                ]
            },
            salaryDetailTab: {
                selector: "#salaryDetailTable",
                tableName: "salary_details",
                searchInput: "#salaryDetail-search-input",
                primaryKey: "id_salary_details",
                columns: [
                    { title: "ID", field: "id_salary_details", editor: false },
                   // { title: "Id Contract", field: "id_contract", editor: "list", editorParams: { values: window.employeeOptions }, formatter: "lookup", formatterParams: window.employeeOptions },
                   // { title: "Id Approved by", field: "approved_by", editor: "list", editorParams: { values: window.payrollRuleOptions }, formatter: "lookup", formatterParams: window.payrollRuleOptions },
                   // { title: "Salary month", field: "salary_month", editor: "list", editorParams: { values: window.hierarchyOptions }, formatter: "lookup", formatterParams: window.hierarchyOptions },
                    { title: "Over Time", field: "overtime", editor: "input" },
                    { title: "Bonus", field: "bonus", editor: "input" },
                    { title: "Attendence Bonus", field: "attendance_bonus", editor: false },
                    { title: "Deduction", field: "deduction", editor: false },
                    { title: "Net Salary", field: "net_salary", editor: false, formatter: "tickCross"},
                    { title: "Status", field: "status", editor: false },
                    { title: "Description", field: "description", editor: false, formatter: "tickCross"},
                    { title: "Create At", field: "created_at", editor: false },
                    { title: "Update At", field: "updated_at", editor: false, formatter: "tickCross"}
                    
                ]
            },
            contractTab: {
                selector: "#contractTable",
                tableName: "contracts",
                searchInput: "#contract-search-input",
                primaryKey: "id_contract",
                columns: [
                  //  { title: "ID", field: "id_contract", editor: false },
                  //  { title: "Id Employee", field: "id_employee", editor: "list", editorParams: { values: window.payrollRuleOptions }, formatter: "lookup", formatterParams: window.payrollRuleOptions },
                   // { title: "Base Salary", field: "base_salary", editor: "list", editorParams: { values: window.hierarchyOptions }, formatter: "lookup", formatterParams: window.hierarchyOptions },
                    { title: "Effective Date", field: "effective_date", editor: "input" },
                    { title: "Expiry Date", field: "expiry_date", editor: "input" },
                    { title: "Status", field: "status", editor: false },
                    { title: "Description", field: "description", editor: false, formatter: "tickCross"} ,
                    { title: "Create At", field: "created_at", editor: false },
                    { title: "Update At", field: "updated_at", editor: false, formatter: "tickCross"}
                    
                ]
            }
            // Có thể thêm Attendances, Salaries, Leaves, Performance Reviews theo mẫu giống Assignments/Employees
        };

        // Hàm tạo bảng khi mở tab
        async function createTable(tabid) {
            if (!tables[tabid] && tableConfigs[tabid]) {
                const config = tableConfigs[tabid];

                // Đợi options load xong
              //  await window.loadOptions();

                const table = new Tabulator(config.selector, {
                    ajaxURL: `/dataTables/${config.tableName}`,
                    layout: "fitColumns",
                    pagination: "local",
                    paginationSize: 10,
                    paginationSizeSelector: [10, 20, 30, 50],
                    movableColumns: true,
                    columns: config.columns,
                    rowSelectionChanged: function (data, rows) {
                        const stats = document.querySelector(`#${tabid} .select-stats`);
                        if (stats) stats.innerHTML = `Rows selected: ${data.length}`;
                    }
                });

                // Khi cell edit
                table.on("cellEdited", function (cell) {
                    const rowData = cell.getRow().getData();
                    const id = rowData[config.primaryKey];
                    if (!id) {
                        console.error("Row chưa có ID, không thể update");
                        return;
                    }
                    fetch(`/dataTables/${config.tableName}/${id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrfToken },
                        body: JSON.stringify(rowData)
                    })
                        .then(res => res.json())
                        .then(data => cell.getRow().update(data))
                        .catch(err => console.error("Update row failed:", err));
                });

                tables[tabid] = table;

                // Filter search
                const searchInput = document.querySelector(config.searchInput);
                if (searchInput) {
                    searchInput.addEventListener("keyup", e => {
                        table.setFilter(null, "like", e.target.value);
                    });
                }
            }
        }

        // Mở tab
        async function openTab(evt, tabid) {
            document.querySelectorAll(".tabcontent").forEach(tc => tc.style.display = "none");
            document.querySelectorAll(".tablinks").forEach(tl => tl.classList.remove("active"));
            document.getElementById(tabid).style.display = "block";
            evt.currentTarget.classList.add("active");

            if (!tables[tabid]) await createTable(tabid);
            else tables[tabid].redraw(true);
        }

        // Event click tab
        document.querySelectorAll(".tablinks").forEach(tab => {
            tab.addEventListener("click", evt => openTab(evt, tab.dataset.tabid));
        });

        // Mở tab đầu tiên
        const firstTab = document.querySelector(".tablinks.active");
        if (firstTab) openTab({ currentTarget: firstTab }, firstTab.dataset.tabid);

        // Add row
        document.querySelectorAll(".add-row-btn").forEach(btn => {
            btn.addEventListener("click", async function () {
                const tabid = this.dataset.tab;
                const table = tables[tabid];
                const config = tableConfigs[tabid];
                if (!table) return;

                const newRow = await table.addRow({}, true);
                fetch(`/dataTables/${config.tableName}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrfToken },
                    body: JSON.stringify(newRow.getData())
                })
                    .then(res => res.json())
                    .then(data => newRow.update(data))
                    .catch(err => {
                        console.error("Create row failed:", err);
                        newRow.delete();
                        alert("Failed to create row, removed.");
                    });
            });
        });

        // Delete selected rows
        document.querySelectorAll(".delete-selected-btn").forEach(btn => {
            btn.addEventListener("click", function () {
                const tabid = this.dataset.tab;
                const table = tables[tabid];
                const config = tableConfigs[tabid];
                if (!table) return;

                const selectedRows = table.getSelectedRows();
                if (!selectedRows.length) { alert("Chưa có dòng nào được chọn"); return; }
                if (!confirm(`Xóa ${selectedRows.length} dòng đã chọn?`)) return;

                selectedRows.forEach(row => {
                    const id = row.getData()[config.primaryKey];
                    fetch(`/dataTables/${config.tableName}/${id}`, {
                        method: "DELETE",
                        headers: { "X-CSRF-TOKEN": csrfToken }
                    })
                        .then(res => {
                            if (!res.ok) throw new Error("Server error " + res.status);
                            row.delete();
                        })
                        .catch(err => console.error("Delete row failed:", err));
                });
            });
        });

    </script>
</body>

</html>