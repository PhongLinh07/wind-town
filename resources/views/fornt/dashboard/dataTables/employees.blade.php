<!-- https://wind-town.test/dataTables/employees -->
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

/* === Tabulator general === */
.tabulator {
    position: relative;
    font-family: sans-serif;
    font-size: 14px;
    text-align: left;
    border: 1px solid #282828;
    border-radius: 6px;
    overflow: hidden;
    background-color: #111;
}

/* === Tabulator header === */
.tabulator .tabulator-header {
    background-color: #222;
    color: #fff;
    font-weight: bold;
    border-bottom: 3px solid #3FB449;
    white-space: nowrap;
    overflow: hidden;
    user-select: none;
}

/* Header text wrap */
.tabulator .tabulator-header .tabulator-col,
.tabulator .tabulator-header .tabulator-col-row-handle {
    white-space: normal;
}

/* === Table rows === */
.tabulator .tabulator-row {
    color: #fff;
    background-color: #333;
    transition: background-color 0.2s;
}

.tabulator .tabulator-row:nth-child(even) {
    background-color: #2a2a2a;
}

.tabulator .tabulator-row:hover {
    background-color: #444;
}

.tabulator .tabulator-row.tabulator-selected {
    background-color: #1e90ff;
    color: #fff;
}

/* === Cells === */
.tabulator .tabulator-cell {
    padding: 8px 12px;
    border-right: 1px solid #444;
}

.tabulator .tabulator-cell:last-child {
    border-right: none;
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
}

button:hover {
    background: linear-gradient(to bottom, #25682a 0%, #3FB449 100%);
    opacity: 0.9;
}
.input-field 
{
            width: 10%;
            padding: 14px 10px;
            border: 1px solid #000000;
            border-radius: 6px;
            font-size: 17px;
            color: #00ffeaff;
            box-sizing: border-box;
            background-color: #333333;
            margin-bottom: 15px;
          
}
.input-group 
        {
            margin: 15px;
        }

        .fillter-container {
          justify-content: center;
            align-items: center;
          width: 100%;
            border-radius: 8px;
         
          background-color: #000000ff;
        display: flex;           /* xếp các phần tử con theo hàng ngang */
        gap: 40px;               /* khoảng cách giữa các nút */
        padding: 14px 10px;
        justify-content:flex-start;
}
body 
        {
            font-family: Arial, sans-serif;
            background-color: rgba(51, 51, 51, 1); /* Nền màu tối */
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
  <span><h3>Field:</h3></span>
  <select class="input-field"id="filter-field">
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
    <option value="hierarchy.name_position">Hierarchy</option>
    <option value="status">Status</option>
    <option value="description">Description</option>
    <option value="created_at">Create At</option>
    <option value="updated_at">Update At</option>
  </select>

  <span><h3>Type::</h3></span>
  <select class="input-field" id="filter-type">
    <option value="=">=</option>
    <option value="<"><</option>
    <option value="<="><=</option>
    <option value=">">></option>
    <option value=">=">>=</option>
    <option value="!=">!=</option>
    <option value="like">like</option>
  </select>

  <span><h3>Value:</h3></span>
  <input class="input-field" id="filter-value" type="text" placeholder="value to filter">

  <button class="input-field"id="filter-clear">Clear Filter</button>

  <input class="input-field" type="text" id="employee-search-input" placeholder="Tìm kiếm..." >
</div>



<div>
  <div class="search-container">
    
    <button class="add-row-btn" data-tab="employeeTab">Add Employee</button>
    <button class="delete-selected-btn" data-tab="employeeTab">Delete Selected</button>
    <span class="select-stats"></span>
  </div>
  <div class="tabulator-table-theme", id="tabulator-table-theme"></div>
      </div>

  <script>
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

      //Define variables for input elements
      var fieldEl = document.getElementById("filter-field");
      var typeEl = document.getElementById("filter-type");
      var valueEl = document.getElementById("filter-value");

      //Custom filter example
      function customFilter(data)
      {
          return data.car && data.rating < 3;
      }

      //Trigger setFilter function with correct parameters
      function updateFilter()
      {
        var filterVal = fieldEl.options[fieldEl.selectedIndex].value;
        var typeVal = typeEl.options[typeEl.selectedIndex].value;

        var filter = filterVal == "function" ? customFilter : filterVal;

        if(filterVal == "function" )
        {
          typeEl.disabled = true;
          valueEl.disabled = true;
        }else
        {
          typeEl.disabled = false;
          valueEl.disabled = false;
        }

        if(filterVal)
        {
          instance.setFilter(filter.toLowerCase(),typeVal.toLowerCase(), valueEl.value.toLowerCase());
        }
      }

      
      //Update filters on value change
      document.getElementById("filter-field").addEventListener("change", updateFilter);
      document.getElementById("filter-type").addEventListener("change", updateFilter);
      document.getElementById("filter-value").addEventListener("keyup", updateFilter);

      //Clear filters on "Clear Filters" button click
      document.getElementById("filter-clear").addEventListener("click", function()
      {
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
        tableName: "employees",
        searchInput: "employee-search-input",
        primaryKey: "id_employee",
        columns: [
          { title: "ID", field: "id_employee", editor: false},
          { title: "Name", field: "name", editor: "input"},
          { title: "Gender", field: "gender", editor: "list", editorParams:{values:{"1":"Male", "0":"Female", "3":"Unknown"}}, formatter: "lookup", formatterParams:{"1":"Male", "0":"Female", "3":"Unknown"}},
          { title: "CCCD", field: "cccd", editor: "input"},
          { title: "Date of Birth", field: "date_of_birth", editor: "input" },
          { title: "Address", field: "address", editor: "input",},    
          { title: "Email", field: "email", editor: "input"},
          { title: "Phone", field: "phone", editor: "input"},
          { title: "Bank Infor", field: "bank_infor", editor: "input"},
          { title: "Hire Date", field: "hire_date", editor: "input" },
          { title: "Hierarchy", field: "hierarchy.name_position", editor:"list", editorParams:{valuesURL: "/modelController/hierarchys/getColumn/name_position", ajaxFiltering: true }},
          { title: "Status", field: "status", editor:"list", editorParams:{values:{"active":"active", "inactive":"inactive", "resigned":"resigned"}, headerFilter:"list"}},
          { title: "Description", field: "description", editor: false},
          { title: "Create At", field: "created_at", editor: false },
          { title: "Update At", field: "updated_at", editor: false }
        ]
    };

    // Hàm tạo bảng
    async function createTable() 
    {

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
        paginationCounter:"pages",
        paginationButtonCount: 0,
        index: cfg.primaryKey,
        columns: cfg.columns,
        rowSelectionChanged: function (data, rows) 
        {
          const stats = document.querySelector(".select-stats");
          if (stats) stats.innerHTML = `Rows selected: ${data.length}`;
        }
      });

      instance.on("cellEdited", function(cell)
      {
        if(cell.getValue() === "" || cell.getValue() === null)
        {
            cell.setValue(cell.getOldValue(), true);
        }        
      });




      // Filter search
      const searchInput = document.querySelector(cfg.searchInput);
      if (searchInput) {
        searchInput.addEventListener("keyup", e => {
          instance.setFilter([
            {field:"name", type:"like", value:e.target.value},
            {field:"email", type:"like", value:e.target.value},
            {field:"phone", type:"like", value:e.target.value}
          ]);
        });
      }
    }

    
    // chạy ngay khi load trang
    createTable();
  </script>
</body>
</html>
