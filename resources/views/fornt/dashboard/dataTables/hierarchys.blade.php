<!-- https://wind-town.test/dataTables/hierarchys -->
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="csrf-token" content="{{ csrf_token() }}">

  <title>Tabulator CRUD Multi-Tab</title>
  <!-- Tabulator CSS -->
  <link href="/css/tabulator.min.css" rel="stylesheet">
  <!-- Tabulator JS UMD đầy đủ -->
  <script src="/js/tabulator.min.js"></script>


  <style>
    /* === Body / Page === */
/*Theme the Tabulator element*/
#example-table-theme{
    background-color:#ccc;
    border: 1px solid #333;
    border-radius: 10px;
}

/*Theme the header*/
#example-table-theme .tabulator-header {
    background-color:#333;
    color:#fff;
}

/*Allow column header names to wrap lines*/
#example-table-theme .tabulator-header .tabulator-col,
#example-table-theme .tabulator-header .tabulator-col-row-handle {
    white-space: normal;
}

/*Color the table rows*/
#example-table-theme .tabulator-tableholder .tabulator-table .tabulator-row{
    color:#fff;
    background-color: #666;
}

/*Color even rows*/
    #example-table-theme .tabulator-tableholder .tabulator-table .tabulator-row:nth-child(even) {
    background-color: #444;
}

    /* === Buttons === */
    button {
      padding: 5px 10px;
      border: 1px solid #256858;
      background: linear-gradient(to bottom, #3FB449 0%, #25682a 100%);
      color: #fff;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s;
      padding: 10px 10px;
    }

    button:hover {
      background: linear-gradient(to bottom, #25682a 0%, #3FB449 100%);
      opacity: 0.9;
    }

    .input-field {
      width: 100%;
      padding: 10px 10px;
      border: 1px solid #000000;
      border-radius: 6px;
      font-size: 17px;
      color: #00ffeaff;
      box-sizing: border-box;
      background-color: #333333;
      

    }

    .input-group {
      margin: 15px;
    }

    .fillter-container {
      display: flex;
      flex-wrap: wrap;
      /* xuống hàng nếu container nhỏ */
      gap: 30px;
      /* khoảng cách giữa các block */
      align-items: center;
      /* căn giữa theo chiều dọc */
      padding: 10px 10px;
      background-color: #dad8d8ff;
      color: #000000;
      border-radius: 8px;
      min-width: 200px;
      border: 1px solid #000000;
    }

    .filter-block {
      display: flex;
      align-items: center;
      flex: 1;
      /* mỗi block chiếm đều không gian */
    }

    body {
      font-family: Arial, sans-serif;
      background-color: rgb(255, 255, 255);
      /* Nền màu tối */
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px 20px;
    }
  </style>


</head>

<body>


  <div class="fillter-container">
    <div class="filter-block">
      <span>
        <h3>Field:</h3>
      </span>
      <select class="input-field" id="filter-field">
        <option></option>
        <option value="id_hierarchy">ID</option>
        <option value="name_position">Position</option>
        <option value="name_level">Level</option>
        <option value="salary_multiplier">Salary Multiplier</option>
        <option value="allowance">Allowance</option>
        <option value="description">Description</option>
        <option value="created_at">Create At</option>
        <option value="updated_at">Update At</option>
      </select>
    </div>

    <div class="filter-block">
      <span>
        <h3>Type:</h3>
      </span>
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
      <span>
        <h3>Value:</h3>
      </span>
      <input class="input-field" id="filter-value" type="text" placeholder="value to filter">
    </div>

    <div class="filter-block">
      <button class="input-field" id="filter-clear">Clear Filter</button>
    </div>
    <input class="input-field" type="text" id="hierarchy-search-input" placeholder="Tìm kiếm...">

    <button class="add-row-btn" data-tab="hierarchyTab">Add Hierarchy</button>
    <button class="delete-selected-btn" data-tab="hierarchyTab">Delete Selected</button>
    <span class="select-stats"></span>
  </div>


  <div>
    <div class="tabulator-table-theme" , id="tabulator-table-theme"></div>
  </div>

  <script>
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    //Define variables for input elements
    var fieldEl = document.getElementById("filter-field");
    var typeEl = document.getElementById("filter-type");
    var valueEl = document.getElementById("filter-value");

    //Custom filter example
    function customFilter(data) {
      return data.car && data.rating < 3;
    }

    //Trigger setFilter function with correct parameters
    function updateFilter() {
      var filterVal = fieldEl.options[fieldEl.selectedIndex].value;
      var typeVal = typeEl.options[typeEl.selectedIndex].value;

      var filter = filterVal == "function" ? customFilter : filterVal;

      if (filterVal == "function") {
        typeEl.disabled = true;
        valueEl.disabled = true;
      } else {
        typeEl.disabled = false;
        valueEl.disabled = false;
      }

      if (filterVal) {
        instance.setFilter(filter.toLowerCase(), typeVal.toLowerCase(), valueEl.value.toLowerCase());
      }
    }


    //Update filters on value change
    document.getElementById("filter-field").addEventListener("change", updateFilter);
    document.getElementById("filter-type").addEventListener("change", updateFilter);
    document.getElementById("filter-value").addEventListener("keyup", updateFilter);

    //Clear filters on "Clear Filters" button click
    document.getElementById("filter-clear").addEventListener("click", function () {
      fieldEl.value = "";
      typeEl.value = "=";
      valueEl.value = "";

      instance.clearFilter();
    });


    let instance; // dùng let để gán lại

    // Table config
    const tableConfig =
    {
      selector: "#tabulator-table-theme",
      tableName: "hierarchys",
      searchInput: "hierarchy-search-input",
      primaryKey: "id_hierarchy",
      columns: [
        { title: "ID", field: "id_hierarchy", editor: false },
        { title: "Position", field: "name_position", editor: "input" },
        { title: "Level", field: "name_level", editor: "input"},
        { title: "Salary Multiplier", field: "salary_mutiplier", editor: "input" },
        { title: "Allowance", field: "allowance", editor: "input" },
        { title: "Description", field: "description", editor: false },
        { title: "Create At", field: "created_at", editor: false, formatter: formatDate},
        { title: "Update At", field: "updated_at", editor: false, formatter: formatDate}
      ]
    };

    function formatDate(cell, formatterParams)
    {
        let value = cell.getValue();
        if(!value) return "";
        let date = new Date(value);
        // Hiển thị dạng: 18/09/2025 20:54
        return date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'});
    }
    
    // Hàm tạo bảng
    async function createTable() {

      const cfg = tableConfig;
      instance = new Tabulator
        (cfg.selector,
          {
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
            rowHeader:
            {
              headerSort: false, resizableColumnFit: false,
              width: 20, headerHozAlign: "center", hozAlign: "center",
              formatter: "rowSelection", titleFormatter: "rowSelection"
            },
          });

      instance.on("rowSelectionChanged", function (data, rows) {
        const stats = document.querySelector(".select-stats");
        if (stats) stats.innerHTML = `Rows selected: ${data.length}`;
      });

      instance.on("cellEdited", function (cell) {
        if (cell.getValue() === "" || cell.getValue() === null) {
          cell.setValue(cell.getOldValue(), true);
        }
      });




      // Filter search
      const searchInput = document.querySelector(cfg.searchInput);
      if (searchInput) {
        searchInput.addEventListener("keyup", e => {
          instance.setFilter([
            { field: "name", type: "like", value: e.target.value },
            { field: "email", type: "like", value: e.target.value },
            { field: "phone", type: "like", value: e.target.value }
          ]);
        });
      }
    }


    // chạy ngay khi load trang
    createTable();
  </script>
</body>

</html>