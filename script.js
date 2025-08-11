const API_URL = "https://script.google.com/macros/s/AKfycbxuiAeWEBxR-zmzJkTgpKZ1XV9KciG6BlG1c1hfXPgW2ZlyYdw9Iqr0tqojzmvSJPeFsg/exec";

document.getElementById("dataForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const nama = document.getElementById("nama").value;
    const tanggal = document.getElementById("tanggal").value;
    const produksi = document.getElementById("produksi").value;

    fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ nama, tanggal, produksi }),
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById("status").innerText = "✅ Data berhasil dikirim!";
        document.getElementById("dataForm").reset();
    })
    .catch(error => {
        document.getElementById("status").innerText = "❌ Gagal mengirim data.";
        console.error(error);
    });
});
