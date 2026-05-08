/* ---------- UTILITY ---------- */
function getData(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ---------- SECTION SWITCH ---------- */
function switchTab(id, btn) {
  document.querySelectorAll(".tab-section")
    .forEach(s => s.classList.add("d-none"));

  document.getElementById(id)
    .classList.remove("d-none");

  document.querySelectorAll(".tab-btn")
    .forEach(b => b.classList.remove("active"));

  if (btn) btn.classList.add("active");
}

/* ---------- FLATS ---------- */
function saveFlat() {
  const f_id = document.getElementById("f_id");
  const f_owner = document.getElementById("f_owner");
  const f_type = document.getElementById("f_type");
  const f_status = document.getElementById("f_status");

  const flatId = f_id.value.trim().toUpperCase();
  const ownerName = f_owner.value.trim();
  const type = f_type.value;
  const status = f_status.value;

  if (!flatId || !ownerName) {
    alert("Fill all fields");
    return;
  }

  let flats = getData("flats");

  // Remove flat if exists
  flats = flats.filter(f => f.flatId !== flatId);
  flats.push({ flatId, ownerName, type, status });
  setData("flats", flats);

  // Create resident login if occupied
  if (status === "occupied") {
    let residents = getData("residents");
    if (!residents.find(r => r.flatId === flatId)) {
      const pin = Math.floor(1000 + Math.random() * 9000).toString();
      residents.push({ flatId, name: ownerName, pin });
      setData("residents", residents);
      alert(`Resident Login Created\n\nUser ID: ${flatId}\nPIN: ${pin}`);
    }
  }

  alert("Flat saved successfully!");
  f_id.value = "";
  f_owner.value = "";
  renderFlats();
  updateStats();
}

function renderFlats() {
  const flats = getData("flats");
  const list = document.getElementById("flat-list");

  if (!list) return;

  if (!flats.length) {
    list.innerHTML = "<p class='text-muted'>No flats added.</p>";
    return;
  }

  list.innerHTML = flats.map(f => `
    <div class="card p-3 mb-2">
      <h5>${f.flatId}</h5>
      <p>Owner: ${f.ownerName}</p>
      <p>Status: ${f.status}</p>
    </div>
  `).join("");
}

/* ---------- COMPLAINTS ---------- */
function renderComplaints() {
  const complaints = getData("complaints");
  const table = document.getElementById("complaintTable");

  if (!table) return;

  if (!complaints.length) {
    table.innerHTML =
      `<tr><td colspan="6" class="text-center text-muted">No complaints</td></tr>`;
    return;
  }

  table.innerHTML = [...complaints].reverse().map((c, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${c.flatId}</td>
      <td>${c.title}<br><small>${c.details}</small></td>
      <td>${c.date}</td>
      <td>
        <select onchange="updateStatus('${c.id}', this.value)">
          <option ${c.status==='Pending'?'selected':''}>Pending</option>
          <option ${c.status==='In Progress'?'selected':''}>In Progress</option>
          <option ${c.status==='Resolved'?'selected':''}>Resolved</option>
        </select>
      </td>
    </tr>
  `).join("");
}

function updateStatus(id, status) {
  let complaints = getData("complaints");
  complaints = complaints.map(c => c.id == id ? { ...c, status } : c);
  setData("complaints", complaints);
  renderComplaints();
  updateStats();
}

/* ---------- NOTICES ---------- */
function publishNotice() {
  const n_title = document.getElementById("n_title");
  const n_msg = document.getElementById("n_msg");

  const title = n_title.value.trim();
  const message = n_msg.value.trim();

  if (!title || !message) {
    alert("Fill all fields");
    return;
  }

  let notices = getData("notices");
  notices.unshift({
    id: Date.now(),
    title,
    message,
    date: new Date().toLocaleDateString()
  });
  setData("notices", notices);

  n_title.value = "";
  n_msg.value = "";

  renderNotices();
  updateStats();
}

function deleteNotice(id) {
  let notices = getData("notices").filter(n => n.id != id);
  setData("notices", notices);
  renderNotices();
  updateStats();
}

function renderNotices() {
  const list = document.getElementById("notice-list");
  if (!list) return;

  const notices = getData("notices");
  if (!notices.length) {
    list.innerHTML = "<p class='text-muted'>No notices.</p>";
    return;
  }

  list.innerHTML = notices.map(n => `
    <div class="card p-3 mb-2">
      <h5>${n.title}
        <button class="btn btn-danger btn-sm float-end" onclick="deleteNotice(${n.id})">Delete</button>
      </h5>
      <p>${n.message}</p>
      <small>${n.date}</small>
    </div>
  `).join("");
}

/* ---------- LOGOUT ---------- */
function logoutAdmin() {
  localStorage.removeItem("loggedAdmin");
  window.location.href = "first.html";
}

/* ---------- STATS ---------- */
function updateStats() {
  const flatsEl = document.getElementById("totalFlats");
  const complaintsEl = document.getElementById("totalComplaints");
  const noticesEl = document.getElementById("totalNotices");

  if (flatsEl) flatsEl.innerText = getData("flats").length;
  if (complaintsEl) complaintsEl.innerText = getData("complaints").length;
  if (noticesEl) noticesEl.innerText = getData("notices").length;
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderFlats();
  renderComplaints();
  renderNotices();
  updateStats();
});