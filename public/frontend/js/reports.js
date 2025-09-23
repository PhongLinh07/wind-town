function openPopup(name) {
  document.getElementById("popup").style.display = "flex";
  document.getElementById("popup-name").innerText = name;
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

// Toggle hiển thị biểu đồ
function toggleChart() {
  const chartContainer = document.getElementById("chart-container");
  chartContainer.style.display = chartContainer.style.display === "none" ? "block" : "none";
}

// Khởi tạo biểu đồ mẫu
const ctx = document.getElementById('reportChart').getContext('2d');
const reportChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'],
    datasets: [{
      label: 'Tổng giờ làm',
      data: [8, 7.5, 9],
      backgroundColor: ['#007bff', '#28a745', '#ffc107']
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: true }
    }
  }
});
