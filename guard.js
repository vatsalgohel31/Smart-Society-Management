// Check login
if (!localStorage.getItem("loggedGuard")) {
  window.location.href = "first.html";
}

// ---------- GET DATA HELPER ----------
function getData(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function setData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ---------- ADD VISITOR ----------
function addVisitor() {
  const flatId = document.getElementById("flatId").value.trim().toUpperCase();
  const visitorName = document.getElementById("visitorName").value.trim();
  const purpose = document.getElementById("purpose").value.trim();


  if (!flatId || !visitorName || !purpose)
    return alert("Fill all fields");

  let logs = getData("gateLogs");

  logs.push({
    id: Date.now(),
    flatId,
    visitorName,
    purpose,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
  });

  setData("gateLogs", logs);

  g_flat.value = "";
  g_name.value = "";
  g_purpose.value = "";

  alert("Visitor entry added");
  renderLogs();
}

// ---------- RENDER LOGS ----------
function renderLogs() {
  const list = document.getElementById("guard-logs");
  if (!list) return;

  const logs = getData("gateLogs");

  if (!logs.length) {
    list.innerHTML = "<p>No visitor logs.</p>";
    return;
  }

  list.innerHTML = logs.map(l => `
    <div class="visitor-entry">
      <div class="v-info"><strong>${l.visitorName}</strong> → ${l.flatId}</div>
      <div class="v-time">${l.date} ${l.time}</div>
      <div class="v-purpose">${l.purpose}</div>
    </div>
  `).join("");
}

// ---------- VERIFY GUEST ----------
function verifyGuest() {
  const name = document.getElementById("g_name").value.trim();
  const pin = document.getElementById("g_pin").value.trim();

  if (!name || !pin) return alert("Fill all fields");

  let guests = getData("guestCodes");

  const guest = guests.find(g => g.guestName.toLowerCase() === name.toLowerCase() && g.code.toString()=== pin);

  if (!guest) return alert("Wrong PIN or guest not found");
  if (guest.verified) return alert("Guest already verified");

  // Mark as verified
  guest.verified = true;
  setData("guestCodes", guests);

  // Add to visitor logs
  let logs = getData("gateLogs");
  logs.push({
    id: Date.now(),
    flatId: guest.resident,
    visitorName: guest.guestName,
    purpose: "Guest Visit",
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
  });
  setData("gateLogs", logs);

  alert("Guest verified and allowed in!");
  renderLogs();

  document.getElementById("pre_name").value = "";
  document.getElementById("pre_pin").value = "";
}

// ---------- LOGOUT ----------
function logoutGuard() {
  localStorage.removeItem("loggedGuard");
  window.location.href = "first.html";
}

// ---------- INIT ----------
renderLogs();
