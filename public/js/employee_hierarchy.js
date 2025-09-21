// Employee_Hierarchy.js
class Employee_Hierarchy {
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
              <option value="hierarchy.name_position">Hierarchy</option>
              <option value="hierarchy.name_level">Level</option>
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
            <input type="text" id="employee-hierarchy-search-input" placeholder="Search employees...">
          </div>
          
          <div class="filter-block">
            <button class="add-row-btn" id="open-modal-btn"><i class="fas fa-plus-circle"></i> Add</button>
          </div>
          
          <div class="filter-block">
            <button class="delete-selected-btn" data-tab="employeeHierarchyTab"><i class="fas fa-trash-alt"></i> Delete</button>
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
    <dive id="add-employee-hierarchy-modal" class="modal" >
      <div class="modal-content" style="margin: 20% auto">
        <div class="modal-header">
          <h2><i class="fas fa-sitemap"></i> Add Employee Hierarchy</h2>
          <span class="close">&times;</span>
        </div>
        <div class="modal-body">
          <form id="employee-hierarchy-form">
            <div class="form-row">
              <div class="form-group">
                <label for="id_employee">ID Employee*</label>
                <input type="text" id="id_employee" name="id_employee" required>
              </div>
              
              <div class="form-group">
                <label for="hierarchy_id">Hierarchy *</label>
                <input id="hierarchy_id" name="hierarchy_id" required>
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
    searchInput: "employee-hierarchy-search-input",
    primaryKey: "id_employee",
    columns: [
      { title: "ID Employee", field: "id_employee", editor: false },
      { title: "Name", field: "name", editor: false },
      {
        title: "Gender",
        field: "gender",
        editor: false
      },
      {
        title: "Hierarchy",
        field: "hierarchy.name_position",
        editor: false
      },
      {
        title: "Level",
        field: "hierarchy.name_level",
        editor: false
      },


      {
        title: "ID Hierarchy", field: "hierarchy.id_hierarchy", editor: "input",
        formatter: function (cell) {
          const value = cell.getValue();
          return value && value.length > 50 ? value.substring(0, 50) + '...' : value;
        }
      },
    ]
  };

  // --- Singleton getInstance ---
  static getInstance() {
    if (!Employee_Hierarchy._instance) {
      Employee_Hierarchy._instance = new Employee_Hierarchy();
    }
    return Employee_Hierarchy._instance;
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
    return Employee_Hierarchy._html;
  }

  // --- Setup filters ---
  setupFilters() {
    const table = Employee_Hierarchy._instanceTable;
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
    const searchInput = document.getElementById(Employee_Hierarchy._cfgTable.searchInput);
    if (searchInput) {
      searchInput.addEventListener("keyup", e => {
        table.setFilter([
          { field: "name", type: "like", value: e.target.value },
          { field: "hierarchy.name_position", type: "like", value: e.target.value },
          { field: "status", type: "like", value: e.target.value }
        ]);
      });
    }
  }

  // --- Load hierarchy options for modal ---
  async loadHierarchyOptions() {
    try {
      const response = await fetch('/modelController/hierarchys/getColumn/name_position');
      const hierarchies = await response.json();

      const hierarchySelect = document.getElementById('hierarchy_id');
      if (hierarchySelect) {
        // Clear existing options except the first one
        while (hierarchySelect.options.length > 1) {
          hierarchySelect.remove(1);
        }

        // Add new options
        hierarchies.forEach(hierarchy => {
          const option = document.createElement('option');
          option.value = hierarchy.id;
          option.textContent = hierarchy.name_position;
          hierarchySelect.appendChild(option);
        });
      }
    } catch (error) {
      console.error('Error loading hierarchy options:', error);
    }
  }

  // --- Setup modal functionality ---
  setupModal() {
    const modal = document.getElementById("add-employee-hierarchy-modal");
    const openModalBtn = document.getElementById("open-modal-btn");
    const closeModalBtn = document.querySelector(".close");
    const cancelBtn = document.getElementById("cancel-btn");
    const submitBtn = document.getElementById("submit-btn");
    const employeeHierarchyForm = document.getElementById("employee-hierarchy-form");

    // Open modal
    openModalBtn.addEventListener("click", async function () {
      // Load hierarchy options when modal opens
      await Employee_Hierarchy._instance.loadHierarchyOptions();
      modal.style.display = "block";
    });

    // Close modal
    const closeModal = () => {
      modal.style.display = "none";
      employeeHierarchyForm.reset();
    };

    closeModalBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);

    // Form submission
    submitBtn.addEventListener("click", function () {
      // Basic validation
      const name = document.getElementById("name").value;
      const gender = document.getElementById("gender").value;
      const hierarchy_id = document.getElementById("hierarchy_id").value;
      const status = document.getElementById("status").value;

      if (!name || !gender || !hierarchy_id || !status) {
        alert("Please fill in all required fields (marked with *)");
        return;
      }

      // Here you would typically send the data to your server
      const formData = new FormData(employeeHierarchyForm);
      const data = Object.fromEntries(formData.entries());

      console.log("New employee hierarchy data:", data);
      alert("Employee added successfully! (This would connect to your backend in a real application)");

      // In a real application, you would add the row to the table here
      // Employee_Hierarchy._instanceTable.addRow(data, true);

      closeModal();
    });
  }

  // --- Create Tabulator table ---
  createTable() {
    if (Employee_Hierarchy._instanceTable) return;

    const cfg = Employee_Hierarchy._cfgTable;
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    Employee_Hierarchy._instanceTable = new Tabulator(cfg.selector, {
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
    Employee_Hierarchy._instanceTable.on("rowSelectionChanged", data => {
      const stats = document.querySelector(".select-stats");
      if (stats) stats.innerHTML = `<i class="fas fa-check-circle"></i> Selected: ${data.length}`;
    });

    // Cell edit validation id_hierarchy
    Employee_Hierarchy._instanceTable.on("cellEdited", async cell => 
    {
        const newValue = cell.getValue();
        const oldValue = cell.getOldValue();

        if (!newValue || newValue === oldValue) 
        {
            cell.setValue(oldValue, true);
            return;
        }

        try 
        {
            // Kiểm tra hierarchy
            const resHierarchy = await fetch(`/modelController/hierarchys/${newValue}`);
            if (!resHierarchy.ok) throw new Error("Hierarchy fetch failed");
            const hierarchyData = await resHierarchy.json();

            if (hierarchyData.id_hierarchy === Number(newValue)) 
            {
              
                const rowData = cell.getRow().getData();
                rowData.id_hierarchy = newValue;

                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

                // PUT employee
                const resPut = await fetch(`/modelController/employees/${rowData.id_employee}`, 
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrfToken },
                    body: JSON.stringify({ id_hierarchy: newValue })
                  });

                  if (!resPut.ok) throw new Error("Employee update failed");
                  const employeeData = await resPut.json();
                 

                  // Cập nhật row Tabulator
                  cell.getRow().update(employeeData);
                } else {
                  cell.setValue(oldValue, true);
                }

          } catch (err) {
            console.error(err);
            cell.setValue(oldValue, true);
          }
        });
  }
  // --- Render table vào container ---
  render(container) {
    container.innerHTML = this.getHTML();

    if (!Employee_Hierarchy._instanceTable) {
      this.createTable();
    } else {
      // Reattach bảng vào div mới
      const tableDiv = container.querySelector(Employee_Hierarchy._cfgTable.selector);
      tableDiv.appendChild(Employee_Hierarchy._instanceTable.element);
    }

    // Setup filters và search
    this.setupFilters();

    // Thiết lập modal
    this.setupModal();
  }
}