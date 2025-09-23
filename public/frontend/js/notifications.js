function openAddForm() {
    document.getElementById("formTitle").innerText = "Thêm thông báo";
    document.getElementById("formPopup").style.display = "block";
}

function openEditForm() {
    document.getElementById("formTitle").innerText = "Sửa thông báo";
    document.getElementById("formPopup").style.display = "block";
}

function openDetail() {
    document.getElementById("detailPopup").style.display = "block";
}

function closePopup() {
    document.querySelectorAll(".popup").forEach(p => p.style.display = "none");
}

function saveNotification() {
    alert("Đã lưu thông báo!");
    closePopup();
}
