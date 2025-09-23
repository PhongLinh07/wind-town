// Employee_Bank_Information.js
class Employee_Bank_Information {
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
              <option value="name">Name</option>
              <option value="bank_infor">Bank Information</option>
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
            <input type="text" id="employee-bank-search-input" placeholder="Search employees...">
          </div>
          
          <div class="filter-block">
            <button class="add-row-btn" id="open-modal-btn"><i class="fas fa-plus-circle"></i> Add</button>
          </div>
          
          <div class="filter-block">
            <button class="delete-selected-btn" data-tab="employeeBankTab"><i class="fas fa-trash-alt"></i> Delete</button>
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
    <div id="add-employee-bank-modal" class="modal">
      <div class="modal-content"  style="margin: 10% auto">
        <div class="modal-header">
          <h2><i class="fas fa-university"></i> Add Employee Bank Information</h2>
          <span class="close">&times;</span>
        </div>
        <div class="modal-body">
          <form id="employee-bank-form">
            <div class="form-row">
              <div class="form-group">
                <label for="id_employee">ID Employee *</label>
                <input type="text" id="id_employee" name="id_employee" required>
              </div>
              <div class="form-group">
                <label for="bank_infor">Bank Information *</label>
                <input type="text" id="bank_infor" name="bank_infor" placeholder="Bank name, account number, etc." required>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" id="cancel-btn"><i class="fas fa-times"></i> Cancel</button>
          <button class="btn-submit" id="submit-btn"><i class="fas fa-check"></i> Add Bank Information</button>
        </div>
      </div>
    </div>
  `;

    // Tabulator config
    static _cfgTable = {
        selector: "#tabulator-table",
        tableName: "employees",
        searchInput: "#employee-bank-search-input",
        primaryKey: "id_employee",
        columns: [
            { title: "ID Employee", field: "id_employee", editor: false },
            { title: "Name", field: "name", editor: false },
            {
                title: "Bank Information",
                field: "bank_infor",
                editor: "input",
                formatter: function (cell) {
                    const value = cell.getValue();
                    return value && value.length > 50 ? value.substring(0, 50) + '...' : value;
                }
            },
            {
                title: "Actions",
                formatter: function (cell, formatterParams, onRendered) {
                    return "<button class='view-bank-btn' title='View full bank information'><i class='fas fa-eye'></i></button>";
                },
                headerSort: false,
                cellClick: function (e, cell) {
                    if (e.target.closest('.view-bank-btn')) {
                        const rowData = cell.getRow().getData();
                        alert(`Full Bank Information:\n${rowData.bank_infor}`);
                    }
                }
            }
        ]
    };

    // --- Singleton getInstance ---
    static getInstance() {
        if (!Employee_Bank_Information._instance) {
            Employee_Bank_Information._instance = new Employee_Bank_Information();
        }
        return Employee_Bank_Information._instance;
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
        return Employee_Bank_Information._html;
    }

    // --- Setup filters ---
    setupFilters() {
        const table = Employee_Bank_Information._instanceTable;
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
        const searchInput = document.getElementById(Employee_Bank_Information._cfgTable.searchInput);
        if (searchInput) {
            searchInput.addEventListener("keyup", e => {
                table.setFilter([
                    { field: "name", type: "like", value: e.target.value },
                    { field: "bank_infor", type: "like", value: e.target.value },
                    { field: "status", type: "like", value: e.target.value }
                ]);
            });
        }
    }

    // --- Setup modal functionality ---
    setupModal() {
        const modal = document.getElementById("add-employee-bank-modal");
        const openModalBtn = document.getElementById("open-modal-btn");
        const closeModalBtn = document.querySelector(".close");
        const cancelBtn = document.getElementById("cancel-btn");
        const submitBtn = document.getElementById("submit-btn");
        const employeeBankForm = document.getElementById("employee-bank-form");

        // Open modal
        openModalBtn.addEventListener("click", function () {
            modal.style.display = "block";
        });

        // Close modal
        const closeModal = () => {
            modal.style.display = "none";
            employeeBankForm.reset();
        };

        closeModalBtn.addEventListener("click", closeModal);
        cancelBtn.addEventListener("click", closeModal);

        // Form submission
        submitBtn.addEventListener("click", async function () {
            //comming--------
        });
    }

    // --- Create Tabulator table ---
    createTable() {
        if (Employee_Bank_Information._instanceTable) return;

        const cfg = Employee_Bank_Information._cfgTable;
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

        Employee_Bank_Information._instanceTable = new Tabulator(cfg.selector, {
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
        Employee_Bank_Information._instanceTable.on("rowSelectionChanged", data => {
            const stats = document.querySelector(".select-stats");
            if (stats) stats.innerHTML = `<i class="fas fa-check-circle"></i> Selected: ${data.length}`;
        });

        // Cell edit validation
        Employee_Bank_Information._instanceTable.on("cellEdited", async cell => {
            const newValue = cell.getValue();
            const oldValue = cell.getOldValue();
            if (!newValue || newValue === oldValue) {
                cell.setValue(oldValue, true);
                return;
            }
            try 
            {

                const rowData = cell.getRow().getData();
                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                const resPut = await fetch(`/modelController/${Employee_Bank_Information._cfgTable.tableName}/${rowData.id_employee}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrfToken },
                        body: JSON.stringify({ bank_infor: cell.getValue() }),
                    });

                if (!resPut.ok) { alert("Banking update fields."); cell.setValue(oldValue, true); return; }
                
                // nếu server trả JSON (optional)
                const result = await resPut.json();
                console.log("Update success:", result);

            }
            catch (err) 
            {
                console.error(err);
                cell.setValue(oldValue, true);
            }
        });
    }

    // --- Render table vào container ---
    render(container) {
        container.innerHTML = this.getHTML();

        if (!Employee_Bank_Information._instanceTable) {
            this.createTable();
        } else {
            // Reattach bảng vào div mới
            const tableDiv = container.querySelector(Employee_Bank_Information._cfgTable.selector);
            tableDiv.appendChild(Employee_Bank_Information._instanceTable.element);
        }

        // Setup filters và search
        this.setupFilters();

        // Thiết lập modal
        this.setupModal();
    }
}