// EmployeesTab.js
class Employee_Information {
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
              <option value="id_employee">ID</option>
              <option value="name">Name</option>
              <option value="gender">Gender</option>
              <option value="cccd">CCCD</option>
              <option value="date_of_birth">Date of Birth</option>
              <option value="address">Address</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="bank_infor">Bank Infor</option>
              <option value="hire_date">Hire Date</option>
              <option value="status">Status</option>
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
            <input type="text" id="employee-search-input" placeholder="Search employees...">
          </div>
          
          <div class="filter-block">
            <button class="add-row-btn" id="open-modal-btn"><i class="fas fa-plus-circle"></i> Add</button>
          </div>
          
          <div class="filter-block">
            <button class="delete-selected-btn" data-tab="employeeTab"><i class="fas fa-trash-alt"></i> Delete</button>
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
    <div id="add-employee-modal" class="modal">
      <div class="modal-content" style="margin: 5% auto">
        <div class="modal-header">
          <h2><i class="fas fa-user-plus"></i> Add New Employee</h2>
          <span class="close">&times;</span>
        </div>
        <div class="modal-body">
          <form id="employee-form">
            <div class="form-row">
              <div class="form-group">
                <label for="name">Full Name *</label>
                <input type="text" id="name" name="name" required>
              </div>
              <div class="form-group">
                <label for="gender">Gender</label>
                <select id="gender" name="gender">
                  <option value="1">Male</option>
                  <option value="0">Female</option>
                  <option value="3">Unknown</option>
                </select>
              </div>
              <div class="form-group">
                <label for="cccd">CCCD *</label>
                <input type="text" id="cccd" name="cccd" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="date_of_birth">Date of Birth</label>
                <input type="date" id="date_of_birth" name="date_of_birth">
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email">
              </div>
              <div class="form-group">
                <label for="phone">Phone *</label>
                <input type="tel" id="phone" name="phone" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="bank_infor">Bank Information</label>
                <input type="text" id="bank_infor" name="bank_infor">
              </div>
              <div class="form-group">
                <label for="hire_date">Hire Date</label>
                <input type="date" id="hire_date" name="hire_date">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group-full">
                <label for="address">Address</label>
                <textarea id="address" name="address" placeholder="Full address"></textarea>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group-full">
                <label for="description">Description</label>
                <textarea id="description" name="description" placeholder="Employee description"></textarea>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" id="cancel-btn"><i class="fas fa-times"></i> Cancel</button>
          <button class="btn-submit" id="submit-btn"><i class="fas fa-check"></i> Add Employee</button>
        </div>
      </div>
    </div>
  `;

  // Tabulator config
  static _cfgTable = {
    selector: "#tabulator-table",
    tableName: "employees",
    searchInput: "#employee-search-input",
    primaryKey: "id_employee",
    columns: [
      { title: "ID", field: "id_employee", editor: false },
      { title: "Name", field: "name", editor: "input" },
      {
        title: "Gender", field: "gender", editor: "list",
        editorParams: { values: { "1": "Male", "0": "Female", "3": "Unknown" } },
        formatter: "lookup", formatterParams: { "1": "Male", "0": "Female", "3": "Unknown" }
      },
      { title: "CCCD", field: "cccd", editor: "input" },
      { title: "Date of Birth", field: "date_of_birth", editor: "date" },
      { title: "Address", field: "address", editor: "input" },
      { title: "Email", field: "email", editor: "input" },
      { title: "Phone", field: "phone", editor: "input" },
      { title: "Bank Infor", field: "bank_infor", editor: "input" },
      { title: "Hire Date", field: "hire_date", editor: false },
      {
        title: "Status", field: "status", editor: "list",
        editorParams: { values: { "active": "active", "inactive": "inactive", "resigned": "resigned" } },
    
    
      formatter: function (cell) {
        const value = cell.getValue();
        let color = "";
        let label = "";

        switch (value) {
          case "active":
            color = "green";
            label = "Active";
            break;
          case "inactive":
            color = "orange";
            label = "Inactive";
            break;
          case "resigned":
            color = "red";
            label = "Resigned";
            break;
          default:
            color = "gray";
            label = value;
        }

        return `<span style="
      background:${color}; 
      color:white; 
      padding:2px 6px; 
      border-radius:12px; 
      font-size:12px;">
        ${label}
    </span>`;
      }},
      { title: "Description", field: "description", editor: false },
    ]
  };

  // --- Singleton getInstance ---
  static getInstance() {
  if (!Employee_Information._instance) {
    Employee_Information._instance = new Employee_Information();
  }
  return Employee_Information._instance;
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
  return Employee_Information._html;
}

// --- Setup filters ---
setupFilters() {
  const table = Employee_Information._instanceTable;
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
  const searchInput = document.getElementById(Employee_Information._cfgTable.searchInput);
  if (searchInput) {
    searchInput.addEventListener("keyup", e => {
      table.setFilter([
        { field: "name", type: "like", value: e.target.value },
        { field: "email", type: "like", value: e.target.value },
        { field: "phone", type: "like", value: e.target.value }
      ]);
    });
  }
}

// --- Setup modal functionality ---
setupModal() {
  const modal = document.getElementById("add-employee-modal");
  const openModalBtn = document.getElementById("open-modal-btn");
  const closeModalBtn = document.querySelector(".close");
  const cancelBtn = document.getElementById("cancel-btn");
  const submitBtn = document.getElementById("submit-btn");
  const employeeForm = document.getElementById("employee-form");

  // Open modal
  openModalBtn.addEventListener("click", function () {
    modal.style.display = "block";
  });

  // Close modal
  const closeModal = () => {
    modal.style.display = "none";
    employeeForm.reset();
  };

  closeModalBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);

  // Form submission
  submitBtn.addEventListener("click", async function () {
    // Basic validation
    const name = document.getElementById("name").value;
    const cccd = document.getElementById("cccd").value;
    const phone = document.getElementById("phone").value;

    if (!name || !cccd || !phone) {
      alert("Please fill in all required fields (marked with *)");
      return;
    }

    // Here you would typically send the data to your server
    const formData = new FormData(employeeForm);
    const data = Object.fromEntries(formData.entries());

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    try {
      const res = await fetch(`/modelController/${Employee_Information._cfgTable.tableName}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrfToken },
          body: JSON.stringify(data)
        });

      const result = await res.json();

      if (res.ok) {
        alert("Employee_Information added successfully!");
        // Thêm row vào Tabulator
        Employee_Information._instanceTable.addRow(data, true);
        closeModal();
        console.log(Employee_Information._cfgTable);
        console.log("New Employee_Information data:", data);
        alert("Employee_Information added successfully! (This would connect to your backend in a real application)");

      }
      else {
        // Nếu server trả lỗi validation
        alert("Error: " + (result.message || "Invalid input"));
      }
    }
    catch (err) {
      console.error(err);
      alert("Network or server error");
      console.log(JSON.stringify(data));
      console.log(Employee_Information._cfgTable?.tableName);

    }



    closeModal();
  });


}
// --- Create Tabulator table ---
createTable() {
  if (Employee_Information._instanceTable) return;

  const cfg = Employee_Information._cfgTable;
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

  Employee_Information._instanceTable = new Tabulator(cfg.selector, {
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
      resizableColumnFit: false,
      width: 20,
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
  Employee_Information._instanceTable.on("rowSelectionChanged", data => {
    const stats = document.querySelector(".select-stats");
    if (stats) stats.innerHTML = `<i class="fas fa-check-circle"></i> Selected: ${data.length}`;
  });

  // Cell edit validation
  Employee_Information._instanceTable.on("cellEdited", cell => {
    if (cell.getValue() === "" || cell.getValue() === null) {
      cell.setValue(cell.getOldValue(), true);
    }
  });
}

// --- Render table vào container ---
render(container)
{
  container.innerHTML = this.getHTML();

  if (!Employee_Information._instanceTable) {
    this.createTable();
  } else {
    // Reattach bảng vào div mới
    const tableDiv = container.querySelector(Employee_Information._cfgTable.selector);
    tableDiv.appendChild(Employee_Information._instanceTable.element);
  }

  // Thiết lập bộ lọc và tìm kiếm
  this.setupFilters();

  // Thiết lập modal
  this.setupModal();
}

}

