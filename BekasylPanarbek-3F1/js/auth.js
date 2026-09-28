const API_URL = "http://localhost:3000";

document
  .getElementById("registerForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    const user = {
      name: name,
      email: email,
      password: password,
    };

    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      const modalElement = document.getElementById("successModal");
      const modal = new bootstrap.Modal(modalElement);
      modal.show();

      renderUsersTable();
    } else {
      console.log("Registration failed");
    }
  });

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const modalElement = document.getElementById("loginModal");
    const modalTitle = document.getElementById("loginModalTitle");
    const modalText = document.getElementById("loginModalText");
    const modal = new bootstrap.Modal(modalElement);

    if (response.ok) {
      modalTitle.textContent = "Success";
      modalText.textContent = "Login successful!";
    } else {
      modalTitle.textContent = "Error";
      modalText.textContent = "Invalid email or password";
    }

    modal.show();
  });

async function renderUsersTable() {
  const response = await fetch(`${API_URL}/users`);
  const users = await response.json();

  const tbody = document.getElementById("usersTableBody");
  tbody.innerHTML = "";

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.password}</td>
    `;

    tbody.appendChild(row);
  }
}

renderUsersTable();
