document.addEventListener("DOMContentLoaded", function () {
    // Ví dụ: thông báo khi click vào thông báo
    const notif = document.querySelector(".notif");
    notif.addEventListener("click", () => {
        alert("Bạn có 3 thông báo mới!");
    });
});
