let role = "";

function openLogin(r) {
  role = r;

  const userIdInput = document.getElementById("userid");
  const pinInput = document.getElementById("pin");

  // Reset fields
  userIdInput.value = "";
  pinInput.value = "";

  // Show UserID ONLY for resident
  if (role === "resident") {
    userIdInput.style.display = "block";
  } else {
    userIdInput.style.display = "none";
  }

  new bootstrap.Modal(document.getElementById("loginModal")).show();
}


function login() {
  const pin = document.getElementById("pin").value.trim();

  // ADMIN LOGIN
  if (role === "admin") {
    // Max 8 characters
    if (pin.length > 8) {
      alert("Admin PIN must be a maximum of 8 characters.");
      return;
    }
    // At least 1 uppercase letter
    if (!/[A-Z]/.test(pin)) {
      alert("Admin PIN must contain at least 1 uppercase letter.");
      return;
    }
    // At least 1 number
    if (!/[0-9]/.test(pin)) {
      alert("Admin PIN must contain at least 1 number.");
      return;
    }
    // At least 1 special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]/.test(pin)) {
      alert("Admin PIN must contain at least 1 special character (e.g. @, #, $).");
      return;
    }
    if (pin === "Admin@1") {
      localStorage.setItem("loggedAdmin", true);
      window.location.href = "admin.html";
    } else {
      alert("Wrong Admin PIN");
    }
    return;
  }

  // RESIDENT LOGIN
  if (role === "resident") {
    const userId = document.getElementById("userid").value.trim().toUpperCase();

    const residents = getData("residents");

    const resident = residents.find(
      r => r.flatId === userId && r.pin === pin
    );

    if (!resident) {
      alert("Invalid User ID or PIN");
      return;
    }

    // Save session
    localStorage.setItem("loggedResident", userId);

    window.location.href = "resident.html";
    return;
  }

  // GUARD LOGIN (simple for now)
  if (role === "guard") {
    if (pin === "1111") {
      localStorage.setItem("loggedGuard", true);
      window.location.href = "guard.html";
    } else {
      alert("Wrong Guard PIN");
    }
  }
}

function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}