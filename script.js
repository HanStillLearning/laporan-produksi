const scriptURL = "https://script.google.com/macros/s/AKfycbzhIKUxekdSo52StPKQ6qipOMzWrmJx9--D9SdSSUkcTjAt6JQBp6wla9LuS3vd0lkQVw/exec";

// Isi dropdown tanggal
function populateDateDropdowns() {
    const daySelect = document.getElementById("day");
    const monthSelect = document.getElementById("month");
    const yearSelect = document.getElementById("year");

    for (let d = 1; d <= 31; d++) {
        let opt = document.createElement("option");
        opt.value = d;
        opt.textContent = d;
        daySelect.appendChild(opt);
    }

    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    months.forEach((m, i) => {
        let opt = document.createElement("option");
        opt.value = i + 1;
        opt.textContent = m;
        monthSelect.appendChild(opt);
    });

    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 5; y <= currentYear + 5; y++) {
        let opt = document.createElement("option");
        opt.value = y;
        opt.textContent = y;
        yearSelect.appendChild(opt);
    }
}

populateDateDropdowns();

// Ambil data dari Google Sheet
function loadData() {
    fetch(scriptURL)
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector("#dataTable tbody");
            tbody.innerHTML = "";
            data.forEach((row, index) => {
                let tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${row.tanggal}</td>
                    <td>${row.produk}</td>
                    <td>${row.jumlah}</td>
                    <td><button onclick="deleteData(${index})">Hapus</button></td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(err => console.error(err));
}

// Tambah data
document.getElementById("dataForm").addEventListener("submit", e => {
    e.preventDefault();

    const day = document.getElementById("day").value;
    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;
    const tanggal = `${day}-${month}-${year}`;

    const productName = document.getElementById("productName").value;
    const quantity = document.getElementById("quantity").value;

    fetch(scriptURL, {
        method: "POST",
        body: new URLSearchParams({
            tanggal: tanggal,
            produk: productName,
            jumlah: quantity
        })
    })
    .then(res => res.text())
    .then(() => {
        document.getElementById("dataForm").reset();
        loadData();
    })
    .catch(err => console.error(err));
});

// Hapus data
function deleteData(index) {
    fetch(`${scriptURL}?delete=${index}`, { method: "GET" })
        .then(() => loadData())
        .catch(err => console.error(err));
}

loadData();
setInterval(loadData, 5000); // Auto-refresh tiap 5 detik
