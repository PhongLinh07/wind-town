// Salary_Detail.js
class Salary_Detail {
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
              <option value="id_salary_details">ID</option>
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
            <input type="text" id="salary-detail-search-input" placeholder="Search salary details...">
          </div>
          
          <div class="filter-block">
            <button class="add-row-btn" id="open-modal-btn"><i class="fas fa-plus-circle"></i> Add</button>
          </div>
          
          <div class="filter-block">
            <button class="delete-selected-btn" data-tab="salaryDetailTab"><i class="fas fa-trash-alt"></i> Delete</button>
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
    <form id="add-salary-detail-modal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2><i class="fas fa-money-check"></i> Add New Salary Detail</h2>
          <span class="close">&times;</span>
        </div>
        <div class="modal-body">
          <form id="salary-detail-form">
            <div class="form-row">
              <div class="form-group">
                <label for="id_contract">Contract ID *</label>
                <input type="number" id="id_contract" name="id_contract" required>
              </div>
              <div class="form-group">
                <label for="id_approved_by">Approved By ID *</label>
                <input type="number" id="id_approved_by" name="id_approved_by" required>
              </div>
              <div class="form-group">
                <label for="salary_month">Salary Month *</label>
                <input type="month" id="salary_month" name="salary_month" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="overtime">Overtime Amount</label>
                <input type="number" id="overtime" name="overtime" step="0.01" min="0">
              </div>
              <div class="form-group">
                <label for="bonus">Bonus Amount</label>
                <input type="number" id="bonus" name="bonus" step="0.01" min="0">
              </div>
              <div class="form-group">
                <label for="attendance_bonus">Attendance Bonus</label>
                <input type="number" id="attendance_bonus" name="attendance_bonus" step="0.01" min="0">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="deduction">Deduction Amount</label>
                <input type="number" id="deduction" name="deduction" step="0.01" min="0">
              </div>
              <div class="form-group">
                <label for="net_salary">Net Salary *</label>
                <input type="number" id="net_salary" name="net_salary" step="0.01" min="0" required>
              </div>
              <div class="form-group">
                <label for="status">Status</label>
                <select id="status" name="status">
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group-full">
                <label for="description">Description</label>
                <textarea id="description" name="description" placeholder="Salary detail description"></textarea>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" id="cancel-btn"><i class="fas fa-times"></i> Cancel</button>
          <button class="btn-submit" id="submit-btn"><i class="fas fa-check"></i> Add Salary Detail</button>
        </div>
      </div>
    </form>
  `;

  // Tabulator config
  static _cfgTable = {
    selector: "#tabulator-table",
    tableName: "salary_details",
    searchInput: "salary-detail-search-input",
    primaryKey: "id_salary_details",
    columns: [
      { title: "ID", field: "id_salary_details", editor: false },
      { title: "Contract ID", field: "id_contract", editor: "number" },
      { title: "Approved By ID", field: "id_approved_by", editor: "number" },
      { 
        title: "Salary Month", 
        field: "salary_month", 
        editor: "month",
        formatter: function(cell) {
          const value = cell.getValue();
          if (!value) return "";
          const date = new Date(value + "-01"); // Add day to parse correctly
          return date.toLocaleDateString("en-US", { year: 'numeric', month: 'long' });
        }
      },
      { 
        title: "Overtime", 
        field: "overtime", 
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
        title: "Bonus", 
        field: "bonus", 
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
        title: "Attendance Bonus", 
        field: "attendance_bonus", 
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
        title: "Deduction", 
        field: "deduction", 
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
        title: "Net Salary", 
        field: "net_salary", 
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
        title: "Status", 
        field: "status", 
        editor: "list",
        editorParams: {
          values: {
            "pending": "Pending",
            "approved": "Approved",
            "rejected": "Rejected",
            "paid": "Paid"
          }
        }
      },
      { title: "Description", field: "description", editor: "textarea" },
      { 
        title: "Create At", 
        field: "created_at", 
        editor: false, 
        formatter: Salary_Detail.formatDate 
      },
      { 
        title: "Update At", 
        field: "updated_at", 
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

  // --- Format date ---
  static formatDate(cell) {
    const value = cell.getValue();
    if (!value) return "";
    const date = new Date(value);
    return date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
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
          { field: "id_approved_by", type: "like", value: e.target.value },
          { field: "status", type: "like", value: e.target.value },
          { field: "description", type: "like", value: e.target.value }
        ]);
      });
    }
  }

  // --- Setup modal functionality ---
  setupModal() {
    const modal = document.getElementById("add-salary-detail-modal");
    const openModalBtn = document.getElementById("open-modal-btn");
    const closeModalBtn = document.querySelector(".close");
    const cancelBtn = document.getElementById("cancel-btn");
    const submitBtn = document.getElementById("submit-btn");
    const salaryDetailForm = document.getElementById("salary-detail-form");

    // Open modal
    openModalBtn.addEventListener("click", function() {
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
    submitBtn.addEventListener("click", function() {
      // Basic validation
      const id_contract = document.getElementById("id_contract").value;
      const id_approved_by = document.getElementById("id_approved_by").value;
      const salary_month = document.getElementById("salary_month").value;
      const net_salary = document.getElementById("net_salary").value;
      
      if (!id_contract || !id_approved_by || !salary_month || !net_salary) {
        alert("Please fill in all required fields (marked with *)");
        return;
      }
      
      // Validate amounts are not negative
      const overtime = document.getElementById("overtime").value;
      const bonus = document.getElementById("bonus").value;
      const attendance_bonus = document.getElementById("attendance_bonus").value;
      const deduction = document.getElementById("deduction").value;
      
      if ((overtime && overtime < 0) || 
          (bonus && bonus < 0) || 
          (attendance_bonus && attendance_bonus < 0) || 
          (deduction && deduction < 0) ||
          (net_salary && net_salary < 0)) {
        alert("All amounts must be positive values");
        return;
      }
      
      // Here you would typically send the data to your server
      const formData = new FormData(salaryDetailForm);
      const data = Object.fromEntries(formData.entries());
      
      console.log("New salary detail data:", data);
      alert("Salary detail added successfully! (This would connect to your backend in a real application)");
      
      // In a real application, you would add the row to the table here
      // Salary_Detail._instanceTable.addRow(data, true);
      
      closeModal();
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
    Salary_Detail._instanceTable.on("rowSelectionChanged", data => {
      const stats = document.querySelector(".select-stats");
      if (stats) stats.innerHTML = `<i class="fas fa-check-circle"></i> Selected: ${data.length}`;
    });

    // Cell edit validation
    Salary_Detail._instanceTable.on("cellEdited", cell => {
      if (cell.getValue() === "" || cell.getValue() === null) {
        cell.setValue(cell.getOldValue(), true);
      }
    });
  }

  // --- Render table vào container ---
  render(container) {
    container.innerHTML = this.getHTML();

    if (!Salary_Detail._instanceTable) {
      this.createTable();
    } else {
      // Reattach bảng vào div mới
      const tableDiv = container.querySelector(Salary_Detail._cfgTable.selector);
      tableDiv.appendChild(Salary_Detail._instanceTable.element);
    }

    // Setup filters và search
    this.setupFilters();
    
    // Thiết lập modal
    this.setupModal();
  }
}