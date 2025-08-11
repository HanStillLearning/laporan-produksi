// API URL Web App (Google Apps Script)
const API_URL = "https://script.google.com/macros/s/AKfycbxjP8QK2wJysOwUOeE6wJd_3nvkQOuCuZHyFj1sYFfeNJnvayVTat5RGrm73VEcfU6Owg/exec";

// Utility: escape html
function escapeHtml(s) {
  if (s === undefined || s === null) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// Load data using JSONP to avoid CORS issues from Apps Script
function loadData() {
  document.getElementById("loading").textContent = "Memuat data…";
  document.getElementById("loading").classList.remove("hidden");
  const table = document.getElementById("dataTable");
  table.classList.add("hidden");
  const tbody = table.querySelector("tbody");
  tbody.innerHTML = "";

  // remove old JSONP script
  const old = document.getElementById("jsonp-loader");
  if (old) old.remove();

  window.handleSheetData = function(data) {
    document.getElementById("loading").classList.add("hidden");
    table.classList.remove("hidden");
    tbody.innerHTML = "";
    if (!Array.isArray(data) || data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">Belum ada data</td></tr>';
      return;
    }
    data.forEach((row, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${idx+1}</td>
        <td>${escapeHtml(row.nama)}</td>
        <td>${escapeHtml(row.tanggal)}</td>
        <td>${escapeHtml(row.produksi)}</td>
        <td class="actions">
          <button onclick="startEdit('${row.id}')">Edit</button>
          <button onclick="deleteRow('${row.id}')">Hapus</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  };

  const script = document.createElement("script");
  script.id = "jsonp-loader";
  script.src = API_URL + "?action=get&callback=handleSheetData&_t=" + Date.now();
  document.body.appendChild(script);
}

// Post action (add/edit/delete) then reload data
function postAction(payload) {
  // Use no-cors so request is sent even if response is opaque
  fetch(API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(() => {
    // small delay to let Apps Script write to sheet, then reload
    setTimeout(loadData, 800);
  })
  .catch(err => {
    console.error(err);
    setTimeout(loadData, 800);
  });
}

// Form handlers
document.getElementById("formData").addEventListener("submit", function(e) {
  e.preventDefault();
  const id = document.getElementById("rowId").value;
  const nama = document.getElementById("nama").value.trim();
  const tanggal = document.getElementById("tanggal").value;
  const produksi = document.getElementById("produksi").value;

  if (!nama || !tanggal || !produksi) return alert("Lengkapi semua field");

  if (id) {
    postAction({ action: "edit", id: id, nama: nama, tanggal: tanggal, produksi: produksi });
  } else {
    postAction({ action: "add", nama: nama, tanggal: tanggal, produksi: produksi });
  }

  document.getElementById("formData").reset();
  document.getElementById("rowId").value = "";
});

document.getElementById("cancelEdit").addEventListener("click", function() {
  document.getElementById("formData").reset();
  document.getElementById("rowId").value = "";
});

// start edit: load data and populate form
function startEdit(rowId) {
  // load data then find row
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
  script.src = API_URL + "?action=get&callback=handleSheetData&_t=" + Date.now();
  document.body.appendChild(script);
}

// delete row
function deleteRow(rowId) {
  if (!confirm("Hapus data ini?")) return;
  postAction({ action: "delete", id: rowId });
}

// initial load
loadData();
