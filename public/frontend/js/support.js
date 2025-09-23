function openSupportForm() {
    document.getElementById("supportFormPopup").style.display = "block";
}

function openSupportDetail() {
    document.getElementById("supportDetailPopup").style.display = "block";
}

function closePopup() {
    document.querySelectorAll(".popup").forEach(p => p.style.display = "none");
}

function saveSupport() {
    alert("Yêu cầu hỗ trợ đã được gửi!");
    closePopup();
}
