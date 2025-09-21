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
              <option value="id_employee">ID Employee</option>
              <option value="approved_by">ID Approved</option>
              <option value="start_date">Start Date</option>
              <option value="end_date">End Date</option>
              <option value="type">Type</option>
              <option value="reason">Reason</option>
              <option value="status">Status</option>
              <option value="description">Description</option>
              <option value="created_at">Create At</option>
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
                  <option value="paid">Paid</option>
                  <option value=unpaid">Unpaid</option>
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
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group full-width">
                <label for="reason">Reason *</label>
                <input type="text" id="reason" name="reason" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group full-width">
                <label for="description">Description</label>
                <textarea id="description" name="description" rows="3"></textarea>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" id="cancel-btn">Cancel</button>
          <button type="button" id="submit-btn">Submit</button>
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
            { title: "Employee ID", field: "id_employee", editor: false },
            { title: "Approved By", field: "approved_by", editor: false },
            {
                title: "Start Date",
                field: "start_date",
                editor: "boll",
                formatter: Leave.formatDate,
                formatterParams: {
                    outputFormat: "YYYY-MM-DD",
                    invalidPlaceholder: "(invalid date)"
                }
            },
            {
                title: "End Date",
                field: "end_date",
                editor: "input",
                formatter: Leave.formatDate,
                formatterParams: {
                    outputFormat: "YYYY-MM-DD",
                    invalidPlaceholder: "(invalid date)"
                }
            },
            {
                title: "Is Paid",
                field: "is_paid",
                editor: "list",
                editorParams: {
                    values: {
                        "1": "Paid",
                        "0": "Unpaid"
                    }
                },
                formatter: "lookup",
                formatterParams: {
                    "1": "Paid",
                    "0": "Unpaid"
                }
            },
            { title: "Reason", field: "reason", editor: "input" },
            {
                title: "Status",
                field: "status",
                editor: "select",
                editorParams: {
                    values: {
                        "pending": "Pending",
                        "approved": "Approved",
                        "rejected": "Rejected",
                    }
                },
                formatter: "lookup",
                formatterParams: {
                    "pending": "⏳ Pending",
                    "approved": "✅ Approved",
                    "rejected": "❌ Rejected",
                },
                cellStyled: function (cell) {
                    const value = cell.getValue();
                    switch (value) {
                        case "pending":
                            cell.getElement().style.color = "orange";
                            break;
                        case "approved":
                            cell.getElement().style.color = "green";
                            break;
                        case "rejected":
                            cell.getElement().style.color = "gray";
                            break;
                        case "cancelled":
                            cell.getElement().style.color = "red";
                            break;
                    }
                }
            },
            { title: "Description", field: "description", editor: "textarea" },
            {
                title: "Create At",
                field: "created_at",
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
                    { field: "is_paid", type: "like", value: e.target.value },
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
        openModalBtn.addEventListener("click", function () {
            modal.style.display = "block";
        });

        // Close modal
        const closeModal = () => {
            modal.style.display = "none";
            leaveForm.reset();
        };

        closeModalBtn.addEventListener("click", closeModal);
        if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

        // Form submission
        submitBtn.addEventListener("click", async () => {
            // Basic validation
            const id_employee = document.getElementById("id_employee").value;
            const type = document.getElementById("is_paid").value;
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

            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
                const formData = new FormData(leaveForm);
                const data = Object.fromEntries(formData.entries());

                const response = await fetch(`/modelController/${Leave._cfgTable.tableName}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert("Leave request added successfully!");
                    // Refresh the table
                    Leave._instanceTable.setData();
                    closeModal();
                } else {
                    alert("Error adding leave request. Please try again.");
                }
            } catch (error) {
                console.error('Error:', error);
                alert("Error adding leave request. Please try again.");
            }
        });
    }

    // --- Setup delete functionality ---
    setupDeleteButton() {
        const deleteBtn = document.querySelector('.delete-selected-btn[data-tab="leaveTab"]');
        if (!deleteBtn || !Leave._instanceTable) return;

        deleteBtn.addEventListener('click', async () => {
            const selectedRows = Leave._instanceTable.getSelectedRows();

            if (selectedRows.length === 0) {
                alert('Vui lòng chọn ít nhất một bản ghi để xóa.');
                return;
            }

            // Kiểm tra điều kiện ngày tháng (dựa trên end_date)
            const currentDate = new Date();
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

            const validRecords = [];
            const invalidRecords = [];
            const errorRecords = [];

            selectedRows.forEach(row => {
                const endDateStr = row.getData().end_date;

                // Kiểm tra nếu end_date không tồn tại hoặc không hợp lệ
                if (!endDateStr) {
                    errorRecords.push({ row, reason: "Không có ngày kết thúc" });
                    return;
                }

                try {
                    const recordDate = new Date(endDateStr);

                    // Kiểm tra nếu ngày không hợp lệ
                    if (isNaN(recordDate.getTime())) {
                        errorRecords.push({ row, reason: "Ngày kết thúc không hợp lệ" });
                        return;
                    }

                    if (recordDate <= threeMonthsAgo) {
                        validRecords.push(row);
                    } else {
                        invalidRecords.push({ row, date: recordDate });
                    }
                } catch (e) {
                    errorRecords.push({ row, reason: "Lỗi khi xử lý ngày tháng" });
                }
            });

            // Thông báo nếu có bản ghi lỗi
            if (errorRecords.length > 0) {
                alert(`Có ${errorRecords.length} bản ghi không thể xử lý do lỗi dữ liệu.`);
            }

            // Thông báo nếu có bản ghi không đủ điều kiện
            if (invalidRecords.length > 0) {
                const earliestInvalidDate = invalidRecords.reduce((min, item) => {
                    return item.date < min ? item.date : min;
                }, new Date());

                alert(`Có ${invalidRecords.length} bản ghi không thể xóa vì chưa đủ 3 tháng kể từ ngày kết thúc. Chỉ có thể xóa những bản ghi có ngày kết thúc từ ${threeMonthsAgo.toLocaleDateString("vi-VN")} trở về trước. Bản ghi sớm nhất trong số này kết thúc vào ${earliestInvalidDate.toLocaleDateString("vi-VN")}.`);

                // Nếu không có bản ghi nào hợp lệ, dừng lại
                if (validRecords.length === 0) {
                    return;
                }

                // Nếu có cả hợp lệ và không hợp lệ, hỏi người dùng có muốn xóa những bản ghi hợp lệ không
                if (!confirm(`Bạn có muốn xóa ${validRecords.length} bản ghi hợp lệ (có ngày kết thúc từ ${threeMonthsAgo.toLocaleDateString("vi-VN")} trở về trước) không?`)) {
                    return;
                }
            } else if (validRecords.length > 0) {
                // Xác nhận xóa nếu tất cả đều hợp lệ
                if (!confirm(`Bạn có chắc chắn muốn xóa ${validRecords.length} bản ghi không?`)) {
                    return;
                }
            } else {
                // Không có bản ghi nào hợp lệ để xóa
                return;
            }

            // Thực hiện xóa các bản ghi hợp lệ
            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
                const deletePromises = [];

                for (const row of validRecords) {
                    const id = row.getData().id_leave;
                    const deletePromise = fetch(`/modelController/leaves/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'X-CSRF-TOKEN': csrfToken
                        }
                    });
                    deletePromises.push(deletePromise);
                }

                // Chờ tất cả các yêu cầu xóa hoàn thành
                const results = await Promise.allSettled(deletePromises);

                // Kiểm tra kết quả
                let successCount = 0;
                let failCount = 0;

                results.forEach((result, index) => {
                    if (result.status === 'fulfilled' && result.value.ok) {
                        successCount++;
                    } else {
                        failCount++;
                        console.error(`Lỗi khi xóa bản ghi ${validRecords[index].getData().id_leave}:`, result.reason || result.value);
                    }
                });

                // Thông báo kết quả
                if (successCount > 0) {
                    alert(`Đã xóa thành công ${successCount} bản ghi.`);

                    // Làm mới bảng để cập nhật dữ liệu
                    Leave._instanceTable.setData();

                    // Bỏ chọn tất cả các hàng
                    Leave._instanceTable.deselectRow();
                }

                if (failCount > 0) {
                    alert(`Có ${failCount} bản ghi xóa không thành công. Vui lòng thử lại.`);
                }

            } catch (error) {
                console.error('Lỗi khi xóa bản ghi:', error);
                alert('Đã xảy ra lỗi khi xóa bản ghi. Vui lòng thử lại.');
            }
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
        Leave._instanceTable.on("cellEdited", async cell => {
            const newValue = cell.getValue();
            const oldValue = cell.getOldValue();

            // Chỉ rollback khi newValue là null hoặc rỗng string
            if (newValue === null || newValue === "" || newValue === oldValue) {
                cell.setValue(oldValue, true);
                return;
            }

            try {
                const rowData = cell.getRow().getData();
                const field = cell.getField();
                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

                // URL PUT chuẩn nested resource
                const url = `/modelController/${Leave._cfgTable.tableName}/${rowData.id_leave}`;

                // Dữ liệu gửi lên
                const payload = { [field]: newValue };

                const resPut = await fetch(url, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrfToken },
                    body: JSON.stringify(payload)
                });

                if (!resPut.ok) {
                    alert("Leave update failed.");
                    cell.setValue(cell.getOldValue(), true);
                    return;
                }

                if (resPut.headers.get("content-type")?.includes("application/json")) {
                    const result = await resPut.json();
                    console.log("Update success:", result);
                } else {
                    console.log("Update success (no content).");
                }

            } catch (err) {
                console.error(err);
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

        // Thiết lập nút xóa
        this.setupDeleteButton();
    }
}