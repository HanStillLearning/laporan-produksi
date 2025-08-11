// Ganti URL di bawah ini dengan URL Web App Google Apps Script kamu
const API_URL = "https://script.google.com/macros/s/AKfycbxFoEvx8fvIRSgYeurxzx-wwShBVd9Qm6vijNqK2Qhfq8LaPS9QWsc_UYv4mxk37lYhTQ/exec";

document.getElementById("formData").addEventListener("submit", function(e) {
    e.preventDefault();

    let produk = document.getElementById("produk").value;
    let jumlah = document.getElementById("jumlah").value;
    let tanggal = document.getElementById("tanggal").value;

    fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
            produk: produk,
            jumlah: jumlah,
            tanggal: tanggal
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.text())
    .then(res => {
        alert("Data berhasil disimpan ke Google Sheets!");
        document.getElementById("formData").reset();
    })
    .catch(err => {
        console.error(err);
        alert("Gagal menyimpan data!");
    });
});