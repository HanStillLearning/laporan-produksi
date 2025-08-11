document.getElementById("dataForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const nama = document.getElementById("nama").value;
    const tanggal = document.getElementById("tanggal").value;
    const produksi = document.getElementById("produksi").value;

    fetch("https://script.google.com/macros/s/AKfycbxjP8QK2wJysOwUOeE6wJd_3nvkQOuCuZHyFj1sYFfeNJnvayVTat5RGrm73VEcfU6Owg/exec", {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nama, tanggal, produksi })
    })
    .then(() => {
        document.getElementById("message").textContent = "✅ Data berhasil dikirim";
        document.getElementById("dataForm").reset();
    })
    .catch(error => {
        document.getElementById("message").textContent = "❌ Gagal mengirim data";
        console.error("Error:", error);
    });
});
