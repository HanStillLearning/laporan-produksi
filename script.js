const scriptURL = "https://script.google.com/macros/s/AKfycbzhIKUxekdSo52StPKQ6qipOMzWrmJx9--D9SdSSUkcTjAt6JQBp6wla9LuS3vd0lkQVw/exec";

const form = document.getElementById("dataForm");
const dataBody = document.getElementById("dataBody");

function loadData() {
    fetch(scriptURL + "?action=read")
        .then(res => res.json())
        .then(data => {
            dataBody.innerHTML = "";
            data.forEach(row => {
                let tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${row.tanggal}</td>
                    <td>${row.produk}</td>
                    <td>${row.jumlah}</td>
                    <td><button onclick="deleteData('${row.id}')">Hapus</button></td>
                `;
                dataBody.appendChild(tr);
            });
        })
        .catch(err => console.error("Gagal memuat data:", err));
}

form.addEventListener("submit", e => {
    e.preventDefault();
    const formData = new FormData(form);
    fetch(scriptURL + "?action=create", { method: "POST", body: formData })
        .then(() => {
            form.reset();
            loadData();
        })
        .catch(err => console.error("Gagal menambah data:", err));
});

function deleteData(id) {
    fetch(scriptURL + `?action=delete&id=${id}`)
        .then(() => loadData())
        .catch(err => console.error("Gagal menghapus data:", err));
}

setInterval(loadData, 3000);
loadData();
