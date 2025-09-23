// Salary_Detail.js
class Salary_Detail {
  // --- Singleton instance ---
  static _instance = null;
  static _instanceTable = null;

  // HTML template (updated to English)
  static _html = `
    <div class="main-container">
      <!-- Money management section (outside form) -->
      <div class="money-management-section">
        <div class="section-header">
          <h2><i class="fas fa-money-bill-wave"></i> Money Management</h2>
        </div>
        
        <div class="money-controls">
          <div class="money-inputs">
            <input type="number" id="money-amount" placeholder="Amount" min="0">
          </div>
          
          <div class="money-buttons">
            <button type="button" id="add-money-btn" class="btn-primary">
              <i class="fas fa-plus"></i> Add Money
            </button>
            <button type="button" id="remove-money-btn" class="btn-danger">
              <i class="fas fa-minus"></i> Remove Money
            </button>
          </div>
        </div>

        <!-- Total money display -->
        <div class="money-summary">
          <div class="total-display">
            <span class="total-label">Total amount:</span>
            <span class="total-amount" id="total-money-amount">0 VND</span>
          </div>
        </div>
      </div>

      <!-- Filter and table section -->
      <div class="filter-container">
        <div class="filter-left">
          <div class="filter-block">
            <h3><i class="fas fa-filter"></i> Field:</h3>
            <select class="input-field" id="filter-field">
              <option value=""></option>
              <option value="id_contract">ID Contract</option>
              <option value="approved_by">Approved By</option>
              <option value="salary_month">Salary Month</option>
              <option value="overtime">Overtime</option>
              <option value="bonus">Bonus</option>
              <option value="attendance_bonus">Attendance Bonus</option>
              <option value="deduction">Deduction</option>
              <option value="net_salary">Net Salary</option>
              <option value="status">Status</option>
              <option value="description">Description</option>
              <option value="created_at">Create At</option>
            </select>
          </div>

          <div class="filter-block">
            <h3><i class="fas fa-code"></i> Type:</h3>
            <select class="input-field" id="filter-type">
              <option value="=">=</option>
              <option value="<">&lt;</option>
              <option value="<=">&lt;=</option>
              <option value=">">&gt;</option>
              <option value=">=">&gt;=</option>
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
            <input type="text" id="salary-detail-search-input" placeholder="Search salary details...">
          </div>
          
          <div class="filter-block">
            <button class="add-bonus" id="open-modal-btn"><i class="fas fa-plus-circle"></i> Calculate Salary</button>
          </div>
          
          <div class="filter-block">
            <button class="delete-selected-btn" id="delete-selected-btn"><i class="fas fa-trash-alt"></i> Delete Selected</button>
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

    <!-- Salary Calculation Modal Form (date and ID only) -->
    <div id="add-salary-detail-modal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2><i class="fas fa-money-check"></i> Calculate Salary</h2>
          <span class="close">&times;</span>
        </div>
        <div class="modal-body">
          <form id="salary-detail-form">
            <div class="form-row">
              <div class="form-group">
                <label for="end_date">End Date *</label>
                <input type="date" id="end_date" name="end_date" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="holidate">Number of Holidays *</label>
                <input type="number" id="holidate" name="holidate" min="0" required>
              </div>

              <div class="form-group">
                <label for="bonus">Bonus</label>
                <input type="number" id="bonus" name="bonus" min="0" step="0.01" placeholder="Enter bonus amount">
              </div>

              <div class="form-group">
                <label for="id_approved_by">Approved By *</label>
                <input type="text" id="id_approved_by" name="id_approved_by" placeholder="Enter approver ID" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group-full">
                <label for="description">Note</label>
                <textarea id="description" name="description" placeholder="Note about the payroll calculation process"></textarea>
              </div>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" id="cancel-btn"><i class="fas fa-times"></i> Cancel</button>
          <button class="btn-submit" id="submit-btn"><i class="fas fa-calculator"></i> Calculate Salary</button>
        </div>
      </div>
    </div>
  `;

  // Tabulator config (updated date format and currency)
  // Tabulator config
// Tabulator config (unchanged, only English text remains)
static _cfgTable = {
  selector: "#tabulator-table",
  tableName: "salary_details",
  searchInput: "salary-detail-search-input",
  primaryKey: "id_salary_details",
  columns: [
    { title: "Contract ID", field: "id_contract", editor: false },
    {
      title: "Approved By",
      field: "approved_by",
      editor: false,
      formatter: function (cell) {
        const value = cell.getValue();
        if (value && typeof value === 'object') {
          return value.id_employee || value.name || 'N/A';
        }
        return value || 'N/A';
      }
    },
    {
      title: "Salary Month",
      field: "salary_month",
      editor: false,
      formatter: function (cell) {
        const value = cell.getValue();
        if (!value) return "";
        try {
          const date = new Date(value);
          return date.toLocaleDateString("vi-VN", { year: 'numeric', month: 'long' });
        } catch (e) {
          return value;
        }
      }
    },
    {
      title: "Base Salary",
      field: "base_salary",
      editor: false,
      formatter: "money",
      formatterParams: {
        symbol: "₫",
        precision: 0,
        thousand: ",",
        decimal: "."
      }
    },
    {
      title: "Salary Multiplier",
      field: "salary_multiplier",
      editor: false,
      formatter: "money",
      formatterParams: {
        precision: 2
      }
    },
    {
      title: "Office Hours",
      field: "office_hours",
      editor: false,
      formatter: "money",
      formatterParams: {
        precision: 2
      }
    },
    {
      title: "Overtime",
      field: "overtime",
      editor: false,
      formatter: "money",
      formatterParams: {
        symbol: "₫",
        precision: 0,
        thousand: ",",
        decimal: "."
      }
    },
    {
      title: "Late Time",
      field: "late_time",
      editor: false,
      formatter: "money",
      formatterParams: {
        precision: 2
      }
    },
    {
      title: "Bonus",
      field: "bonus",
      editor: false,
      formatter: "money",
      formatterParams: {
        symbol: "₫",
        precision: 0,
        thousand: ",",
        decimal: "."
      }
    },
    {
      title: "Attendance Bonus",
      field: "attendance_bonus",
      editor: false,
      formatter: "money",
      formatterParams: {
        symbol: "₫",
        precision: 0,
        thousand: ",",
        decimal: "."
      }
    },
    {
      title: "Deduction",
      field: "deduction",
      editor: false,
      formatter: "money",
      formatterParams: {
        symbol: "₫",
        precision: 0,
        thousand: ",",
        decimal: "."
      }
    },
    {
      title: "Net Salary",
      field: "net_salary",
      editor: false,
      formatter: "money",
      formatterParams: {
        symbol: "₫",
        precision: 0,
        thousand: ",",
        decimal: "."
      }
    },
    {
      title: "Status",
      field: "status",
      editor: false,
      formatter: "lookup",
      formatterParams: {
        "pending": "⏳ Pending",
        "paid": "✅ Paid"
      }
    },
    {
      title: "Description",
      field: "description",
      editor: "textarea",
      width: 200
    },
    {
      title: "Create At",
      field: "created_at",
      editor: false,
      formatter: Salary_Detail.formatDate
    }
  ]
};


  // --- Singleton getInstance ---
  static getInstance() {
    if (!Salary_Detail._instance) {
      Salary_Detail._instance = new Salary_Detail();
    }
    return Salary_Detail._instance;
  }

  // --- Format date to dd-mm-yyyy ---
  static formatDate(cell) {
    const value = cell.getValue();
    if (!value) return "";
    try {
      const date = new Date(value);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (e) {
      return value;
    }
  }

  // --- Handle Edit ---
  static handleEdit(data) {
    const table = Salary_Detail._instanceTable;
    if (table) {
      const row = table.getRow(data[Salary_Detail._cfgTable.primaryKey]);
      if (row) {
        console.log("Edit row:", data);
        alert(`Edit function for record ${data[Salary_Detail._cfgTable.primaryKey]}. Data will be automatically updated when you edit in the table.`);
      }
    }
  }

  // --- Handle Delete ---
  static handleDelete(data) {
    if (confirm(`Are you sure you want to delete this record? (ID: ${data[Salary_Detail._cfgTable.primaryKey]})`)) {
      const table = Salary_Detail._instanceTable;
      if (table) {
        const row = table.getRow(data[Salary_Detail._cfgTable.primaryKey]);
        if (row) {
          const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

          fetch(`/modelController/${Salary_Detail._cfgTable.tableName}/${data[Salary_Detail._cfgTable.primaryKey]}`, {
            method: 'DELETE',
            headers: {
              'X-CSRF-TOKEN': csrfToken,
              'Content-Type': 'application/json'
            }
          })
            .then(response => response.json())
            .then(result => {
              if (result.success) {
                row.delete();
                alert("Delete successfully!");
              } else {
                alert("Error when deleting: " + (result.message || "Unknown error"));
              }
            })
            .catch(error => {
              console.error('Error deleting row:', error);
              alert("Connection error when deleting");
            });
        }
      }
    }
  }

  // --- Return HTML ---
  getHTML() {
    return Salary_Detail._html;
  }

  // --- Setup filters ---
  setupFilters() {
    const table = Salary_Detail._instanceTable;
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
    const searchInput = document.getElementById(Salary_Detail._cfgTable.searchInput);
    if (searchInput) {
      searchInput.addEventListener("keyup", e => {
        table.setFilter([
          { field: "id_contract", type: "like", value: e.target.value },
          { field: "approved_by", type: "like", value: e.target.value },
          { field: "status", type: "like", value: e.target.value },
          { field: "description", type: "like", value: e.target.value }
        ]);
      });
    }
  }

  // --- Setup delete selected functionality ---
  setupDeleteSelected() {
    const deleteBtn = document.getElementById("delete-selected-btn");
    if (!deleteBtn || !Salary_Detail._instanceTable) return;

    deleteBtn.addEventListener("click", () => {
      const selectedRows = Salary_Detail._instanceTable.getSelectedRows();

      if (selectedRows.length === 0) {
        alert("Please select at least one row to delete");
        return;
      }

      if (!confirm(`Are you sure you want to delete ${selectedRows.length} selected rows?`)) {
        return;
      }

      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      const deletePromises = [];

      selectedRows.forEach(row => {
        const data = row.getData();
        const primaryKey = data[Salary_Detail._cfgTable.primaryKey];

        deletePromises.push(
          fetch(`/modelController/${Salary_Detail._cfgTable.tableName}/${primaryKey}`, {
            method: 'DELETE',
            headers: {
              'X-CSRF-TOKEN': csrfToken,
              'Content-Type': 'application/json'
            }
          })
        );
      });

      Promise.all(deletePromises)
        .then(responses => Promise.all(responses.map(r => r.json())))
        .then(results => {
          const successCount = results.filter(r => r.success).length;
          if (successCount === selectedRows.length) {
            // Delete selected rows and refresh table
            selectedRows.forEach(row => row.delete());

            // UPDATE TABLE DATA IMMEDIATELY
            Salary_Detail._instanceTable.setData();

            alert(`Successfully deleted ${successCount} rows`);
          } else {
            // If there are errors, still refresh the table
            Salary_Detail._instanceTable.setData();
            alert(`Deleted ${successCount}/${selectedRows.length} rows. Some rows may not be deleted.`);
          }
        })
        .catch(error => {
          console.error('Error deleting rows:', error);
          // Refresh table even if there are errors
          Salary_Detail._instanceTable.setData();
          alert("Error when deleting selected rows");
        });
    });
  }

  // --- Setup modal functionality ---
  setupModal() {
    const modal = document.getElementById("add-salary-detail-modal");
    const openModalBtn = document.getElementById("open-modal-btn");
    const closeModalBtn = document.querySelector(".close");
    const cancelBtn = document.getElementById("cancel-btn");
    const submitBtn = document.getElementById("submit-btn");
    const salaryDetailForm = document.getElementById("salary-detail-form");
 

    if (!modal) return;

    // Open modal
    openModalBtn.addEventListener("click", function () {
      modal.style.display = "block";
    });

    // Close modal
    const closeModal = () => {
      modal.style.display = "none";
      salaryDetailForm.reset();
    };

    closeModalBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);

    // Form submission
    submitBtn.addEventListener("click", async function () {
      const endDate = document.getElementById("end_date").value; // string "YYYY-MM-DD"
      const holidate = parseInt(document.getElementById("holidate").value, 10);
      const approvedBy = document.getElementById("id_approved_by").value;
      const bonus = parseFloat(document.getElementById("bonus").value) || 0; // ✅ lấy bonus

      if (!endDate || isNaN(holidate) || !approvedBy) {
        alert("Please fill in all required fields (*)");
        return;
      }

      if (holidate < 0) {
        alert("Number of holidays cannot be negative");
        return;
      }

      Salary.holiday = holidate;
      Salary.id_approved_by = approvedBy;

      try {
        // Pass string "YYYY-MM-DD" to calculatePayroll
        const results = await Salary.calculatePayroll(endDate, bonus); // truyền bonus = 2,000,000

        // Update Tabulator table data
        if (Salary_Detail._instanceTable) {
          Salary_Detail._instanceTable.setData(results);
        }

        alert("Calculate payroll successfully!");
        modal.style.display = "none";

        // Calculate total money and display
        let totalMoney = results.reduce(
          (sum, r) => sum + (r.net_salary || 0) + (r.bonus || 0),
          0
        );
        document.getElementById("total-money-amount").textContent = `${totalMoney.toLocaleString()} VND`;
      } catch (err) {
        console.error(err);
        alert("Error when calculating payroll");
      }
    });
  }

  // --- Setup money management functionality ---
  setupMoneyManagement() {
    const addMoneyBtn = document.getElementById("add-money-btn");
    const removeMoneyBtn = document.getElementById("remove-money-btn");
    const totalAmountSpan = document.getElementById("total-money-amount");
    const moneyAmountInput = document.getElementById("money-amount");

    let totalAmount = 0;

    if (!addMoneyBtn || !removeMoneyBtn || !totalAmountSpan || !moneyAmountInput) return;

    // Update total amount
    const updateTotalAmount = (amount, isAdding) => {
      if (isAdding) {
        totalAmount += amount;
      } else {
        totalAmount = Math.max(0, totalAmount - amount);
      }
      totalAmountSpan.textContent = `${totalAmount.toLocaleString('vi-VN')} VND`;
      totalAmountSpan.className = totalAmount >= 0 ? 'positive' : 'negative';
    };

    // Add money
    addMoneyBtn.addEventListener('click', () => {
      const amount = parseFloat(moneyAmountInput.value);

      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount (greater than 0)');
        return;
      }

      updateTotalAmount(amount, true);
      moneyAmountInput.value = '';
      console.log('Add money:', amount, 'Total:', totalAmount);
    });

    // Remove money AND selected rows
    removeMoneyBtn.addEventListener('click', () => {
      // Check if any rows are selected in the table
      const selectedRows = Salary_Detail._instanceTable?.getSelectedRows() || [];

      if (selectedRows.length > 0) {
        // If rows are selected, delete the selected rows
        if (!confirm(`Are you sure you want to delete ${selectedRows.length} selected rows?`)) {
          return;
        }

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        const deletePromises = [];

        // Loop through all selected rows and delete
        selectedRows.forEach(row => {
          const data = row.getData();
          const primaryKey = data[Salary_Detail._cfgTable.primaryKey];

          deletePromises.push(
            fetch(`/modelController/${Salary_Detail._cfgTable.tableName}/${primaryKey}`, {
              method: 'DELETE',
              headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Content-Type': 'application/json'
              }
            })
          );
        });

        Promise.all(deletePromises)
          .then(responses => Promise.all(responses.map(r => r.json())))
          .then(results => {
            const successCount = results.filter(r => r.success).length;
            if (successCount === selectedRows.length) {
              // Delete all selected rows from the table
              selectedRows.forEach(row => row.delete());
              alert(`Successfully deleted ${successCount} rows`);
            } else {
              alert(`Deleted ${successCount}/${selectedRows.length} rows. Some rows may not be deleted.`);
            }
          })
          .catch(error => {
            console.error('Error deleting selected rows:', error);
            alert("Error when deleting selected rows");
          });
      } else {
        // If no rows are selected, perform normal money removal
        const amount = parseFloat(moneyAmountInput.value);

        if (isNaN(amount) || amount <= 0) {
          alert('Please enter a valid amount (greater than 0)');
          return;
        }

        if (amount > totalAmount) {
          alert('The amount to remove cannot be greater than the current total amount');
          return;
        }

        updateTotalAmount(amount, false);
        moneyAmountInput.value = '';
        console.log('Remove money:', amount, 'Total:', totalAmount);
      }
    });

    // Allow Enter key to add money
    moneyAmountInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addMoneyBtn.click();
      }
    });
  }

  // --- Create Tabulator table ---
  createTable() {
    if (Salary_Detail._instanceTable) return;

    const cfg = Salary_Detail._cfgTable;
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    Salary_Detail._instanceTable = new Tabulator(cfg.selector, {
      ajaxURL: `/modelController/${cfg.tableName}`,
      pagination: "local",
      paginationSize: 10,
      paginationSizeSelector: [10, 20, 30, 50],
      movableColumns: true,
      paginationCounter: "pages",
      paginationButtonCount: 0,
      index: cfg.primaryKey,
      columns: cfg.columns,
      ajaxConfig: {
        method: "GET",
        headers: {
          'X-CSRF-TOKEN': csrfToken
        }
      }
    });

    // Row selection stats
    Salary_Detail._instanceTable.on("rowSelectionChanged", data => {
      const stats = document.querySelector(".select-stats");
      if (stats) stats.innerHTML = `<i class="fas fa-check-circle"></i> Selected: ${data.length}`;
    });

    // Cell edit validation - ONLY ALLOW EDITING CELLS WITH EDITOR NOT FALSE
    Salary_Detail._instanceTable.on("cellEditing", function (cell) {
      const columnDefinition = cell.getColumn().getDefinition();
      if (columnDefinition.editor === false) {
        return false; // Prevent editing
      }
      return true;
    });

    // Cell edit - save to server
    Salary_Detail._instanceTable.on("cellEdited", async cell => {
      const columnDefinition = cell.getColumn().getDefinition();

      // Only process if cell is allowed to be edited
      if (columnDefinition.editor !== false) {
        const newValue = cell.getValue();
        const oldValue = cell.getOldValue();

        if (newValue === null || newValue === "" || newValue === oldValue) {
          cell.update(oldValue, true);
          return;
        }

        try {
          const rowData = cell.getRow().getData();
          const field = cell.getField();
          const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

          const url = `/modelController/${Salary_Detail._cfgTable.tableName}/${rowData.id_salary_details}`;

          const resPut = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrfToken },
            body: JSON.stringify(rowData)
          });

          if (!resPut.ok) {
            cell.setValue(cell.getOldValue(), true);
            alert("Update failed.");
            return;
          }

          console.log("Update successful");

        } catch (err) {
          cell.setValue(cell.getOldValue(), true);
          console.error(err);
        }
      }
    });
  }

  // --- Render table into container ---
  render(container) {
    container.innerHTML = this.getHTML();

    if (!Salary_Detail._instanceTable) {
      this.createTable();
    } else {
      const tableDiv = container.querySelector(Salary_Detail._cfgTable.selector);
      if (tableDiv && Salary_Detail._instanceTable.element) {
        tableDiv.appendChild(Salary_Detail._instanceTable.element);
      }
    }

    this.setupFilters();
    this.setupModal();
    this.setupMoneyManagement();
    this.setupDeleteSelected();
  }
}