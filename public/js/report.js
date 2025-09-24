// Report.js// bảng này ko thể sửa vì do máy chấm côbng đưa về 
class Report {
    // --- Singleton instance ---
    static _instance = null;

    // HTML template
    static _html = `

    <style>
    .report-container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.report-toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-select, input[type="date"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.report-table th {
  background: #0077cc;
  color: white;
  padding: 10px;
}

.report-table td {
  padding: 8px;
  border: 1px solid #ddd;
}

.report-table tr:hover {
  background: #f1f9ff;
  cursor: pointer;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-export { background: #28a745; color: #fff; }
.btn-chart { background: #17a2b8; color: #fff; }
.btn:hover { opacity: 0.85; }

/* Popup */
.popup {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  justify-content: center;
  align-items: center;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  animation: fadeIn 0.3s;
}

.close {
  float: right;
  font-size: 20px;
  cursor: pointer;
}

/* Biểu đồ */
.chart-container {
  margin-top: 20px;
  display: none;
}
</style>
    <div class="report-container">

                <!-- Toolbar -->
                <div class="report-toolbar">
                <select class="filter-select" id="report-type">
                    <option>Chọn loại báo cáo</option>
                    <option>Nhân sự</option>
                    <option>Chấm công</option>
                    <option>Lương</option>
                    <option>Hợp đồng</option>
                </select>
                <input type="date" id="from-date">
                <input type="date" id="to-date">
                <button class="btn btn-export">📄 Xuất PDF</button>
                <button class="btn btn-export">⬇ Xuất Excel</button>
                <button class="btn btn-chart" onclick="toggleChart()">📊 Xem biểu đồ</button>
                </div>

                <!-- Bảng dữ liệu -->
                <table class="report-table">
                <thead>
                    <tr>
                    <th>Mã NV</th>
                    <th>Họ và Tên</th>
                    <th>Phòng ban</th>
                    <th>Ngày</th>
                    <th>Tổng giờ làm</th>
                    </tr>
                </thead>
                <tbody>
                    <tr onclick="openPopup('Nguyễn Văn A')">
                    <td>NV001</td>
                    <td>Nguyễn Văn A</td>
                    <td>Kinh doanh</td>
                    <td>01/09/2025</td>
                    <td>8h</td>
                    </tr>
                    <tr onclick="openPopup('Trần Thị B')">
                    <td>NV002</td>
                    <td>Trần Thị B</td>
                    <td>Nhân sự</td>
                    <td>01/09/2025</td>
                    <td>7h30</td>
                    </tr>
                </tbody>
                </table>

                <!-- Biểu đồ -->
                <div class="chart-container" id="chart-container">
                <canvas id="reportChart"></canvas>
                </div>
            </div>

            <!-- Popup -->
    <div class="popup" id="popup">
        <div class="popup-content">
        <span class="close" onclick="closePopup()">&times;</span>
        <h2>Chi tiết báo cáo</h2>
        <p><b>Nhân viên:</b> <span id="popup-name"></span></p>
        <p><b>Ngày:</b> 01/09/2025</p>
        <p><b>Tổng giờ làm:</b> 8h</p>
        <p><b>Phòng ban:</b> Kinh doanh</p>
        </div>
    </div>

  `;


    // --- Singleton getInstance ---
    static getInstance() {
        if (!Report._instance) {
            Report._instance = new Report();
        }
        return Report._instance;
    }


    // --- Return HTML ---
    getHTML() {
        return Report._html;
    }

    // --- Render table vào container ---
    render(container) {
        container.innerHTML = this.getHTML();
    }
}