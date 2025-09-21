// Hierarchy.js
class Hierarchy {
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
              <option value="id_hierarchy">ID Hierachy</option>
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
            <input type="text" id="hierarchy-search-input" placeholder="Search hierarchies...">
          </div>
          
          <div class="filter-block">
            <button class="add-row-btn" id="open-modal-btn"><i class="fas fa-plus-circle"></i> Add</button>
          </div>
          
          <div class="filter-block">
            <button class="delete-selected-btn" data-tab="hierarchyTab"><i class="fas fa-trash-alt"></i> Delete</button>
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
    <div id="add-hierarchy-modal" class="modal">
      <div class="modal-content" style="margin: 10% auto">
        <div class="modal-header">
          <h2><i class="fas fa-layer-group"></i> Add New Hierarchy</h2>
          <span class="close">&times;</span>
        </div>
        <div class="modal-body">
          <form id="hierarchy-form"> @csrf
          
            <div class="form-row">
              <div class="form-group">
                <label for="name_position">Position Name *</label>
                <input type="text" id="name_position" name="name_position" required>
              </div>
              <div class="form-group">
                <label for="name_level">Level Name *</label>
                <input type="text" id="name_level" name="name_level" required>
              </div>
              <div class="form-group">
                <label for="salary_multiplier">Salary Multiplier *</label>
                <input type="number" id="salary_multiplier" name="salary_multiplier" step="0.01" min="0" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="allowance">Allowance *</label>
                <input type="number" id="allowance" name="allowance" step="0.01" min="0" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group-full">
                <label for="description">Description</label>
                <textarea id="description" name="description" placeholder="Hierarchy description"></textarea>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" id="cancel-btn"><i class="fas fa-times"></i> Cancel</button>
          <button class="btn-submit" id="submit-btn"><i class="fas fa-check"></i> Add Hierarchy</button>
        </div>
      </div>
    </div>
  `;

  // Tabulator config
  static _cfgTable = {
    selector: "#tabulator-table",
    tableName: "hierarchys",
    searchInput: "#hierarchy-search-input",
    primaryKey: "id_hierarchy",
    columns: [
      { title: "ID Hierarchy", field: "id_hierarchy", editor: false },
      { title: "Position", field: "name_position", editor: "input" },
      { title: "Level", field: "name_level", editor: "input" },
      {
        title: "Salary Multiplier",
        field: "salary_multiplier",
        editor: "number",
        editorParams: { step: 0.01, min: 0 },
        formatter: "money",
        formatterParams: {
          symbol: "",
          precision: 2,
          thousand: ",",
          decimal: "."
        }
      },
      {
        title: "Allowance",
        field: "allowance",
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
      { title: "Description", field: "description", editor: "textarea" },
      {
        title: "Create At",
        field: "created_at",
        editor: false,
        formatter: Hierarchy.formatDate
      },
      {
        title: "Update At",
        field: "updated_at",
        editor: false,
        formatter: Hierarchy.formatDate
      }
    ]
  };

  // --- Singleton getInstance ---
  static getInstance() {
    if (!Hierarchy._instance) {
      Hierarchy._instance = new Hierarchy();
    }
    return Hierarchy._instance;
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
    return Hierarchy._html;
  }

  // --- Setup filters ---
  setupFilters() {
    const table = Hierarchy._instanceTable;
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
    const searchInput = document.getElementById(Hierarchy._cfgTable.searchInput);
    if (searchInput) {
      searchInput.addEventListener("keyup", e => {
        table.setFilter([
          { field: "name_position", type: "like", value: e.target.value },
          { field: "name_level", type: "like", value: e.target.value },
          { field: "description", type: "like", value: e.target.value }
        ]);
      });
    }
  }

  // --- Setup modal functionality ---
  setupModal() {
    const modal = document.getElementById("add-hierarchy-modal");
    const openModalBtn = document.getElementById("open-modal-btn");
    const closeModalBtn = document.querySelector(".close");
    const cancelBtn = document.getElementById("cancel-btn");
    const submitBtn = document.getElementById("submit-btn");
    const hierarchyForm = document.getElementById("hierarchy-form");

    // Open modal
    openModalBtn.addEventListener("click", function () {
      modal.style.display = "block";
    });

    // Close modal
    const closeModal = () => {
      modal.style.display = "none";
      hierarchyForm.reset();
    };

    closeModalBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);

    // Form submission
    submitBtn.addEventListener("click", async function () {
      // Basic validation
      const name_position = document.getElementById("name_position").value;
      const name_level = document.getElementById("name_level").value;
      const salary_multiplier = document.getElementById("salary_multiplier").value;
      const allowance = document.getElementById("allowance").value;

      if (!name_position || !name_level || !salary_multiplier || !allowance) {
        alert("Please fill in all required fields (marked with *)");
        return;
      }

      // Here you would typically send the data to your server
      const formData = new FormData(hierarchyForm);
      const data = Object.fromEntries(formData.entries());

      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

      try 
      {
        const res = await fetch(`/modelController/${Hierarchy._cfgTable.tableName}`, 
       {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrfToken},
          body: JSON.stringify(data)
        }); 

        const result = await res.json();

        if (res.ok) 
        {
          alert("hierarchy added successfully!");
          // Thêm row vào Tabulator
          Hierarchy._instanceTable.addRow(result, true);
          closeModal();
          console.log(Hierarchy._cfgTable);
          console.log("New hierarchy data:", data);
          alert("Hierarchy added successfully! (This would connect to your backend in a real application)");

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
        console.log(Hierarchy._cfgTable?.tableName);
          
      }

      closeModal();
    });
  }

  
  // --- Setup delete functionality ---
  setupDeleteButton() {
    const deleteBtn = document.querySelector('.delete-selected-btn[data-tab="hierarchyTab"]');
    if (!deleteBtn || !Hierarchy._instanceTable) return;

    deleteBtn.addEventListener('click', async () => {
      const selectedRows = Hierarchy._instanceTable.getSelectedRows();
      
      if (selectedRows.length === 0) {
        alert('Please select at least one record to delete.');
        return;
      }

      // Kiểm tra xem hierarchy có đang được sử dụng bởi employees không
      try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        const checkPromises = [];
        
        for (const row of selectedRows) {
          const id = row.getData().id_hierarchy;
          const checkPromise = fetch(`/modelController/hierarchy//${id}checkHierarchyUsage`, {
            method: 'GET',
            headers: {
              'X-CSRF-TOKEN': csrfToken
            }
          }).then(res => res.json());
          checkPromises.push(checkPromise);
        }
        
        // Chờ tất cả các yêu cầu kiểm tra hoàn thành
        const results = await Promise.allSettled(checkPromises);
        
        let canDeleteAll = true;
        const cannotDeleteIds = [];
        
        results.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value.inUse) {
            canDeleteAll = false;
            cannotDeleteIds.push(selectedRows[index].getData().id_hierarchy);
          }
        });
        
        if (!canDeleteAll) {
          alert(`Cannot delete hierarchy with ID(s): ${cannotDeleteIds.join(', ')}. These hierarchies are currently in use by employees.`);
          return;
        }
        
        // Xác nhận xóa
        if (!confirm(`Are you sure you want to delete ${selectedRows.length} records?`)) {
          return;
        }

        // Thực hiện xóa các bản ghi
        const deletePromises = [];
        
        for (const row of selectedRows) {
          const id = row.getData().id_hierarchy;
          const deletePromise = fetch(`/modelController/${Hierarchy._cfgTable.tableName}/${id}`, {
            method: 'DELETE',
            headers: {
              'X-CSRF-TOKEN': csrfToken
            }
          });
          deletePromises.push(deletePromise);
        }
        
        // Chờ tất cả các yêu cầu xóa hoàn thành
        const deleteResults = await Promise.allSettled(deletePromises);
        
        // Kiểm tra kết quả
        let successCount = 0;
        let failCount = 0;
        
        deleteResults.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value.ok) {
            successCount++;
          } else {
            failCount++;
            console.error(`Error deleting record ${selectedRows[index].getData().id_hierarchy}:`, result.reason || result.value);
          }
        });
        
        // Thông báo kết quả
        if (successCount > 0) {
          alert(`Successfully deleted ${successCount} records.`);
          
          // Làm mới bảng để cập nhật dữ liệu
          Hierarchy._instanceTable.setData();
          
          // Bỏ chọn tất cả các hàng
          Hierarchy._instanceTable.deselectRow();
        }
        
        if (failCount > 0) {
          alert(`${failCount} records failed to delete. Please try again.`);
        }
        
      } catch (error) {
        console.error('Error deleting records:', error);
        alert('An error occurred while deleting records. Please try again.');
      }
    });
  }

  // --- Create Tabulator table ---
  createTable() {
    if (Hierarchy._instanceTable) return;

    const cfg = Hierarchy._cfgTable;
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    Hierarchy._instanceTable = new Tabulator(cfg.selector, {
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
    Hierarchy._instanceTable.on("rowSelectionChanged", data => {
      const stats = document.querySelector(".select-stats");
      if (stats) stats.innerHTML = `<i class="fas fa-check-circle"></i> Selected: ${data.length}`;
    });

    // Cell edit validation - CHỈ CHO PHÉP SỬA CÁC Ô CÓ EDITOR KHÁC FALSE
    Hierarchy._instanceTable.on("cellEditing", function(cell){
      const columnDefinition = cell.getColumn().getDefinition();
      if (columnDefinition.editor === false) {
        return false; // Ngăn không cho edit
      }
    });

    // Xử lý khi cell được edit
    Hierarchy._instanceTable.on("cellEdited", async cell => {
      const columnDefinition = cell.getColumn().getDefinition();
      
      // Chỉ xử lý nếu ô được phép edit
      if (columnDefinition.editor !== false) {
        const newValue = cell.getValue();
        const oldValue = cell.getOldValue();

        if (newValue === null || newValue === "" || newValue === oldValue) {
          cell.setValue(oldValue, true);
          return;
        }

        try {
          const rowData = cell.getRow().getData();
          const field = cell.getField();
          const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

          const url = `/modelController/${Hierarchy._cfgTable.tableName}/${rowData.id_hierarchy}`;
          const payload = { [field]: newValue };

          const resPut = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrfToken },
            body: JSON.stringify(payload)
          });

          if (!resPut.ok) {
            alert("Update failed.");
            cell.setValue(cell.getOldValue(), true);
            return;
          }

          console.log("Update successful");

        } catch (err) {
          console.error(err);
          cell.setValue(cell.getOldValue(), true);
        }
      }
    });
  }

  // --- Render table vào container ---
  render(container) {
    container.innerHTML = this.getHTML();

    if (!Hierarchy._instanceTable) {
      this.createTable();
    } else {
      const tableDiv = container.querySelector(Hierarchy._cfgTable.selector);
      tableDiv.appendChild(Hierarchy._instanceTable.element);
    }

    this.setupFilters();
    this.setupModal();
    this.setupDeleteButton();
  }
}