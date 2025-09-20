<div id="employees-app">
  <div class="fillter-container">
    <div class="filter-block">
      <span><h3>Field:</h3></span>
      <select class="input-field" id="filter-field">
        <option value="">--Select--</option>
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
        <option value="hierarchy.name_position">Hierarchy</option>
        <option value="status">Status</option>
        <option value="description">Description</option>
        <option value="created_at">Created At</option>
        <option value="updated_at">Updated At</option>
      </select>
    </div>

    <div class="filter-block">
      <span><h3>Type:</h3></span>
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
      <span><h3>Value:</h3></span>
      <input class="input-field" id="filter-value" type="text" placeholder="Value to filter">
    </div>

    <div class="filter-block">
      <button class="input-field" id="filter-clear">Clear Filter</button>
    </div>

    <input class="input-field" type="text" id="employee-search-input" placeholder="Search...">
    <button class="add-row-btn">Add Employee</button>
    <button class="delete-selected-btn">Delete Selected</button>
  </div>

  <div id="tabulator-table-theme" style="height:600px;"></div>
</div>

<script>
  function initEmployeesTable() {
    const tableEl = document.getElementById("tabulator-table-theme");
    if (!tableEl) return;

    const table = new Tabulator("#tabulator-table-theme", {
      layout: "fitDataStretch",
      ajaxURL: "/api/employees",
      ajaxConfig: "GET",
      placeholder: "No Data Set",
      selectable: true,
      columns: [
        {title:"ID", field:"id_employee"},
        {title:"Name", field:"name"},
        {title:"Gender", field:"gender"},
        {title:"CCCD", field:"cccd"},
        {title:"Date of Birth", field:"date_of_birth"},
        {title:"Address", field:"address"},
        {title:"Email", field:"email"},
        {title:"Phone", field:"phone"},
        {title:"Bank Infor", field:"bank_infor"},
        {title:"Hire Date", field:"hire_date"},
        {title:"Hierarchy", field:"hierarchy.name_position"},
        {title:"Status", field:"status"},
        {title:"Description", field:"description"},
        {title:"Created At", field:"created_at"},
        {title:"Updated At", field:"updated_at"}
      ]
    });

    // Filter input
    document.getElementById("filter-value").addEventListener("keyup", () => {
      const field = document.getElementById("filter-field").value;
      const type = document.getElementById("filter-type").value;
      const value = document.getElementById("filter-value").value;
      if (field && value) {
        table.setFilter(field, type, value);
      }
    });

    document.getElementById("filter-clear").addEventListener("click", () => {
      table.clearFilter();
      document.getElementById("filter-value").value = "";
    });

    // Search input
    document.getElementById("employee-search-input").addEventListener("keyup", (e) => {
      const val = e.target.value;
      table.setFilter([
        {field:"name", type:"like", value:val},
        {field:"email", type:"like", value:val},
        {field:"phone", type:"like", value:val}
      ]);
    });

    // Add row example
    document.querySelector(".add-row-btn").addEventListener("click", () => {
      table.addRow({name:"New Employee"});
    });

    // Delete selected
    document.querySelector(".delete-selected-btn").addEventListener("click", () => {
      const selected = table.getSelectedRows();
      selected.forEach(row => row.delete());
    });
  }

  // Init table khi page load vào SPA
  window.initEmployeesTable?.();
</script>
