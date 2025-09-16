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
            <li class="tablinks active" data-tabid="departmentsTab">Departments</li>
            <li class="tablinks" data-tabid="positionsTab">Positions</li>
            <li class="tablinks" data-tabid="employeesTab">Employees</li>
            <li class="tablinks" data-tabid="rolesTab">Roles</li>
            <li class="tablinks" data-tabid="usersTab">Users</li>
            <li class="tablinks" data-tabid="projectsTab">Projects</li>
            <li class="tablinks" data-tabid="assignmentsTab">Assignments</li>
            <li class="tablinks" data-tabid="attendancesTab">Attendances</li>
            <li class="tablinks" data-tabid="salariesTab">Salaries</li>
            <li class="tablinks" data-tabid="leavesTab">Leaves</li>
            <li class="tablinks" data-tabid="performanceTab">Performance Reviews</li>
        </ul>

        <!-- Tab contents -->
        <div class="tabcontent" id="departmentsTab">
            <div class="search-container">
                <input type="text" id="departments-search-input" placeholder="Tìm kiếm...">
                <button class="add-row-btn" data-tab="departmentsTab">Add Department</button>
                <button class="delete-selected-btn" data-tab="departmentsTab">Delete Selected</button>
                <span class="select-stats"></span>
            </div>
            <div id="departmentsTable"></div>
        </div>

        <div class="tabcontent" id="positionsTab">
            <div class="search-container">
                <input type="text" id="positions-search-input" placeholder="Tìm kiếm...">
                <button class="add-row-btn" data-tab="positionsTab">Add Position</button>
                <button class="delete-selected-btn" data-tab="positionsTab">Delete Selected</button>
                <span class="select-stats"></span>
            </div>
            <div id="positionsTable"></div>
        </div>

        <div class="tabcontent" id="employeesTab">
            <div class="search-container">
                <input type="text" id="employees-search-input" placeholder="Tìm kiếm...">
                <button class="add-row-btn" data-tab="employeesTab">Add Employee</button>
                <button class="delete-selected-btn" data-tab="employeesTab">Delete Selected</button>
                <span class="select-stats"></span>
            </div>
            <div id="employeesTable"></div>
        </div>

        <div class="tabcontent" id="rolesTab">
            <div class="search-container">
                <input type="text" id="roles-search-input" placeholder="Tìm kiếm...">
                <button class="add-row-btn" data-tab="rolesTab">Add Role</button>
                <button class="delete-selected-btn" data-tab="rolesTab">Delete Selected</button>
                <span class="select-stats"></span>
            </div>
            <div id="rolesTable"></div>
        </div>

        <div class="tabcontent" id="usersTab">
            <div class="search-container">
                <input type="text" id="users-search-input" placeholder="Tìm kiếm...">
                <button class="add-row-btn" data-tab="usersTab">Add User</button>
                <button class="delete-selected-btn" data-tab="usersTab">Delete Selected</button>
                <span class="select-stats"></span>
            </div>
            <div id="usersTable"></div>
        </div>

        <div class="tabcontent" id="projectsTab">
            <div class="search-container">
                <input type="text" id="projects-search-input" placeholder="Tìm kiếm...">
                <button class="add-row-btn" data-tab="projectsTab">Add Project</button>
                <button class="delete-selected-btn" data-tab="projectsTab">Delete Selected</button>
                <span class="select-stats"></span>
            </div>
            <div id="projectsTable"></div>
        </div>

        <div class="tabcontent" id="assignmentsTab">
            <div class="search-container">
                <input type="text" id="assignments-search-input" placeholder="Tìm kiếm...">
                <button class="add-row-btn" data-tab="assignmentsTab">Add Assignment</button>
                <button class="delete-selected-btn" data-tab="assignmentsTab">Delete Selected</button>
                <span class="select-stats"></span>
            </div>
            <div id="assignmentsTable"></div>
        </div>

        <div class="tabcontent" id="attendancesTab">
            <div class="search-container">
                <input type="text" id="attendances-search-input" placeholder="Tìm kiếm...">
                <button class="add-row-btn" data-tab="attendancesTab">Add Attendance</button>
                <button class="delete-selected-btn" data-tab="attendancesTab">Delete Selected</button>
                <span class="select-stats"></span>
            </div>
            <div id="attendancesTable"></div>
        </div>

        <div class="tabcontent" id="salariesTab">
            <div class="search-container">
                <input type="text" id="salaries-search-input" placeholder="Tìm kiếm...">
                <button class="add-row-btn" data-tab="salariesTab">Add Salary</button>
                <button class="delete-selected-btn" data-tab="salariesTab">Delete Selected</button>
                <span class="select-stats"></span>
            </div>
            <div id="salariesTable"></div>
        </div>

        <div class="tabcontent" id="leavesTab">
            <div class="search-container">
                <input type="text" id="leaves-search-input" placeholder="Tìm kiếm...">
                <button class="add-row-btn" data-tab="leavesTab">Add Leave</button>
                <button class="delete-selected-btn" data-tab="leavesTab">Delete Selected</button>
                <span class="select-stats"></span>
            </div>
            <div id="leavesTable"></div>
        </div>

        <div class="tabcontent" id="performanceTab">
            <div class="search-container">
                <input type="text" id="performance-search-input" placeholder="Tìm kiếm...">
                <button class="add-row-btn" data-tab="performanceTab">Add Review</button>
                <button class="delete-selected-btn" data-tab="performanceTab">Delete Selected</button>
                <span class="select-stats"></span>
            </div>
            <div id="performanceTable"></div>
        </div>
    </div>

    <script>
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        // Options for selects
        window.employeesOptions = {};
        window.rolesOptions = {};
        window.projectsOptions = {};
        window.departmentsOptions = {};
        window.positionsOptions = {};
        window.departmentOptions = {};


        window.loadOptions = async function () {
            const [empRes, roleRes, projRes, depRes, posRes] = await Promise.all([
                fetch('/dataTables/employees'),
                fetch('/dataTables/roles'),
                fetch('/dataTables/projects'),
                fetch('/dataTables/departments'),
                fetch('/dataTables/positions'),
            ]);
            const [empData, roleData, projData, depData, posData] = await Promise.all([
                empRes.json(), roleRes.json(), projRes.json(), depRes.json(), posRes.json()
            ]);

            empData.forEach(e => window.employeesOptions[e.id_employee] = e.name || e.full_name);
            roleData.forEach(r => window.rolesOptions[r.id_role] = r.name);
            projData.forEach(p => window.projectsOptions[p.id_project] = p.name);
            depData.forEach(d => window.departmentsOptions[d.id_department] = d.name);
            posData.forEach(p => window.positionsOptions[p.id_position] = p.name);
        };

        // Table storage
        const tables = {};
        const tableConfigs = {
            departmentsTab: {
                selector: "#departmentsTable",
                tableName: "departments",
                searchInput: "#departments-search-input",
                primaryKey: "id_department",
                columns: [
                    { title: "ID", field: "id_department", editor: false },
                    { title: "Name", field: "name", editor: "input" },
                    { title: "Description", field: "description", editor: "input" },
                ]
            },
            positionsTab: {
                selector: "#positionsTable",
                tableName: "positions",
                searchInput: "#positions-search-input",
                primaryKey: "id_position",
                columns: [
                    { title: "ID", field: "id_position", editor: false },
                    { title: "Name", field: "name", editor: "input" },
                    { title: "Description", field: "description", editor: "input" },
                ]
            },
            employeesTab: {
                selector: "#employeesTable",
                tableName: "employees",
                searchInput: "#employees-search-input",
                primaryKey: "id_employee",
                columns: [
                    { title: "ID", field: "id_employee", editor: false },
                    { title: "Full Name", field: "full_name", editor: "input" },
                    { title: "Email", field: "email", editor: "input" },
                    { title: "Phone", field: "phone", editor: "input" },
                    { title: "Department", field: "id_department", editor: "list", editorParams: { values: window.departmentsOptions }, formatter: "lookup", formatterParams: window.departmentsOptions },
                    { title: "Position", field: "id_position", editor: "list", editorParams: { values: window.positionsOptions }, formatter: "lookup", formatterParams: window.positionsOptions },
                    { title: "Active", field: "is_active", editor: "tickCross", formatter: "tickCross" }
                ]
            },
            rolesTab: {
                selector: "#rolesTable",
                tableName: "roles",
                searchInput: "#roles-search-input",
                primaryKey: "id_role",
                columns: [
                    { title: "ID", field: "id_role", editor: false },
                    { title: "Name", field: "name", editor: "input" },
                    { title: "Description", field: "description", editor: "input" }
                ]
            },
            usersTab: {
                selector: "#usersTable",
                tableName: "users",
                searchInput: "#users-search-input",
                primaryKey: "id_user",
                columns: [
                    { title: "ID", field: "id_user", editor: false },
                    { title: "Username", field: "username", editor: "input" },
                    { title: "Employee", field: "id_employee", editor: "list", editorParams: { values: window.employeesOptions }, formatter: "lookup", formatterParams: window.employeesOptions },
                    { title: "Role", field: "id_role", editor: "list", editorParams: { values: window.rolesOptions }, formatter: "lookup", formatterParams: window.rolesOptions },
                    { title: "Active", field: "is_active", editor: "tickCross", formatter: "tickCross" }
                ]
            },
            projectsTab: {
                selector: "#projectsTable",
                tableName: "projects",
                searchInput: "#projects-search-input",
                primaryKey: "id_project",
                columns: [
                    { title: "ID", field: "id_project", editor: false },
                    { title: "Name", field: "name", editor: "input" },
                    { title: "Description", field: "description", editor: "input" },
                    { title: "Date Begin", field: "date_begin", editor: "input" },
                    { title: "Date End", field: "date_end", editor: "input" },
                    { title: "Status", field: "status", editor: "list", editorParams: { values: { "Planning": "Planning", "Working": "Working", "Completed": "Completed" } }, formatter: "lookup", formatterParams: { "Planning": "Planning", "Working": "Working", "Completed": "Completed" } }
                ]
            },
            assignmentsTab: {
                selector: "#assignmentsTable",
                tableName: "assignments",
                searchInput: "#assignments-search-input",
                primaryKey: "id_assignment",
                columns: [
                    { title: "ID", field: "id_assignment", editor: false },
                    { title: "Employee", field: "id_employee", editor: "list", editorParams: { values: window.employeesOptions }, formatter: "lookup", formatterParams: window.employeesOptions },
                    { title: "Project", field: "id_project", editor: "list", editorParams: { values: window.projectsOptions }, formatter: "lookup", formatterParams: window.projectsOptions },
                    { title: "Role", field: "id_role", editor: "list", editorParams: { values: window.rolesOptions }, formatter: "lookup", formatterParams: window.rolesOptions },
                    { title: "Date Begin", field: "date_begin", editor: "input" },
                    { title: "Date End", field: "date_end", editor: "input" },
                    { title: "Primary", field: "is_primary", editor: "tickCross", formatter: "tickCross" }
                ]
            }
            // Có thể thêm Attendances, Salaries, Leaves, Performance Reviews theo mẫu giống Assignments/Employees
        };

        // Hàm tạo bảng khi mở tab
        async function createTable(tabid) {
            if (!tables[tabid] && tableConfigs[tabid]) {
                const config = tableConfigs[tabid];

                // Đợi options load xong
                await window.loadOptions();

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