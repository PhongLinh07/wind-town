// Leave.js // bản này ko thể sửa vì do máy chấm côbng đưa về 
class Leave {
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
              <option value="approved_by">ID Approved</option>
              <option value="start_date">Start Date</option>
              <option value="end_date">End Date</option>
              <option value="type">Type</option>
              <option value="reason">Reason</option>
              <option value="status">Status</option>
              <option value="description">Description</option>
              <option value="created_at">Create At</option>
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
            <input type="text" id="leave-search-input" placeholder="Search leave records...">
          </div>
          
          <div class="filter-block">
            <button class="add-row-btn" id="open-modal-btn"><i class="fas fa-plus-circle"></i> Add</button>
          </div>
          
          <div class="filter-block">
            <button class="delete-selected-btn" data-tab="leaveTab"><i class="fas fa-trash-alt"></i> Delete</button>
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

    <!-- Modal Form -->
    <form id="add-leave-modal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2><i class="fas fa-calendar-times"></i> Add New Leave Request</h2>
          <span class="close">&times;</span>
        </div>
        <div class="modal-body">
          <form id="leave-form">
            <div class="form-row">
              <div class="form-group">
                <label for="id_employee">Employee ID *</label>
                <input type="number" id="id_employee" name="id_employee" required>
              </div>
              <div class="form-group">
                <label for="approved_by">Approved By ID</label>
                <input type="number" id="approved_by" name="approved_by">
              </div>
              <div class="form-group">
                <label for="type">Leave Type *</label>
                <select id="type" name="type" required>
                  <option value="">Select Type</option>
                  <option value="Sick leave">Sick leave</option>
                  <option value="Maternity">Maternity</option>
                  <option value="Family leave">Family leave</option>
                  <option value="Paid leave">Paid leave</option>
                  <option value="Personal leave">Personal leave</option>
                  <option value="Work assignment">Work assignment</option>
                </select>
              </div>
            </div>

            
  `;

    // Tabulator config
    static _cfgTable = {
        selector: "#tabulator-table",
        tableName: "leaves",
        searchInput: "leave-search-input",
        primaryKey: "id_leave",
        columns: [
            { title: "Employee ID", field: "id_employee", editor: false },
            { title: "Approved By", field: "approved_by", editor: false },
            {
                title: "Start Date",
                field: "start_date",
                editor: false,
                formatter: Leave.formatDate,
                formatterParams: {
                    outputFormat: "YYYY-MM-DD",
                    invalidPlaceholder: "(invalid date)"
                }
            },
            {
                title: "End Date",
                field: "end_date",
                editor: false,
                formatter: Leave.formatDate,
                formatterParams: {
                    outputFormat: "YYYY-MM-DD",
                    invalidPlaceholder: "(invalid date)"
                }
            },
            {
                title: "Type",
                field: "type",
                editor: false
            },
            { title: "Reason", field: "reason", editor: false },
            {
                title: "Status",
                field: "status",
                editor: false,
                formatter: "lookup",
                formatterParams: {
                    "pending": "⏳ Pending",
                    "approved": "✅ Approved",
                    "rejected": "❌ Rejected",
                    "cancelled": "🚫 Cancelled"
                },
                cellStyled: function (cell) {
                    const value = cell.getValue();
                    switch (value) {
                        case "pending":
                            cell.getElement().style.color = "orange";
                            break;
                        case "approved":
                            cell.getElement().style.color = "green";
                            break;
                        case "rejected":
                            cell.getElement().style.color = "gray";
                            break;
                        case "cancelled":
                            cell.getElement().style.color = "red";
                            break;
                    }
                }
            },
            { title: "Description", field: "description", editor: "textarea" },
            {
                title: "Create At",
                field: "created_at",
                editor: false,
                formatter: Leave.formatDate
            }
        ]
    };

    // --- Singleton getInstance ---
    static getInstance() {
        if (!Leave._instance) {
            Leave._instance = new Leave();
        }
        return Leave._instance;
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
        return Leave._html;
    }

    // --- Setup filters ---
    setupFilters() {
        const table = Leave._instanceTable;
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
        const searchInput = document.getElementById(Leave._cfgTable.searchInput);
        if (searchInput) {
            searchInput.addEventListener("keyup", e => {
                table.setFilter([
                    { field: "id_employee", type: "like", value: e.target.value },
                    { field: "type", type: "like", value: e.target.value },
                    { field: "reason", type: "like", value: e.target.value },
                    { field: "status", type: "like", value: e.target.value },
                    { field: "description", type: "like", value: e.target.value }
                ]);
            });
        }
    }

    // --- Setup modal functionality ---
    setupModal() { }


    // --- Create Tabulator table ---
    createTable() {
        if (Leave._instanceTable) return;

        const cfg = Leave._cfgTable;
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

        Leave._instanceTable = new Tabulator(cfg.selector, {
            ajaxURL: `/modelController/${cfg.tableName}`,
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
        Leave._instanceTable.on("rowSelectionChanged", data => {
            const stats = document.querySelector(".select-stats");
            if (stats) stats.innerHTML = `<i class="fas fa-check-circle"></i> Selected: ${data.length}`;
        });

        // Cell edit validation
        Leave._instanceTable.on("cellEdited", async cell => {
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
                const url = `/modelController/${Leave._cfgTable.tableName}/${rowData.id_leave}`;

                // Dữ liệu gửi lên
                const payload = { [field]: newValue };

                const resPut = await fetch(url, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrfToken },
                    body: JSON.stringify(payload)
                });

                if (!resPut.ok) {
                    alert("Leave update failed.");
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

        if (!Leave._instanceTable) {
            this.createTable();
        } else {
            // Reattach bảng vào div mới
            const tableDiv = container.querySelector(Leave._cfgTable.selector);
            tableDiv.appendChild(Leave._instanceTable.element);
        }

        // Setup filters và search
        this.setupFilters();

        // Thiết lập modal
        this.setupModal();
    }
}