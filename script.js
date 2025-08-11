document.getElementById("formData").addEventListener("submit", function(e) {
    e.preventDefault();

    let produk = document.getElementById("produk").value;
    let jumlah = document.getElementById("jumlah").value;
    let tanggal = document.getElementById("tanggal").value;

    let tabel = document.getElementById("tabelData");
    let barisBaru = tabel.insertRow();

    barisBaru.insertCell(0).innerText = produk;
    barisBaru.insertCell(1).innerText = jumlah;
    barisBaru.insertCell(2).innerText = tanggal;

    this.reset();
});