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
            <input type="text" id="payroll-rule-search-input" placeholder="Search payroll rules...">
          </div>
          
          <div class="filter-block">
            <button class="add-row-btn" id="open-modal-btn"><i class="fas fa-plus-circle"></i> Add</button>
          </div>
          
          <div class="filter-block">
            <button class="delete-selected-btn" data-tab="payrollRuleTab"><i class="fas fa-trash-alt"></i> Delete</button>
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
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
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
                <label for="expiry_date">Expiry Date</label>
                <input type="date" id="expiry_date" name="expiry_date">
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
      { title: "Type",  field: "type",  editor: "input"},
      { 
        title: "Value Type", 
        field: "value_type", 
        editor: "list", 
        editorParams: { values: { "percentage": "Percentage", "fixed": "Fixed Amount" } }
      },
      { 
        title: "Value", 
        field: "value", 
        editor: "number",
        editorParams: { step: 0.01 },
        formatter: function(cell) {
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
        }
      },
      { title: "Description", field: "description", editor: "textarea" },
      { 
        title: "Create At", 
        field: "created_at", 
        editor: false, 
        formatter: Payroll_Rule.formatDate 
      },
      { 
        title: "Update At", 
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
    return date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
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

    // Open modal
    openModalBtn.addEventListener("click", function() {
      modal.style.display = "block";
    });

    // Close modal
    const closeModal = () => {
      modal.style.display = "none";
      payrollRuleForm.reset();
    };

    closeModalBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);

    // Form submission
    submitBtn.addEventListener("click", async function() {
      // Basic validation
      const type = document.getElementById("type").value;
      const value_type = document.getElementById("value_type").value;
      const value = document.getElementById("value").value;
      const effective_date = document.getElementById("effective_date").value;
      
      if (!type || !value_type || !value || !effective_date) {
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
      
      // Here you would typically send the data to your server
      const formData = new FormData(payrollRuleForm);
      const data = Object.fromEntries(formData.entries());
      
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

      try 
      {
        const res = await fetch(`/modelController/${Payroll_Rule._cfgTable.tableName}`, 
       {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrfToken},
          body: JSON.stringify(data)
        }); 

        const result = await res.json();

        if (res.ok) 
        {
          alert("Payroll_Rule added successfully!");
          // Thêm row vào Tabulator
          Payroll_Rule._instanceTable.addRow(data, true);
          closeModal();
          console.log(Payroll_Rule._cfgTable);
          console.log("New Payroll_Rule data:", data);
          alert("Payroll_Rule added successfully! (This would connect to your backend in a real application)");

        } 
        else 
        {
          // Nếu server trả lỗi validation
          alert("Error: " + (result.message || "Invalid input"));
        }
      } 
      catch (err) 
      {
        console.error(err);
        alert("Network or server error");
        console.log(JSON.stringify(data));
        console.log(Payroll_Rule._cfgTable?.tableName);
          
      }


      
      closeModal();
    });
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
    Payroll_Rule._instanceTable.on("cellEdited", cell => {
      if (cell.getValue() === "" || cell.getValue() === null) {
        cell.setValue(cell.getOldValue(), true);
      }
    });
  }

  // --- Render table vào container ---
  render(container) {
    container.innerHTML = this.getHTML();

    if (!Payroll_Rule._instanceTable) {
      this.createTable();
    } else {
      // Reattach bảng vào div mới
      const tableDiv = container.querySelector(Payroll_Rule._cfgTable.selector);
      tableDiv.appendChild(Payroll_Rule._instanceTable.element);
    }

    // Setup filters và search
    this.setupFilters();
    
    // Thiết lập modal
    this.setupModal();
  }
}