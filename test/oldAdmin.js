const API_URL = "https://sheetdb.io/api/v1/z7ehd71y8bt7r";
let currentEditingRow = null;
const topBar = document.getElementById("topBar");

function fetchRecords() {
  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => displayRecords(data))
    .catch(() => showMessage("Error loading records.", "error"));
}

function displayRecords(data) {
  const tableBody = document.querySelector("#recordsTable tbody");
  tableBody.innerHTML = "";
  data.forEach((record, index) => {
    const row = document.createElement("tr");
    row.dataset.identifier = encodeURIComponent(record.Name);
    row.innerHTML = `
      <td class="checkbox-cell"></td>
      <td>${record.Name}</td>
      <td>${record.Block}</td>
      <td>${record.Lot}</td>
      <td>${record["Date of Birth"]}</td>
      <td>${record["Date of Death"]}</td>
      <td class="edit-cell"><button class="edit-individual" onclick="editRow(this)">✏️</button></td>`;
    tableBody.appendChild(row);
  });
}

function editRow(button) {
  const row = button.closest("tr");
  const cells = row.querySelectorAll("td");

  const name = cells[1].textContent;
  const block = cells[2].textContent;
  const lot = cells[3].textContent;
  const dob = cells[4].textContent;
  const dod = cells[5].textContent;
  const identifier = row.dataset.identifier;

  document.getElementById("editIdentifier").value = identifier;
  document.getElementById("editName").value = name;
  document.getElementById("editBlock").value = block;
  document.getElementById("editLot").value = lot;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return dateStr;
    }
    const date = new Date(dateStr);
    const offsetDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return isNaN(date) ? "" : offsetDate.toISOString().split("T")[0];
  };

  document.getElementById("editDOB").value = formatDate(dob);
  document.getElementById("editDOD").value = formatDate(dod);

  document.getElementById("editForm").style.display = "flex";
}

function submitEdit() {
  const identifier = document.getElementById("editIdentifier").value;
  const name = document.getElementById("editName").value;
  const block = document.getElementById("editBlock").value;
  const lot = document.getElementById("editLot").value;
  const dob = document.getElementById("editDOB").value;
  const dod = document.getElementById("editDOD").value;

  const data = {
    data: {
      Name: name,
      Block: block,
      Lot: lot,
      "Date of Birth": dob,
      "Date of Death": dod,
    },
  };

  fetch(`${API_URL}/Name/${identifier}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(() => {
      closeEditForm();
      fetchRecords();
      showMessage("Record updated.", "success");
    })
    .catch(() => showMessage("Error updating record.", "error"));
}

function closeEditForm() {
  document.getElementById("editForm").style.display = "none";
}

function saveEdit() {
  if (!currentEditingRow) return;
  const identifier = currentEditingRow.dataset.identifier;
  const inputs = currentEditingRow.querySelectorAll("input");
  const data = {
    data: {
      Name: inputs[0].value,
      Block: inputs[1].value,
      Lot: inputs[2].value,
      "Date of Birth": inputs[3].value,
      "Date of Death": inputs[4].value,
    },
  };

  fetch(`${API_URL}/Name/${identifier}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(() => {
      currentEditingRow = null;
      topBar.classList.remove("editing");
      fetchRecords();
      showMessage("Record updated.", "success");
    })
    .catch(() => showMessage("Error updating record.", "error"));
}

function cancelEdit() {
  if (!currentEditingRow) return;
  topBar.classList.remove("editing");
  currentEditingRow = null;
  fetchRecords();
}

function toggleSelectAll(master) {
  const checkboxes = document.querySelectorAll(".recordCheckbox");
  checkboxes.forEach((cb) => (cb.checked = master.checked));
}

function showMessage(text, type) {
  const msgBox = document.getElementById("message");
  msgBox.textContent = text;
  msgBox.className = `message ${type}`;
  setTimeout(() => {
    msgBox.textContent = "";
    msgBox.className = "message";
  }, 3000);
}

function openAddForm() {
  document.getElementById("addForm").style.display = "flex";
}

function closeAddForm() {
  document.getElementById("addForm").style.display = "none";
}

function submitNewRecord() {
  const data = {
    data: {
      Name: document.getElementById("addName").value,
      Block: document.getElementById("addBlock").value,
      Lot: document.getElementById("addLot").value,
      "Date of Birth": document.getElementById("addDOB").value,
      "Date of Death": document.getElementById("addDOD").value,
    },
  };
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(() => {
      closeAddModal();
      fetchRecords();
      showMessage("Record added.", "success");
    })
    .catch(() => showMessage("Error adding record.", "error"));
}

let sortDirection = { 1: true, 2: true, 3: true };

function setupSortArrows() {
  document.querySelectorAll(".sort-arrow").forEach((arrow) => {
    arrow.addEventListener("click", () => {
      const columnIndex = parseInt(arrow.dataset.column);
      const direction = sortDirection[columnIndex] ? 1 : -1;
      sortDirection[columnIndex] = !sortDirection[columnIndex];

      const table = document.getElementById("recordsTable");
      const tbody = table.querySelector("tbody");
      const rows = Array.from(tbody.querySelectorAll("tr"));

      rows.sort((a, b) => {
        const aText = a.children[columnIndex].textContent.trim().toLowerCase();
        const bText = b.children[columnIndex].textContent.trim().toLowerCase();
        return aText.localeCompare(bText) * direction;
      });

      rows.forEach((row) => tbody.appendChild(row));

      // Flip the arrow
      document.querySelectorAll(".sort-arrow").forEach((a) => {
        a.textContent = "▼"; // reset all arrows
      });
      arrow.textContent = direction === 1 ? "▲" : "▼";
    });
  });
}

function setupSearchFilters() {
  const nameInput = document.getElementById("searchName");
  const blockInput = document.getElementById("searchBlock");
  const lotInput = document.getElementById("searchLot");

  [nameInput, blockInput, lotInput].forEach((input) => {
    input.addEventListener("input", () => {
      const nameFilter = nameInput.value.toLowerCase();
      const blockFilter = blockInput.value.toLowerCase();
      const lotFilter = lotInput.value.toLowerCase();

      document.querySelectorAll("#recordsTable tbody tr").forEach((row) => {
        const name = row.children[1].textContent.toLowerCase();
        const block = row.children[2].textContent.toLowerCase();
        const lot = row.children[3].textContent.toLowerCase();

        const matchesName = name.includes(nameFilter);
        const matchesBlock = block.includes(blockFilter);
        const matchesLot = lot.includes(lotFilter);

        row.style.display =
          matchesName && matchesBlock && matchesLot ? "" : "none";
      });
    });
  });
}

function showSection(section) {
  const recordsSection = document.querySelector(".records-section");
  const lotStatusSection = document.querySelector(".lotStatus-section");

  recordsSection.style.display = section === "records" ? "block" : "none";
  lotStatusSection.style.display = section === "lotStatus" ? "block" : "none";

  document
    .querySelectorAll(".nav-link")
    .forEach((link) => link.classList.remove("active"));

  const linkToActivate = document.querySelector(
    `.nav-link[data-section="${section}"]`
  );
  if (linkToActivate) linkToActivate.classList.add("active");

  if (section === "lotStatus") fetchLotStatus();
}

function fetchLotStatus() {
  fetch(`${API_URL}?sheet=LotStatus`)
    .then((res) => res.json())
    .then((data) => {
      const tableBody = document.querySelector("#lotStatusTable tbody");
      tableBody.innerHTML = "";
      data.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.Block}</td>
          <td>${item.Lot}</td>
          <td class="status-cell ${
            item.Status.toLowerCase() === "occupied"
              ? "status-occupied"
              : "status-available"
          }">
  ${item.Status}
</td>

          <td>${item.Latitude}</td>
          <td>${item.Longitude}</td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(() => showMessage("Error loading lot status.", "error"));
}

setupLotStatusFilters();

function setupLotStatusFilters() {
  const blockInput = document.getElementById("searchBlockLS");
  const lotInput = document.getElementById("searchLotLS");
  const statusInput = document.getElementById("searchStatusLS");

  [blockInput, lotInput, statusInput].forEach((input) => {
    input.addEventListener("input", () => {
      const blockFilter = blockInput.value.toLowerCase();
      const lotFilter = lotInput.value.toLowerCase();
      const statusFilter = statusInput.value.toLowerCase();

      document.querySelectorAll("#lotStatusTable tbody tr").forEach((row) => {
        const block = row.children[0].textContent.toLowerCase();
        const lot = row.children[1].textContent.toLowerCase();
        const status = row.children[2].textContent.toLowerCase();

        const matchesBlock = block.includes(blockFilter);
        const matchesLot = lot.includes(lotFilter);
        const matchesStatus = status.includes(statusFilter);

        row.style.display =
          matchesBlock && matchesLot && matchesStatus ? "" : "none";
      });
    });
  });
}

fetchRecords();
setupSearchFilters();
setupSortArrows();