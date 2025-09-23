class Contract {
    // --- Singleton instance ---
    static _instance = null;
    static _instanceTable = null;

    // HTML template (giữ nguyên)
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
            <button class="delete-selected-btn" data-tab="contractTab"><i class="fas fa-trash-alt"></i> Delete Expired (3+ months)</button>
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
    <div id="add-contract-modal" class="modal">
      <div class="modal-content"  style="margin: 10% auto">
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
                  <option value="1">Fixed term</option>
                  <option value="2">Indefinite</option>
                  <option value="3">Seasonal</option>
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

    // Tabulator config (sửa định dạng ngày và tiền tệ)
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
                        1: "Fixed term",
                        2: "Indefinite", 
                        3: "Seasonal"
                    }
                },
                formatter: "lookup",
                formatterParams: {
                    1: "Fixed term",
                    2: "Indefinite",
                    3: "Seasonal"
                }
            },
            {
                title: "Base Salary",
                field: "base_salary",
                editor: "number",
                editorParams: { step: 0.01, min: 0 },
                formatter: "money",
                formatterParams: {
                    symbol: "₫",
                    precision: 0,
                    thousand: ".",
                    decimal: ",",
                    symbolAfter: false
                }
            },
            {
                title: "Effective Date",
                field: "effective_date",
                editor: "date",
                formatter: Contract.formatDate,
                formatterParams: {
                    inputFormat: "YYYY-MM-DD",
                    outputFormat: "DD-MM-YYYY",
                    invalidPlaceholder: "(invalid date)"
                }
            },
            {
                title: "Expiry Date",
                field: "expiry_date",
                editor: "date",
                formatter: Contract.formatDate,
                formatterParams: {
                    inputFormat: "YYYY-MM-DD",
                    outputFormat: "DD-MM-YYYY",
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
                        "terminated": "Terminated"
                    }
                },
                formatter: function (cell) {
                    const value = cell.getValue();
                    let color = "";
                    let label = "";

                    switch (value) {
                        case "active":
                            color = "#00c853";
                            label = "Active";
                            break;
                        case "expired":
                            color = "#fbc02d";
                            label = "Expired";
                            break;
                        case "terminated":
                            color = "#d32f2f";
                            label = "Terminated";
                            break;
                        default:
                            color = "#9e9e9e";
                            label = value;
                    }

                    return `<span style="
                    display:inline-block;
                    padding:2px 8px;
                    border-radius:12px;
                    background:${color};
                    color:#fff;
                    font-size:12px;
                    font-weight:500;">
                        ${label}
                    </span>`;
                },
            },
            { title: "Description", field: "description", editor: "textarea" },
            {
                title: "Create At",
                field: "created_at",
                editor: false,
                formatter: Contract.formatDateTime
            },
            {
                title: "Update At",
                field: "updated_at",
                editor: false,
                formatter: Contract.formatDateTime
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

    // --- Format date thành dd-mm-yyyy ---
    static formatDate(cell) {
        const value = cell.getValue();
        if (!value) return "";
        
        try {
            const date = new Date(value);
            if (isNaN(date.getTime())) return "(invalid date)";
            
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            
            return `${day}-${month}-${year}`;
        } catch (error) {
            return "(invalid date)";
        }
    }

    // --- Format date time thành dd-mm-yyyy hh:mm ---
    static formatDateTime(cell) {
        const value = cell.getValue();
        if (!value) return "";
        
        try {
            const date = new Date(value);
            if (isNaN(date.getTime())) return "(invalid date)";
            
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            
            return `${day}-${month}-${year} ${hours}:${minutes}`;
        } catch (error) {
            return "(invalid date)";
        }
    }

    // --- Check if contract is expired for at least 3 months ---
    static isExpiredAtLeast3Months(expiryDate) {
        if (!expiryDate) return false;

        const expiry = new Date(expiryDate);
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        return expiry < threeMonthsAgo;
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
        submitBtn.addEventListener("click", async function () {
            // Basic validation
            const id_employee = document.getElementById("id_employee").value;
            const contract_type = document.getElementById("contract_type").value;
            const base_salary = document.getElementById("base_salary").value;
            const effective_date = document.getElementById("effective_date").value;
            const expiry_date = document.getElementById("expiry_date").value;

            if (!id_employee || !contract_type || !base_salary || !effective_date) {
                alert("Please fill in all required fields (marked with *)");
                return;
            }

            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

            // Validate employee exists
            try {
                const resEmployee = await fetch(`/modelController/employees/${id_employee}`, {
                    headers: { "X-CSRF-TOKEN": csrfToken }
                });

                if (!resEmployee.ok) {
                    alert("Employee does not exist!");
                    return;
                }
                const employeeData = await resEmployee.json();

                // Check if employee already has an active contract
                const resCheck = await fetch(`/modelController/contracts/${id_employee}/activeCheck`, {
                    headers: { "X-CSRF-TOKEN": csrfToken }
                });

                if (!resCheck.ok) throw new Error("Could not check active contract");

                const dataCheck = await resCheck.json();
                if (dataCheck.hasActive) {
                    alert(`Employee: ${employeeData.id_employee}\n${employeeData.name}\nCurrent Contract: ${dataCheck.data.id_contract}`);
                    return;
                }

                // Validate base salary
                if (base_salary < 0) {
                    alert("Base salary cannot be negative");
                    return;
                }

                // Validate dates
                if (expiry_date && new Date(expiry_date) <= new Date(effective_date)) {
                    alert("Expiry date must be after effective date");
                    return;
                }

                // Prepare data for submission
                const formData = new FormData(contractForm);
                const data = Object.fromEntries(formData.entries());
                data.status = "active"; // Set default status

                // Submit the form
                const res = await fetch(`/modelController/${Contract._cfgTable.tableName}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": csrfToken
                    },
                    body: JSON.stringify(data)
                });

                const result = await res.json();

                if (res.ok) {
                    alert("Contract added successfully!");
                    // Add row to Tabulator
                    Contract._instanceTable.addRow(result, true);
                    closeModal();
                } else {
                    // Server validation error
                    alert("Error: " + (result.message || "Invalid input"));
                }
            } catch (err) {
                console.error(err);
                alert("Network or server error");
            }
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

        // Setup delete button functionality
        this.setupDeleteButton();

        // Cell edit validation - only for editable fields
        Contract._instanceTable.on("cellEditing", (cell) => {
            const columnDef = cell.getColumn().getDefinition();

            // Chỉ cho phép sửa các cột có editor khác false
            if (!columnDef.editor || columnDef.editor === false) {
                return false; // Prevent editing for non-editable columns
            }

            return true; // Allow editing for editable columns
        });

        Contract._instanceTable.on("cellEdited", async cell => {
            const newValue = cell.getValue();
            const oldValue = cell.getOldValue();

            // Don't update if value hasn't changed or is empty
            if (newValue === null || newValue === "" || newValue === oldValue) {
                cell.setValue(oldValue, false);
                return;
            }

            try {
                const rowData = cell.getRow().getData();
                const field = cell.getField();
                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

                // Update status if expired
                if (rowData.expiry_date && rowData.status === "active") {
                    const expiryDate = new Date(rowData.expiry_date);
                    const currentDate = new Date();
                    if (expiryDate < currentDate) {
                        cell.getRow().getCell("status").setValue("expired", true);
                    }
                }

                // Prepare data for update
                const payload = { [field]: newValue };

                const resPut = await fetch(`/modelController/contracts/${rowData.id_contract}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": csrfToken
                    },
                    body: JSON.stringify(payload)
                });

                const mess = await resPut.json(); //đọc trong try
                if (!resPut.ok) 
                { 
                    cell.setValue(oldValue, false);
                    alert(mess.message);
                    return;
                }

               
                console.log("Update successful");
            } catch (err) {
                const report = err.json();
                console.error(err);
                cell.setValue(oldValue, false);
                alert(report.message);
            }
        });
    }

    // --- Setup delete button functionality ---
    setupDeleteButton() {
        const deleteBtn = document.querySelector(".delete-selected-btn");
        if (deleteBtn) {
            deleteBtn.addEventListener("click", async () => {
                const selectedRows = Contract._instanceTable.getSelectedRows();
                if (selectedRows.length === 0) {
                    alert("Please select at least one contract to delete.");
                    return;
                }

                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
                let deletedCount = 0;
                let failedCount = 0;
                const failedMessages = [];

                try {
                    // Kiểm tra và xóa từng hợp đồng đã chọn
                    for (const row of selectedRows) {
                        const contractData = row.getData();
                        const contractId = contractData.id_contract;

                        // Kiểm tra xem hợp đồng có hết hạn quá 3 tháng không
                        if (!contractData.expiry_date || !Contract.isExpiredAtLeast3Months(contractData.expiry_date)) {
                            failedCount++;
                            failedMessages.push(`Contract ${contractId}: Not expired for at least 3 months`);
                            continue;
                        }

                        // Kiểm tra xem hợp đồng có đang được sử dụng ở bảng khác không
                        const checkUsageRes = await fetch(`/modelController/contracts/${contractId}/checkUsage`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "X-CSRF-TOKEN": csrfToken
                            }
                        });

                        const usageResult = await checkUsageRes.json();

                        if (usageResult.isUsed) {
                            failedCount++;
                            failedMessages.push(`Contract ${contractId}: Is being used in ${usageResult.usageLocation}`);
                            continue;
                        }

                        // Gọi API để xóa hợp đồng
                        const res = await fetch(`/modelController/contracts/${contractId}`, {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                                "X-CSRF-TOKEN": csrfToken
                            }
                        });

                        const result = await res.json();

                        if (res.ok && result.success) {
                            // Xóa khỏi table nếu thành công
                            row.delete();
                            deletedCount++;
                        } else {
                            failedCount++;
                            failedMessages.push(`Contract ${contractId}: ${result.message || "Delete failed"}`);
                        }
                    }

                    // Hiển thị kết quả
                    let message = `Deleted ${deletedCount} contract(s) successfully.`;

                    if (failedCount > 0) {
                        message += `\nFailed to delete ${failedCount} contract(s):\n${failedMessages.join('\n')}`;
                    }

                    alert(message);

                } catch (err) {
                    console.error(err);
                    alert("Error deleting contracts: " + err.message);
                }
            });
        }
    }

    // --- Render table into container ---
    render(container) {
        container.innerHTML = this.getHTML();

        if (!Contract._instanceTable) {
            this.createTable();
        } else {
            // Reattach table to the new div
            const tableDiv = container.querySelector(Contract._cfgTable.selector);
            if (tableDiv && Contract._instanceTable.element) {
                tableDiv.appendChild(Contract._instanceTable.element);
            }
        }

        // Setup filters and search
        this.setupFilters();

        // Setup modal
        this.setupModal();
    }
}