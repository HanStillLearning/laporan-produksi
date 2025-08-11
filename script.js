// API URL Web App (Google Apps Script)
const API_URL = "https://script.google.com/macros/s/AKfycbxjP8QK2wJysOwUOeE6wJd_3nvkQOuCuZHyFj1sYFfeNJnvayVTat5RGrm73VEcfU6Owg/exec";

// --- JSONP loader for GET (menghindari masalah CORS pada Apps Script) ---
function loadData() {
  document.getElementById("loading").textContent = "Memuat data…";
  // Hapus tabel lama
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";
  // Hapus script JSONP lama jika ada
  const old = document.getElementById("jsonp-loader");
  if (old) old.remove();

  // Buat callback global
  window.handleSheetData = function(data) {
    document.getElementById("loading").classList.add("hidden");
    const table = document.getElementById("dataTable");
    table.classList.remove("hidden");
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";
    if (!Array.isArray(data) || data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">Belum ada data</td></tr>';
      return;
    }
    // tampilkan data; data adalah array objek {id, nama, tanggal, produksi}
    data.forEach((row, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${idx+1}</td>
        <td>${escapeHtml(row.nama)}</td>
        <td>${escapeHtml(row.tanggal)}</td>
        <td>${escapeHtml(row.produksi)}</td>
        <td class="actions">
          <button onclick="startEdit(${row.id})">Edit</button>
          <button onclick="deleteRow(${row.id})">Hapus</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  };

  // buat tag script JSONP
  const script = document.createElement("script");
  script.id = "jsonp-loader";
  script.src = API_URL + "?action=get&callback=handleSheetData";
  document.body.appendChild(script);
}

// escapeHtml untuk keamanan tampilan
function escapeHtml(s) {
  if (s === undefined || s === null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// --- POST for add/edit/delete (gunakan no-cors) ---
function postAction(payload) {
  // payload harus mengandung property 'action' (add/edit/delete) dan data
  fetch(API_URL, {
    method: "POST",
    mode: "no-cors", // Apps Script sering memblokir CORS; no-cors membuat request tapi response tidak bisa dibaca
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).then(() => {
    // reload data after short delay
    setTimeout(loadData, 700);
  }).catch(err => {
    console.error(err);
    setTimeout(loadData, 700);
  });
}

// --- Handlers untuk form ---
document.getElementById("formData").addEventListener("submit", function(e) {
  e.preventDefault();
  const id = document.getElementById("rowId").value;
  const nama = document.getElementById("nama").value.trim();
  const tanggal = document.getElementById("tanggal").value;
  const produksi = document.getElementById("produksi").value;

  if (!nama || !tanggal || !produksi) return alert("Lengkapi semua field");

  if (id) {
    // edit
    postAction({ action: "edit", id: id, nama: nama, tanggal: tanggal, produksi: produksi });
  } else {
    // add
    postAction({ action: "add", nama: nama, tanggal: tanggal, produksi: produksi });
  }

  document.getElementById("formData").reset();
  document.getElementById("rowId").value = "";
});

document.getElementById("cancelEdit").addEventListener("click", function() {
  document.getElementById("formData").reset();
  document.getElementById("rowId").value = "";
});

// --- Start edit: isi form dengan data dari sheet (kita ambil seluruh data dan cari id) ---
function startEdit(rowId) {
  // kita load data dan cari baris dengan id tersebut
  window.handleSheetData = function(data) {
    const found = (data || []).find(r => String(r.id) === String(rowId));
    if (!found) return alert("Baris tidak ditemukan");
    document.getElementById("rowId").value = found.id;
    document.getElementById("nama").value = found.nama;
    document.getElementById("tanggal").value = found.tanggal;
    document.getElementById("produksi").value = found.produksi;
    window.handleSheetData = null;
  };
  const old = document.getElementById("jsonp-loader");
  if (old) old.remove();
  const script = document.createElement("script");
  script.id = "jsonp-loader";
  script.src = API_URL + "?action=get&callback=handleSheetData";
  document.body.appendChild(script);
}

// --- Delete row ---
function deleteRow(rowId) {
  if (!confirm("Hapus data ini?")) return;
  postAction({ action: "delete", id: rowId });
}

// Load data awal
loadData();
