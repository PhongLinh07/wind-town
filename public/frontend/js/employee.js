document.addEventListener('DOMContentLoaded', function () {
    const rows = document.querySelectorAll('.employee-table tbody tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const id = cells[0].textContent;
        const name = cells[1].textContent;
        const dept = cells[2].textContent;
        const role = cells[3].textContent;
        const email = cells[4].textContent;
        const phone = cells[5].textContent;

        const actionCell = cells[6];

        // Nút ✏ Sửa
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-edit';
        editBtn.textContent = 'Sửa';
        editBtn.title = 'Sửa thông tin';
        editBtn.onclick = function () {
            alert(`Chỉnh sửa nhân viên: ${name}`);
        };

        // Nút 🗑 Xóa
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-delete';
        deleteBtn.textContent = 'Xóa';
        deleteBtn.title = 'Xóa nhân viên';
        deleteBtn.onclick = function () {
            const confirmDelete = confirm(`Bạn có chắc muốn xóa ${name}?`);
            if (confirmDelete) {
                row.remove();
            }
        };

        // Nút 👁 Xem
        const viewBtn = document.createElement('button');
        viewBtn.className = 'btn btn-view';
        viewBtn.textContent = 'Xem';
        viewBtn.title = 'Xem chi tiết';
        viewBtn.onclick = function () {
            openModal(id, name, dept, role, email, phone);
        };

        // Thêm vào ô thao tác
        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);
        actionCell.appendChild(viewBtn);
    });
});

function openModal(id, name, dept, role, email, phone) {
    document.getElementById('detail-id').textContent = id;
    document.getElementById('detail-name').textContent = name;
    document.getElementById('detail-dept').textContent = dept;
    document.getElementById('detail-role').textContent = role;
    document.getElementById('detail-email').textContent = email;
    document.getElementById('detail-phone').textContent = phone;

    document.getElementById('viewDetail').style.display = 'flex';
}

function closeModal() {
    document.getElementById('viewDetail').style.display = 'none';
    
    window.onclick = function(event) {
    const popup = document.getElementById('viewDetail');
    if (event.target === popup) {
        popup.style.display = 'none';
    }
};
}

