const flatId = localStorage.getItem("loggedResident");
if (!flatId) {
  window.location.href = "first.html";
}

/* ---------- COMPLAINT ---------- */
function getData(key){ return JSON.parse(localStorage.getItem(key)) || []; }
function setData(key,data){ localStorage.setItem(key,JSON.stringify(data)); }

function submitComplaint() {
  const title = document.getElementById("c_title").value.trim();
  const details = document.getElementById("c_details").value.trim();

  if (!title || !details) return alert("Fill all fields");

  let complaints = getData("complaints");

  complaints.push({
    id: Date.now(),
    flatId,
    title,
    details,
    date: new Date().toLocaleDateString(),
    status: "Pending"
  });

  setData("complaints", complaints);

  document.getElementById("c_title").value = "";
  document.getElementById("c_details").value = "";

  alert("Complaint submitted");
  renderMyComplaints();
}

function renderMyComplaints() {
  const list = document.getElementById("my-complaints");
  if (!list) return;

  const complaints = getData("complaints").filter(c => c.flatId === flatId);

  if (!complaints.length) {
    list.innerHTML = "<p>No complaints yet.</p>";
    return;
  }

  list.innerHTML = complaints.map(c => `
    <div class="card p-2 mb-2">
      <h6>${c.title}</h6>
      <p>${c.details}</p>
      <small>Status: ${c.status}</small>
    </div>
  `).join("");
}

/* ---------- NOTICES ---------- */
function renderResidentNotices() {
  const list = document.getElementById("resident-notices");
  if (!list) return;

  const notices = getData("notices");

  if (!notices.length) {
    list.innerHTML = "<p>No notices</p>";
    return;
  }

  list.innerHTML = notices.map(n => `
    <div class="card p-2 mb-2">
      <h6>${n.title}</h6>
      <p>${n.message}</p>
      <small>${n.date}</small>
    </div>
  `).join("");
}

/* ---------- VISITORS ---------- */
function renderVisitors() {
  const list = document.getElementById("visitor-list");
  if (!list) return;

  const logs = getData("gateLogs").filter(g => g.flatId === flatId);

  if (!logs.length) {
    list.innerHTML = "<p>No visitors yet.</p>";
    return;
  }

  list.innerHTML = logs.map(v => `
    <div class="card p-2 mb-2">
      <p>${v.visitorName} - ${v.purpose}</p>
      <small>${v.date} ${v.time}</small>
    </div>
  `).join("");
}

// Check login
if (!localStorage.getItem("loggedResident")) {
  window.location.href = "first.html";
}

// ---------- GUEST CODE ----------
function generateGuest() {
  const name = document.getElementById("guestName").value.trim();
  const date = document.getElementById("guestDate").value;

  if (!name || !date) return alert("Fill all fields");

  // Get existing guest codes from localStorage
  let guests = JSON.parse(localStorage.getItem("guestCodes") || "[]");

  // Generate unique 4-digit code
  const code = Math.floor(1000 + Math.random() * 9000);

  guests.push({
    resident: localStorage.getItem("loggedResident"),
    guestName: name,
    date,
    code,
    verified: false // mark as not yet verified
  });

  localStorage.setItem("guestCodes", JSON.stringify(guests));

  document.getElementById("guestResult").innerText = `Guest Code: ${code}`;
  document.getElementById("guestName").value = "";
  document.getElementById("guestDate").value = "";
}


/* ---------- LOGOUT ---------- */
function logoutResident() {
  localStorage.removeItem("loggedResident");
  window.location.href = "first.html";
}

/* ---------- INIT ---------- */
renderMyComplaints();
renderResidentNotices();
renderVisitors();
