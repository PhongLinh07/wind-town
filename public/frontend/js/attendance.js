function openDetail() {
    document.getElementById("detailPopup").style.display = "block";
}

function closeDetail() {
    document.getElementById("detailPopup").style.display = "none";
}

// Đóng popup khi click ra ngoài
window.onclick = function(event) {
    const popup = document.getElementById("detailPopup");
    if (event.target === popup) {
        popup.style.display = "none";
    }
};
