<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hệ thống Quản lý Nhân sự</title>
    <link rel="stylesheet" href="{{ asset('frontend/css/styles.css') }}">
    <link rel="stylesheet" href="{{ asset('frontend/css/support.css') }}">
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
            <div class="support-container">
            <h2>Hệ thống hỗ trợ</h2>
            <button class="btn-add" onclick="openSupportForm()">+ Gửi yêu cầu hỗ trợ</button>

            <table class="support-table">
                <thead>
                    <tr>
                        <th>Mã YC</th>
                        <th>Tiêu đề</th>
                        <th>Ngày gửi</th>
                        <th>Người gửi</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>YC001</td>
                        <td>Lỗi không đăng nhập được</td>
                        <td>18/09/2025</td>
                        <td>Nguyễn Văn A</td>
                        <td>Chờ xử lý</td>
                        <td>
                            <button class="btn-view" onclick="openSupportDetail()">Xem</button>
                            <button class="btn-delete">Xóa</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

            {{-- Footer --}}
            @include('frontend.partials.footer')
        </div>
    </div>

    <!-- Popup Gửi yêu cầu -->
    <div id="supportFormPopup" class="popup">
        <div class="popup-content">
            <h3>Gửi yêu cầu hỗ trợ</h3>
            <label>Tiêu đề:</label>
            <input type="text" id="supportTitle">

            <label>Loại yêu cầu:</label>
            <select id="supportType">
                <option value="bug">Báo lỗi hệ thống</option>
                <option value="help">Yêu cầu hỗ trợ</option>
                <option value="feedback">Góp ý</option>
            </select>

            <label>Mức độ ưu tiên:</label>
            <select id="supportPriority">
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
            </select>

            <label>Nội dung chi tiết:</label>
            <textarea id="supportContent"></textarea>

            <div class="popup-actions">
                <button onclick="saveSupport()">Gửi</button>
                <button onclick="closePopup()">Hủy</button>
            </div>
        </div>
    </div>

    <!-- Popup Chi tiết yêu cầu -->
    <div id="supportDetailPopup" class="popup">
        <div class="popup-content">
            <h3>Chi tiết yêu cầu hỗ trợ</h3>
            <p><b>Tiêu đề:</b> Lỗi không đăng nhập được</p>
            <p><b>Loại yêu cầu:</b> Báo lỗi hệ thống</p>
            <p><b>Mức độ ưu tiên:</b> Cao</p>
            <p><b>Nội dung:</b> Khi nhập đúng tài khoản vẫn không đăng nhập được.</p>
            <p><b>Trạng thái:</b> Chờ xử lý</p>
            <div class="popup-actions">
                <button onclick="closePopup()">Đóng</button>
            </div>
        </div>
    </div>

    <script src="{{ asset('frontend/js/support.js') }}"></script>
    <script src="{{ asset('frontend/js/script.js') }}"></script>
</body>
</html>
