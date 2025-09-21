// Payroll_Rule.js
class Payroll_Rule {
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
              <option value="type">Type</option>
              <option value="value_type">Value Type</option>
              <option value="value">Value</option>
              <option value="effective_date">Effective Date</option>
              <option value="expiry_date">Expiry Date</option>
              <option value="description">Description</option>
              <option value="created_at">Created At</option>
              <option value="updated_at">Updated At</option>
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
            <input type="text" id="payroll-rule-search-input" placeholder="Search payroll rules...">
          </div>
          
          <div class="filter-block">
            <button class="add-row-btn" id="open-modal-btn"><i class="fas fa-plus-circle"></i> Add</button>
          </div>
          
          <div class="filter-block">
            <button class="delete-selected-btn" id="delete-selected-btn" data-tab="payrollRuleTab"><i class="fas fa-trash-alt"></i> Delete</button>
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
    <div id="add-payroll-rule-modal" class="modal" >
      <div class="modal-content" style="margin: 10% auto">
        <div class="modal-header">
          <h2><i class="fas fa-money-bill-wave"></i> Add New Payroll Rule</h2>
          <span class="close">&times;</span>
        </div>
        <div class="modal-body">
          <form id="payroll-rule-form">
            <div class="form-row">
              <div class="form-group">
                <label for="type">Type *</label>
                <input type="text" id="type" name="type" required>
              </div>
              <div class="form-group">
                <label for="value_type">Value Type *</label>
                <select id="value_type" name="value_type" required>
                  <option value="Percentage">Percentage</option>
                  <option value="'Fixed Amount">Fixed Amount</option>
                </select>
              </div>
              <div class="form-group">
                <label for="value">Value *</label>
                <input type="number" id="value" name="value" step="0.01" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="effective_date">Effective Date *</label>
                <input type="date" id="effective_date" name="effective_date" required>
              </div>
              <div class="form-group">
                <label for="expiry_date">Expiry Date *</label>
                <input type="date" id="expiry_date" name="expiry_date" required>
                <small style="color: #666; font-size: 12px;">Must be at least 3 months from effective date</small>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group-full">
                <label for="description">Description</label>
                <textarea id="description" name="description" placeholder="Payroll rule description"></textarea>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" id="cancel-btn"><i class="fas fa-times"></i> Cancel</button>
          <button class="btn-submit" id="submit-btn"><i class="fas fa-check"></i> Add Payroll Rule</button>
        </div>
      </div>
    </div>
  `;

  // Tabulator config
  static _cfgTable = {
    selector: "#tabulator-table",
    tableName: "payroll_rules",
    searchInput: "#payroll-rule-search-input",
    primaryKey: "id_rule",
    columns: [
      { title: "Type", field: "type", editor: "input" },
      {
        title: "Value Type",
        field: "value_type",
        editor: "list",
        editorParams: { values: { "Percentage": "Percentage", "Fixed Amount": "Fixed Amount" } }
      },
      {
        title: "Value",
        field: "value",
        editor: "number",
        editorParams: { step: 0.01 },
        formatter: function (cell) {
          const value = cell.getValue();
          const valueType = cell.getRow().getData().value_type;

          if (valueType === "percentage") {
            return value + "%";
          } else {
            return "$" + parseFloat(value).toFixed(2);
          }
        }
      },
      {
        title: "Effective Date",
        field: "effective_date",
        editor: "date",
        formatter: Payroll_Rule.formatDate,
        formatterParams: {
          outputFormat: "YYYY-MM-DD",
          invalidPlaceholder: "(invalid date)"
        }
      },
      {
        title: "Expiry Date",
        field: "expiry_date",
        editor: "date",
        formatter: Payroll_Rule.formatDate,
        formatterParams: {
          outputFormat: "YYYY-MM-DD",
          invalidPlaceholder: "(invalid date)"
        },
        validator: function (cell, value, parameters) {
          const rowData = cell.getRow().getData();
          const effectiveDate = new Date(rowData.effective_date);
          const expiryDate = new Date(value);

          if (!value) return "Expiry date is required";

          // Calculate minimum expiry date (3 months from effective date)
          const minExpiryDate = new Date(effective_date);
          minExpiryDate.setMonth(minExpiryDate.getMonth() + 3);

          if (expiryDate < minExpiryDate) {
            return "Expiry date must be at least 3 months after effective date";
          }

          return true;
        }
      },
      { title: "Description", field: "description", editor: "textarea" },
      {
        title: "Created At",
        field: "created_at",
        editor: false,
        formatter: Payroll_Rule.formatDate
      },
      {
        title: "Updated At",
        field: "updated_at",
        editor: false,
        formatter: Payroll_Rule.formatDate
      }
    ]
  };

  // --- Singleton getInstance ---
  static getInstance() {
    if (!Payroll_Rule._instance) {
      Payroll_Rule._instance = new Payroll_Rule();
    }
    return Payroll_Rule._instance;
  }

  // --- Format date ---
  static formatDate(cell) {
    const value = cell.getValue();
    if (!value) return "";
    const date = new Date(value);
    return date.toLocaleDateString("en-US") + " " + date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
  }

  // --- Check if expiry date is at least 1 day after effective date ---
  static validateExpiryDate(effectiveDate, expiryDate) {
    if (!effectiveDate || !expiryDate) return false;

    const effDate = new Date(effectiveDate);
    const expDate = new Date(expiryDate);

    if (isNaN(effDate) || isNaN(expDate)) return false;

    // Expiry date phải >= effective date + 1 ngày
    const minExpiryDate = new Date(effDate);
    minExpiryDate.setDate(minExpiryDate.getDate() + 1);

    return expDate >= minExpiryDate;
  }

  // --- Return HTML ---
  getHTML() {
    return Payroll_Rule._html;
  }

  // --- Setup filters ---
  setupFilters() {
    const table = Payroll_Rule._instanceTable;
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
    const searchInput = document.getElementById(Payroll_Rule._cfgTable.searchInput);
    if (searchInput) {
      searchInput.addEventListener("keyup", e => {
        table.setFilter([
          { field: "type", type: "like", value: e.target.value },
          { field: "value_type", type: "like", value: e.target.value },
          { field: "description", type: "like", value: e.target.value }
        ]);
      });
    }
  }

  // --- Setup modal functionality ---
  setupModal() {
    const modal = document.getElementById("add-payroll-rule-modal");
    const openModalBtn = document.getElementById("open-modal-btn");
    const closeModalBtn = document.querySelector(".close");
    const cancelBtn = document.getElementById("cancel-btn");
    const submitBtn = document.getElementById("submit-btn");
    const payrollRuleForm = document.getElementById("payroll-rule-form");

    // Set today's date as default for effective date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("effective_date").value = today;

    // Calculate and set default expiry date (3 months from today)
    const defaultExpiryDate = new Date();
    defaultExpiryDate.setMonth(defaultExpiryDate.getMonth() + 3);
    document.getElementById("expiry_date").value = defaultExpiryDate.toISOString().split('T')[0];

    // Open modal
    openModalBtn.addEventListener("click", function () {
      modal.style.display = "block";
    });

    // Close modal
    const closeModal = () => {
      modal.style.display = "none";
      payrollRuleForm.reset();

      // Reset to default dates
      document.getElementById("effective_date").value = today;
      document.getElementById("expiry_date").value = defaultExpiryDate.toISOString().split('T')[0];
    };

    closeModalBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);

    // Form submission
    submitBtn.addEventListener("click", async function () {
      // Basic validation
      const type = document.getElementById("type").value;
      const value_type = document.getElementById("value_type").value;
      const value = document.getElementById("value").value;
      const effective_date = document.getElementById("effective_date").value;
      const expiry_date = document.getElementById("expiry_date").value;

      if (!type || !value_type || !value || !effective_date || !expiry_date) {
        alert("Please fill in all required fields (marked with *)");
        return;
      }

      // Validate value based on value type
      if (value_type === "percentage" && (value < 0 || value > 100)) {
        alert("Percentage value must be between 0 and 100");
        return;
      }

      if (value_type === "fixed" && value < 0) {
        alert("Fixed amount cannot be negative");
        return;
      }

      if (!Payroll_Rule.validateExpiryDate(effective_date, expiry_date)) {
        alert("Expiry date must be at least 1 day after the effective date");
        return;
      }

      // Here you would typically send the data to your server
      const formData = new FormData(payrollRuleForm);
      const data = Object.fromEntries(formData.entries());

      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

      try {
        const res = await fetch(`/modelController/${Payroll_Rule._cfgTable.tableName}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrfToken },
            body: JSON.stringify(data)
          });

        const result = await res.json();

        if (res.ok) {
          alert("Payroll Rule added successfully!");
          // Add row to Tabulator
          Payroll_Rule._instanceTable.addRow(result, true);
          closeModal();
        }
        else {
          // If server returns validation error
          alert("Error: " + (result.message || "Invalid input"));
        }
      }
      catch (err) {
        console.error(err);
        alert("Network or server error");
      }
    });
  }

  // --- Setup delete button functionality ---
setupDeleteButton() {
  const deleteBtn = document.getElementById("delete-selected-btn");

  if (deleteBtn) {
    deleteBtn.addEventListener("click", async () => {
      const selectedRows = Payroll_Rule._instanceTable.getSelectedRows();

      if (selectedRows.length === 0) {
        alert("Please select at least one row to delete.");
        return;
      }

      const currentDate = new Date();
      const rowsToDelete = [];
      const cannotDeleteRows = [];

      // Lọc các hàng có thể xóa (expiry date đã qua ít nhất 3 tháng)
      selectedRows.forEach(row => {
        const rowData = row.getData();
        const expiryDate = new Date(rowData.expiry_date);
        
        // Tính toán thời điểm được phép xóa (3 tháng sau expiry date)
        const minDeletionDate = new Date(expiryDate);
        minDeletionDate.setMonth(minDeletionDate.getMonth() + 3);

        if (currentDate >= minDeletionDate) {
          rowsToDelete.push(row);
        } else {
          cannotDeleteRows.push(rowData);
        }
      });

      // Hiển thị thông báo cho các hàng không thể xóa
      if (cannotDeleteRows.length > 0) {
        const cannotDeleteIds = cannotDeleteRows.map(row => 
          `ID: ${row.id_rule} (Expiry: ${row.expiry_date}) - Can be deleted after: ${new Date(new Date(row.expiry_date).setMonth(new Date(row.expiry_date).getMonth() + 3)).toLocaleDateString()}`
        ).join('\n');
        
        alert(`Cannot delete the following rules. They must be expired for at least 3 months before deletion:\n${cannotDeleteIds}`);
      }

      // Nếu không có hàng nào có thể xóa
      if (rowsToDelete.length === 0) {
        return;
      }

      // Xác nhận xóa
      if (!confirm(`Are you sure you want to delete ${rowsToDelete.length} payroll rule(s)?\n\nNote: ${cannotDeleteRows.length} rule(s) cannot be deleted yet as they haven't been expired for 3 months.`)) {
        return;
      }

      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      const deletePromises = [];

      for (const row of rowsToDelete) {
        const id = row.getData().id_rule;
        const deletePromise = fetch(`/modelController/${Payroll_Rule._cfgTable.tableName}/${id}`, {
          method: 'DELETE',
          headers: {
            'X-CSRF-TOKEN': csrfToken
          }
        });
        deletePromises.push(deletePromise);
      }

      try {
        const results = await Promise.allSettled(deletePromises);

        let successCount = 0;
        let failCount = 0;

        results.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value.ok) {
            successCount++;
          } else {
            failCount++;
            console.error(`Error deleting record ${rowsToDelete[index].getData().id_rule}:`, result.reason || result.value);
          }
        });

        if (successCount > 0) {
          alert(`Successfully deleted ${successCount} payroll rule(s).${failCount > 0 ? ` ${failCount} rule(s) failed to delete.` : ''}`);
          Payroll_Rule._instanceTable.setData();
          Payroll_Rule._instanceTable.deselectRow();
        }

        if (failCount > 0 && successCount === 0) {
          alert(`${failCount} payroll rule(s) failed to delete. Please try again.`);
        }

      } catch (error) {
        console.error('Error deleting records:', error);
        alert('An error occurred while deleting records. Please try again.');
      }
    });
  }
}

  // --- Create Tabulator table ---
  createTable() {
    if (Payroll_Rule._instanceTable) return;

    const cfg = Payroll_Rule._cfgTable;
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    Payroll_Rule._instanceTable = new Tabulator(cfg.selector, {
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
    Payroll_Rule._instanceTable.on("rowSelectionChanged", data => {
      const stats = document.querySelector(".select-stats");
      if (stats) stats.innerHTML = `<i class="fas fa-check-circle"></i> Selected: ${data.length}`;
    });

    // Cell edit validation
    Payroll_Rule._instanceTable.on("cellEdited", async cell => {
      const field = cell.getField();
      const columnDef = cfg.columns.find(col => col.field === field);

      // Only update if field is editable (not false)
      if (columnDef && columnDef.editor !== false) {
        if (cell.getValue() === "" || cell.getValue() === null) {
          cell.setValue(cell.getOldValue(), true);
          return;
        }

        // Special validation for expiry date
        if (field === 'expiry_date') {
          const rowData = cell.getRow().getData();
          if (!Payroll_Rule.validateExpiryDate(rowData.effective_date, cell.getValue())) {
            alert("Expiry date must be at least 1 day after the effective date");
            cell.setValue(cell.getOldValue(), true);
            return;
          }
        }

        // Send update to server
        try {
          const rowData = cell.getRow().getData();
          const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
          const url = `/modelController/${Payroll_Rule._cfgTable.tableName}/${rowData.id_rule}`;
          const payload = { [field]: cell.getValue() };

          const resPut = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrfToken },
            body: JSON.stringify(payload)
          });

          if (!resPut.ok) {
            alert("Update failed.");
            cell.setValue(cell.getOldValue(), true);
          } else {
            console.log("Update successful");
          }

        } catch (err) {
          console.error(err);
          cell.setValue(cell.getOldValue(), true);
        }
      } else {
        // Revert changes for non-editable fields
        cell.setValue(cell.getOldValue(), true);
      }
    });
  }

  // --- Render table into container ---
  render(container) {
    container.innerHTML = this.getHTML();

    if (!Payroll_Rule._instanceTable) {
      this.createTable();
    } else {
      // Reattach table to new div
      const tableDiv = container.querySelector(Payroll_Rule._cfgTable.selector);
      tableDiv.appendChild(Payroll_Rule._instanceTable.element);
    }

    // Setup filters and search
    this.setupFilters();

    // Setup modal
    this.setupModal();

    // Setup delete button
    this.setupDeleteButton();
  }
}