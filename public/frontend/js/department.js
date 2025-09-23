// Chuyển tab
function showTab(tabId) {
    document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".tab").forEach(el => el.classList.remove("active"));
    document.getElementById(tabId).classList.add("active");
    event.target.classList.add("active");
}

// Popup dữ liệu mẫu
const dataPopup = {
    pb1: "<h3>Kế toán</h3><p>Trưởng phòng: Nguyễn Văn A</p><p>Số nhân viên: 5</p><p>Mô tả: Quản lý tài chính công ty</p><p>Trạng thái: Hoạt động</p>",
    pb2: "<h3>Nhân sự</h3><p>Trưởng phòng: Trần Thị B</p><p>Số nhân viên: 8</p><p>Mô tả: Quản lý nhân viên</p><p>Trạng thái: Hoạt động</p>",
    cv1: "<h3>Trưởng phòng</h3><p>Phòng ban: Kế toán</p><p>Lương: 15,000,000</p><p>Mô tả: Quản lý phòng kế toán</p><p>Trạng thái: Hoạt động</p>",
    cv2: "<h3>Nhân viên</h3><p>Phòng ban: Nhân sự</p><p>Lương: 8,000,000</p><p>Mô tả: Hỗ trợ tuyển dụng</p><p>Trạng thái: Hoạt động</p>",
};

function openPopup(id) {
    document.getElementById("popup-body").innerHTML = dataPopup[id] || "Không có dữ liệu";
    document.getElementById("popup").style.display = "flex";
}
function closePopup() {
    document.getElementById("popup").style.display = "none";
}
