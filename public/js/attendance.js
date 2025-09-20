// Attendance.js
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
              <option value="id_attendance">ID</option>
              <option value="id_employee">ID Employee</option>
              <option value="of_date">Date</option>
              <option value="office_hours">Office Hours</option>
              <option value="over_time">Overtime</option>
              <option value="late_time">Late Time</option>
              <option value="is_night_shift">Night Shift</option>
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

    <!-- Modal Form -->
    <form id="add-attendance-modal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2><i class="fas fa-calendar-check"></i> Add New Attendance Record</h2>
          <span class="close">&times;</span>
        </div>
        <div class="modal-body">
          <form id="attendance-form">
            <div class="form-row">
              <div class="form-group">
                <label for="id_employee">Employee ID *</label>
                <input type="number" id="id_employee" name="id_employee" required>
              </div>
              <div class="form-group">
                <label for="of_date">Date *</label>
                <input type="date" id="of_date" name="of_date" required>
              </div>
              <div class="form-group">
                <label for="office_hours">Office Hours *</label>
                <input type="number" id="office_hours" name="office_hours" step="0.5" min="0" max="24" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="over_time">Overtime Hours</label>
                <input type="number" id="over_time" name="over_time" step="0.5" min="0">
              </div>
              <div class="form-group">
                <label for="late_time">Late Time (minutes)</label>
                <input type="number" id="late_time" name="late_time" min="0">
              </div>
              <div class="form-group">
                <label for="is_night_shift">Night Shift</label>
                <select id="is_night_shift" name="is_night_shift">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group-full">
                <label for="description">Description</label>
                <textarea id="description" name="description" placeholder="Attendance description"></textarea>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" id="cancel-btn"><i class="fas fa-times"></i> Cancel</button>
          <button class="btn-submit" id="submit-btn"><i class="fas fa-check"></i> Add Attendance</button>
        </div>
      </div>
    </form>
  `;

  // Tabulator config
  static _cfgTable = {
    selector: "#tabulator-table",
    tableName: "attendances",
    searchInput: "attendance-search-input",
    primaryKey: "id_attendance",
    columns: [
      { title: "ID", field: "id_attendance", editor: false },
      { title: "Employee ID", field: "id_employee", editor: "number" },
      { 
        title: "Date", 
        field: "of_date", 
        editor: "date",
        formatter: Attendance.formatDate,
        formatterParams: {
          outputFormat: "YYYY-MM-DD",
          invalidPlaceholder: "(invalid date)"
        }
      },
      { 
        title: "Office Hours", 
        field: "office_hours", 
        editor: "number",
        editorParams: { step: 0.5, min: 0, max: 24 },
        formatter: function(cell) {
          const value = cell.getValue();
          return value ? value + "h" : "";
        }
      },
      { 
        title: "Overtime", 
        field: "over_time", 
        editor: "number",
        editorParams: { step: 0.5, min: 0 },
        formatter: function(cell) {
          const value = cell.getValue();
          return value ? value + "h" : "";
        }
      },
      { 
        title: "Late Time", 
        field: "late_time", 
        editor: "number",
        editorParams: { min: 0 },
        formatter: function(cell) {
          const value = cell.getValue();
          return value ? value + "m" : "";
        }
      },
      { 
        title: "Night Shift", 
        field: "is_night_shift", 
        editor: "tickCross",
        formatter: "tickCross",
        formatterParams: { allowTruthy: true }
      },
      { title: "Description", field: "description", editor: "textarea" },
      { 
        title: "Create At", 
        field: "created_at", 
        editor: false, 
        formatter: Attendance.formatDate 
      },
      { 
        title: "Update At", 
        field: "updated_at", 
        editor: false, 
        formatter: Attendance.formatDate 
      }
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
  setupModal() {
    const modal = document.getElementById("add-attendance-modal");
    const openModalBtn = document.getElementById("open-modal-btn");
    const closeModalBtn = document.querySelector(".close");
    const cancelBtn = document.getElementById("cancel-btn");
    const submitBtn = document.getElementById("submit-btn");
    const attendanceForm = document.getElementById("attendance-form");

    // Open modal
    openModalBtn.addEventListener("click", function() {
      modal.style.display = "block";
    });

    // Close modal
    const closeModal = () => {
      modal.style.display = "none";
      attendanceForm.reset();
    };

    closeModalBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);

    // Form submission
    submitBtn.addEventListener("click", function() {
      // Basic validation
      const id_employee = document.getElementById("id_employee").value;
      const of_date = document.getElementById("of_date").value;
      const office_hours = document.getElementById("office_hours").value;
      
      if (!id_employee || !of_date || !office_hours) {
        alert("Please fill in all required fields (marked with *)");
        return;
      }
      
      // Validate office hours
      if (office_hours < 0 || office_hours > 24) {
        alert("Office hours must be between 0 and 24");
        return;
      }
      
      // Validate overtime
      const over_time = document.getElementById("over_time").value;
      if (over_time && over_time < 0) {
        alert("Overtime hours cannot be negative");
        return;
      }
      
      // Validate late time
      const late_time = document.getElementById("late_time").value;
      if (late_time && late_time < 0) {
        alert("Late time cannot be negative");
        return;
      }
      
      // Here you would typically send the data to your server
      const formData = new FormData(attendanceForm);
      const data = Object.fromEntries(formData.entries());
      
      console.log("New attendance data:", data);
      alert("Attendance record added successfully! (This would connect to your backend in a real application)");
      
      // In a real application, you would add the row to the table here
      // Attendance._instanceTable.addRow(data, true);
      
      closeModal();
    });
  }

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
    Attendance._instanceTable.on("cellEdited", cell => {
      if (cell.getValue() === "" || cell.getValue() === null) {
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