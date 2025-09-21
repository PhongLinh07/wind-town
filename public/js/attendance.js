// Attendance.js// bảng này ko thể sửa vì do máy chấm côbng đưa về 
class Attendance {
    // --- Singleton instance ---
    static _instance = null;
    static _instanceTable = null;

    // HTML template
    static _html = `
    <div class="main-container">
      <div class="filter-container">
        <div class="filter-left">
          <div class="filter-block">
            <h3><i class="fas fa-filter"></i> Field:</h3>
            <select class="input-field" id="filter-field">
              <option></option>
              <option value="id_employee">ID Employee</option>
              <option value="of_date">Date</option>
              <option value="office_hours">Office Hours</option>
              <option value="over_time">Overtime</option>
              <option value="late_time">Late Time</option>
              <option value="is_night_shift">Night Shift</option>
              <option value="description">Description</option>
            </select>
          </div>

          <div class="filter-block">
            <h3><i class="fas fa-code"></i> Type:</h3>
            <select class="input-field" id="filter-type">
              <option value="=">=</option>
              <option value="<"><</option>
              <option value="<="><=</option>
              <option value=">">></option>
              <option value=">=">>=</option>
              <option value="!=">!=</option>
              <option value="like">like</option>
            </select>
          </div>

          <div class="filter-block">
            <h3><i class="fas fa-search"></i> Value:</h3>
            <input class="input-field" id="filter-value" type="text" placeholder="Value to filter">
          </div>

          <div class="filter-block">
            <button id="filter-clear"><i class="fas fa-broom"></i> Clear</button>
          </div>
        </div>

        <div class="filter-right">
          <div class="filter-block">
            <input type="text" id="attendance-search-input" placeholder="Search attendance records...">
          </div>
          
          <div class="filter-block">
            <button class="add-row-btn" id="open-modal-btn"><i class="fas fa-plus-circle"></i> Add</button>
          </div>
          
          <div class="filter-block">
            <button class="delete-selected-btn" data-tab="attendanceTab"><i class="fas fa-trash-alt"></i> Delete</button>
          </div>
          
          <div class="filter-block">
            <span class="select-stats"><i class="fas fa-check-circle"></i> Selected: 0</span>
          </div>
        </div>
      </div>

      <div class="table-container">
        <div id="tabulator-table"></div>
      </div>
    </div>

  `;

    // Tabulator config
    static _cfgTable = {
        selector: "#tabulator-table",
        tableName: "attendances",
        searchInput: "attendance-search-input",
        primaryKey: "id_attendance",
        columns: [
            { title: "Employee ID", field: "id_employee", editor: false },
            {
                title: "Date",
                field: "of_date",
                editor: false,
            },
            {
                title: "Office Hours",
                field: "office_hours",
                editor: false,
            },
            {
                title: "Overtime",
                field: "over_time",
                editor: false,
                editorParams: { step: 0.5, min: 0 },
                formatter: function (cell) {
                    const value = cell.getValue();
                    return value ? value + "h" : "";
                }
            },
            {
                title: "Late Time",
                field: "late_time",
                editor: false,
                editorParams: { min: 0 },
                formatter: function (cell) {
                    const value = cell.getValue();
                    return value ? value + "m" : "";
                }
            },
            {
                title: "Night Shift",
                field: "is_night_shift",
                editor: false,
                formatter: "tickCross",
            },
            { title: "Description", field: "description", editor: "textarea" },
        ]
    };

    // --- Singleton getInstance ---
    static getInstance() {
        if (!Attendance._instance) {
            Attendance._instance = new Attendance();
        }
        return Attendance._instance;
    }

    // --- Format date ---
    static formatDate(cell) {
        const value = cell.getValue();
        if (!value) return "";
        const date = new Date(value);
        return date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
    }

    // --- Return HTML ---
    getHTML() {
        return Attendance._html;
    }

    // --- Setup filters ---
    setupFilters() {
        const table = Attendance._instanceTable;
        if (!table) return;

        const fieldEl = document.getElementById("filter-field");
        const typeEl = document.getElementById("filter-type");
        const valueEl = document.getElementById("filter-value");

        const updateFilter = () => {
            const filterVal = fieldEl.value;
            const typeVal = typeEl.value;
            if (!filterVal) {
                table.clearFilter();
                return;
            }
            table.setFilter(filterVal, typeVal, valueEl.value);
        };

        fieldEl.addEventListener("change", updateFilter);
        typeEl.addEventListener("change", updateFilter);
        valueEl.addEventListener("keyup", updateFilter);

        document.getElementById("filter-clear").addEventListener("click", () => {
            fieldEl.value = "";
            typeEl.value = "=";
            valueEl.value = "";
            table.clearFilter();
        });

        // Search filter
        const searchInput = document.getElementById(Attendance._cfgTable.searchInput);
        if (searchInput) {
            searchInput.addEventListener("keyup", e => {
                table.setFilter([
                    { field: "id_employee", type: "like", value: e.target.value },
                    { field: "description", type: "like", value: e.target.value }
                ]);
            });
        }
    }

    // --- Setup modal functionality ---
    setupModal() { }

    // --- Create Tabulator table ---
    createTable() {
        if (Attendance._instanceTable) return;

        const cfg = Attendance._cfgTable;
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

        Attendance._instanceTable = new Tabulator(cfg.selector, {
            ajaxURL: `/modelController/${cfg.tableName}`,
            layout: "fitColumns",
            pagination: "local",
            paginationSize: 10,
            paginationSizeSelector: [10, 20, 30, 50],
            movableColumns: true,
            paginationCounter: "pages",
            paginationButtonCount: 0,
            index: cfg.primaryKey,
            columns: cfg.columns,
            rowHeader: {
                headerSort: false,
                width: 30,
                headerHozAlign: "center",
                hozAlign: "center",
                formatter: "rowSelection",
                titleFormatter: "rowSelection"
            },
            ajaxConfig: {
                method: "GET",
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                }
            }
        });

        // Row selection stats
        Attendance._instanceTable.on("rowSelectionChanged", data => {
            const stats = document.querySelector(".select-stats");
            if (stats) stats.innerHTML = `<i class="fas fa-check-circle"></i> Selected: ${data.length}`;
        });

        // Cell edit validation
        Attendance._instanceTable.on("cellEdited", async cell => {
            const newValue = cell.getValue();
            const oldValue = cell.getOldValue();

            // Chỉ rollback khi newValue là null hoặc rỗng string
            if (newValue === null || newValue === "" || newValue === oldValue) {
                cell.setValue(oldValue, true);
                return;
            }

            try {
                const rowData = cell.getRow().getData();
                const field = cell.getField();
                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                
                // URL PUT chuẩn nested resource
                const url = `/modelController/${Attendance._cfgTable.tableName}/${rowData.id_attendance}`;

                // Dữ liệu gửi lên
                const payload = { [field]: newValue};

                const resPut = await fetch(url, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrfToken },
                    body: JSON.stringify(payload)
                });

                if (!resPut.ok) {
                    alert("Attendan update failed.");
                    cell.setValue(cell.getOldValue(), true);
                    return;
                }

                if (resPut.headers.get("content-type")?.includes("application/json")) {
                    const result = await resPut.json();
                    console.log("Update success:", result);
                } else {
                    console.log("Update success (no content).");
                }

            } catch (err) {
                console.error(err);
                cell.setValue(cell.getOldValue(), true);
            }

        });
    }

    // --- Render table vào container ---
    render(container) {
        container.innerHTML = this.getHTML();

        if (!Attendance._instanceTable) {
            this.createTable();
        } else {
            // Reattach bảng vào div mới
            const tableDiv = container.querySelector(Attendance._cfgTable.selector);
            tableDiv.appendChild(Attendance._instanceTable.element);
        }

        // Setup filters và search
        this.setupFilters();

        // Thiết lập modal
        this.setupModal();
    }
}