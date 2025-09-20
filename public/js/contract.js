// Contract.js
class Contract {
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
              <option value="id_contract">ID</option>
              <option value="id_employee">ID Employee</option>
              <option value="contract_type">Contract Type</option>
              <option value="base_salary">Base Salary</option>
              <option value="effective_date">Effective Date</option>
              <option value="expiry_date">Expiry Date</option>
              <option value="status">Status</option>
              <option value="description">Description</option>
              <option value="created_at">Create At</option>
              <option value="updated_at">Update At</option>
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
            <input type="text" id="contract-search-input" placeholder="Search contracts...">
          </div>
          
          <div class="filter-block">
            <button class="add-row-btn" id="open-modal-btn"><i class="fas fa-plus-circle"></i> Add</button>
          </div>
          
          <div class="filter-block">
            <button class="delete-selected-btn" data-tab="contractTab"><i class="fas fa-trash-alt"></i> Delete</button>
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
    <div id="add-contract-modal" class="modal" style="margin: 20% auto">
      <div class="modal-content">
        <div class="modal-header">
          <h2><i class="fas fa-file-contract"></i> Add New Contract</h2>
          <span class="close">&times;</span>
        </div>
        <div class="modal-body">
          <form id="contract-form">
            <div class="form-row">
              <div class="form-group">
                <label for="id_employee">Employee ID *</label>
                <input type="number" id="id_employee" name="id_employee" required>
              </div>
              <div class="form-group">
                <label for="contract_type">Contract Type *</label>
                <select id="contract_type" name="contract_type" required>
                  <option value="">---Select---</option>
                  <option value="fixed_term">Fixed term</option>
                  <option value="indefinite">Indefinite</option>
                  <option value="seasonal">Seasonal</option>

                </select>
              </div>
              <div class="form-group">
                <label for="base_salary">Base Salary *</label>
                <input type="number" id="base_salary" name="base_salary" step="0.01" min="0" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="effective_date">Effective Date *</label>
                <input type="date" id="effective_date" name="effective_date" required>
              </div>
              <div class="form-group">
                <label for="expiry_date">Expiry Date</label>
                <input type="date" id="expiry_date" name="expiry_date">
              </div>
              <div class="form-group">
                <label for="status">Status *</label>
                <select id="status" name="status" required>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group-full">
                <label for="description">Description</label>
                <textarea id="description" name="description" placeholder="Contract description"></textarea>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" id="cancel-btn"><i class="fas fa-times"></i> Cancel</button>
          <button class="btn-submit" id="submit-btn"><i class="fas fa-check"></i> Add Contract</button>
        </div>
      </div>
    </div>
  `;

    // Tabulator config
    static _cfgTable = {
        selector: "#tabulator-table",
        tableName: "contracts",
        searchInput: "#contract-search-input",
        primaryKey: "id_contract",
        columns: [
            { title: "ID Contract", field: "id_contract", editor: false },
            { title: "ID Employee", field: "id_employee", editor: false },
            {
                title: "Contract Type",
                field: "contract_type",
                editor: "list",
                editorParams: {
                    values: {
                        "Fixed term": "Fixed term", // cố định
                        "Indefinite": "Indefinite", // ko xác định
                        "Seasonal": "Seasonal" //thời vụ
                    }
                }
            },
            {
                title: "Base Salary",
                field: "base_salary",
                editor: "number",
                editorParams: { step: 0.01, min: 0 },
                formatter: "money",
                formatterParams: {
                    symbol: "$",
                    precision: 2,
                    thousand: ",",
                    decimal: "."
                }
            },
            {
                title: "Effective Date",
                field: "effective_date",
                editor: "date",
                formatter: Contract.formatDate,
                formatterParams: {
                    outputFormat: "YYYY-MM-DD",
                    invalidPlaceholder: "(invalid date)"
                }
            },
            {
                title: "Expiry Date",
                field: "expiry_date",
                editor: "date",
                formatter: Contract.formatDate,
                formatterParams: {
                    outputFormat: "YYYY-MM-DD",
                    invalidPlaceholder: "(invalid date)"
                }
            },
            {
                title: "Status",
                field: "status",
                editor: "list",
                editorParams: {
                    values: {
                        "active": "Active",
                        "expired": "Expired",
                        "terminated": "Terminated"
                    }
                }
            },
            { title: "Description", field: "description", editor: "textarea" },
            {
                title: "Create At",
                field: "created_at",
                editor: false,
                formatter: Contract.formatDate
            },
            {
                title: "Update At",
                field: "updated_at",
                editor: false,
                formatter: Contract.formatDate
            }
        ]
    };

    // --- Singleton getInstance ---
    static getInstance() {
        if (!Contract._instance) {
            Contract._instance = new Contract();
        }
        return Contract._instance;
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
        return Contract._html;
    }

    // --- Setup filters ---
    setupFilters() {
        const table = Contract._instanceTable;
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
        const searchInput = document.getElementById(Contract._cfgTable.searchInput);
        if (searchInput) {
            searchInput.addEventListener("keyup", e => {
                table.setFilter([
                    { field: "id_employee", type: "like", value: e.target.value },
                    { field: "contract_type", type: "like", value: e.target.value },
                    { field: "status", type: "like", value: e.target.value },
                    { field: "description", type: "like", value: e.target.value }
                ]);
            });
        }
    }

    // --- Setup modal functionality ---
    setupModal() {
        const modal = document.getElementById("add-contract-modal");
        const openModalBtn = document.getElementById("open-modal-btn");
        const closeModalBtn = document.querySelector(".close");
        const cancelBtn = document.getElementById("cancel-btn");
        const submitBtn = document.getElementById("submit-btn");
        const contractForm = document.getElementById("contract-form");

        // Open modal
        openModalBtn.addEventListener("click", function () {
            modal.style.display = "block";
        });

        // Close modal
        const closeModal = () => {
            modal.style.display = "none";
            contractForm.reset();
        };

        closeModalBtn.addEventListener("click", closeModal);
        cancelBtn.addEventListener("click", closeModal);

        // Form submission
        submitBtn.addEventListener("click", function () {
            // Basic validation
            const id_employee = document.getElementById("id_employee").value;
            const contract_type = document.getElementById("contract_type").value;
            const base_salary = document.getElementById("base_salary").value;
            const effective_date = document.getElementById("effective_date").value;
            const status = document.getElementById("status").value;

            if (!id_employee || !contract_type || !base_salary || !effective_date || !status) {
                alert("Please fill in all required fields (marked with *)");
                return;
            }

            // Validate base salary
            if (base_salary < 0) {
                alert("Base salary cannot be negative");
                return;
            }

            // Validate expiry date if provided
            const expiry_date = document.getElementById("expiry_date").value;
            if (expiry_date && new Date(expiry_date) <= new Date(effective_date)) {
                alert("Expiry date must be after effective date");
                return;
            }

            // Here you would typically send the data to your server
            const formData = new FormData(contractForm);
            const data = Object.fromEntries(formData.entries());

            console.log("New contract data:", data);
            alert("Contract added successfully! (This would connect to your backend in a real application)");

            // In a real application, you would add the row to the table here
            // Contract._instanceTable.addRow(data, true);

            closeModal();
        });
    }

    // --- Create Tabulator table ---
    createTable() {
        if (Contract._instanceTable) return;

        const cfg = Contract._cfgTable;
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

        Contract._instanceTable = new Tabulator(cfg.selector, {
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
        Contract._instanceTable.on("rowSelectionChanged", data => {
            const stats = document.querySelector(".select-stats");
            if (stats) stats.innerHTML = `<i class="fas fa-check-circle"></i> Selected: ${data.length}`;
        });

        // Cell edit validation
        Contract._instanceTable.on("cellEdited", async cell => {
            const newValue = cell.getValue();
            const oldValue = cell.getOldValue();
            if (!newValue || newValue === oldValue) {
                cell.setValue(oldValue, true);
                return;
            }
            try {

                const rowData = cell.getRow().getData();
                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                const resPut = await fetch(`/modelController/employees/${rowData.id_employee}/contracts/${rowData.id_contract}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrfToken },
                        body: JSON.stringify(rowData),
                    });

                if (!resPut.ok) { alert("Contract update fields."); cell.setValue(oldValue, true); return; }

                // nếu server trả JSON (optional)
                const result = await resPut.json();
                console.log("Update success:", result);

            }
            catch (err) {
                console.error(err);
                cell.setValue(oldValue, true);
            }
        });
    }

    // --- Render table vào container ---
    render(container) {
        container.innerHTML = this.getHTML();

        if (!Contract._instanceTable) {
            this.createTable();
        } else {
            // Reattach bảng vào div mới
            const tableDiv = container.querySelector(Contract._cfgTable.selector);
            tableDiv.appendChild(Contract._instanceTable.element);
        }

        // Setup filters và search
        this.setupFilters();

        // Thiết lập modal
        this.setupModal();
    }
}