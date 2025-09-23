<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hệ thống Quản lý Nhân sự</title>
    <link rel="stylesheet" href="{{ asset('frontend/css/styles.css') }}">
    <link rel="stylesheet" href="{{ asset('frontend/css/reports.css') }}">
</head>
<body>
    <div class="container">
        {{-- Sidebar --}}
            @include('frontend.partials.sidebar')

        <!-- Content -->
        <div class="content">
            {{-- Header --}}
            @include('frontend.partials.header')

            {{-- Nội dung chính (demo) --}}
            <!-- Main -->
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

            {{-- Footer --}}
            @include('frontend.partials.footer')
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
    
    <script src="{{ asset('frontend/js/reports.js') }}"></script>
    <script src="{{ asset('frontend/js/script.js') }}"></script>
</body>
</html>
