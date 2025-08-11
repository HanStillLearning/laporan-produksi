const API_URL = "https://script.google.com/macros/s/AKfycby4Z422rjh7Q9hu3F5G_C1EnjZZ1idkLfBlbwKzVyHiic3QZUMIKnO_PCvEWx5SGcxaSg/exec";

async function fetchData() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        if (!data || !Array.isArray(data)) {
            console.error("Data tidak valid", data);
            return;
        }

        updateTable(data);
        updateChart(data);
    } catch (error) {
        console.error("Gagal mengambil data:", error);
    }
}

function updateTable(data) {
    const tbody = document.querySelector("#dataTable tbody");
    tbody.innerHTML = "";

    data.forEach(row => {
        let tr = document.createElement("tr");
        tr.innerHTML = `<td>${row.tanggal}</td><td>${row.produk}</td><td>${row.jumlah}</td>`;
        tbody.appendChild(tr);
    });
}

function updateChart(data) {
    const ctx = document.getElementById('productionChart').getContext('2d');

    const produkLabels = [...new Set(data.map(item => item.produk))];
    const jumlahData = produkLabels.map(produk =>
        data.filter(item => item.produk === produk)
            .reduce((sum, curr) => sum + parseInt(curr.jumlah || 0), 0)
    );

    if (window.productionChart instanceof Chart) {
        window.productionChart.destroy();
    }

    window.productionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: produkLabels,
            datasets: [{
                label: 'Total Produksi',
                data: jumlahData,
                backgroundColor: '#4b5320'
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Ambil data pertama kali
fetchData();

// Auto refresh tiap 10 detik
setInterval(fetchData, 10000);
