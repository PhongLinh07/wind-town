// Leave.js
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
              <option value="id_leave">ID</option>
              <option value="id_employee">ID Employee</option>
              <option value="approved_by">ID Approved</option>
              <option value="start_date">Start Date</option>
              <option value="end_date">End Date</option>
              <option value="type">Type</option>
              <option value="reason">Reason</option>
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

            <div class="form-row">
              <div class="form-group">
                <label for="start_date">Start Date *</label>
                <input type="date" id="start_date" name="start_date" required>
              </div>
              <div class="form-group">
                <label for="end_date">End Date *</label>
                <input type="date" id="end_date" name="end_date" required>
              </div>
              <div class="form-group">
                <label for="status">Status *</label>
                <select id="status" name="status" required>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group-full">
                <label for="reason">Reason *</label>
                <input type="text" id="reason" name="reason" placeholder="Reason for leave" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group-full">
                <label for="description">Description</label>
                <textarea id="description" name="description" placeholder="Additional details"></textarea>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" id="cancel-btn"><i class="fas fa-times"></i> Cancel</button>
          <button class="btn-submit" id="submit-btn"><i class="fas fa-check"></i> Add Leave Request</button>
        </div>
      </div>
    </form>
  `;

  // Tabulator config
  static _cfgTable = {
    selector: "#tabulator-table",
    tableName: "leaves",
    searchInput: "leave-search-input",
    primaryKey: "id_leave",
    columns: [
      { title: "ID", field: "id_leave", editor: false },
      { title: "Employee ID", field: "id_employee", editor: "number" },
      { title: "Approved By", field: "approved_by", editor: "number" },
      { 
        title: "Start Date", 
        field: "start_date", 
        editor: "date",
        formatter: Leave.formatDate,
        formatterParams: {
          outputFormat: "YYYY-MM-DD",
          invalidPlaceholder: "(invalid date)"
        }
      },
      { 
        title: "End Date", 
        field: "end_date", 
        editor: "date",
        formatter: Leave.formatDate,
        formatterParams: {
          outputFormat: "YYYY-MM-DD",
          invalidPlaceholder: "(invalid date)"
        }
      },
      { 
        title: "Type", 
        field: "type", 
        editor: "list",
        editorParams: {
          values: {
            "Sick leave": "Sick leave",
            "Maternity": "Maternity",
            "Family leave": "Family leave",
            "Paid leave": "Paid leave",
            "Personal leave": "Personal leave",
            "Work assignment": "Work assignment"
          }
        }
      },
      { title: "Reason", field: "reason", editor: "input" },
      { 
        title: "Status", 
        field: "status", 
        editor: "list",
        editorParams: {
          values: {
            "pending": "Pending",
            "approved": "Approved",
            "rejected": "Rejected",
            "cancelled": "Cancelled"
          }
        }
      },
      { title: "Description", field: "description", editor: "textarea" },
      { 
        title: "Create At", 
        field: "created_at", 
        editor: false, 
        formatter: Leave.formatDate 
      },
      { 
        title: "Update At", 
        field: "updated_at", 
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
  setupModal() {
    const modal = document.getElementById("add-leave-modal");
    const openModalBtn = document.getElementById("open-modal-btn");
    const closeModalBtn = document.querySelector(".close");
    const cancelBtn = document.getElementById("cancel-btn");
    const submitBtn = document.getElementById("submit-btn");
    const leaveForm = document.getElementById("leave-form");

    // Open modal
    openModalBtn.addEventListener("click", function() {
      modal.style.display = "block";
    });

    // Close modal
    const closeModal = () => {
      modal.style.display = "none";
      leaveForm.reset();
    };

    closeModalBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);

    // Form submission
    submitBtn.addEventListener("click", function() {
      // Basic validation
      const id_employee = document.getElementById("id_employee").value;
      const type = document.getElementById("type").value;
      const start_date = document.getElementById("start_date").value;
      const end_date = document.getElementById("end_date").value;
      const status = document.getElementById("status").value;
      const reason = document.getElementById("reason").value;
      
      if (!id_employee || !type || !start_date || !end_date || !status || !reason) {
        alert("Please fill in all required fields (marked with *)");
        return;
      }
      
      // Validate date range
      if (new Date(end_date) < new Date(start_date)) {
        alert("End date cannot be before start date");
        return;
      }
      
      // Here you would typically send the data to your server
      const formData = new FormData(leaveForm);
      const data = Object.fromEntries(formData.entries());
      
      console.log("New leave data:", data);
      alert("Leave request added successfully! (This would connect to your backend in a real application)");
      
      // In a real application, you would add the row to the table here
      // Leave._instanceTable.addRow(data, true);
      
      closeModal();
    });
  }

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
    Leave._instanceTable.on("cellEdited", cell => {
      if (cell.getValue() === "" || cell.getValue() === null) {
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