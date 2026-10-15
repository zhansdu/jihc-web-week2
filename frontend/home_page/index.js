const nav = document.getElementById("nav");
const footer = document.getElementById("footer");
fetch("../components/nav.html")
  .then((res) => res.text())
  .then((data) => {
    const nav = document.getElementById("nav");
    if (nav) nav.innerHTML = data;
  });

fetch("../components/footer.html")
  .then((res) => res.text())
  .then((data) => {
    const footer = document.getElementById("footer");
    if (footer) footer.innerHTML = data;
  });

function openModal() {
  document.getElementById("contactModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("contactModal").style.display = "none";
}

function logIn() {
  document.getElementById("login").style.display = "flex";
}

function closeLoginModal() {
  document.getElementById("login").style.display = "none";
}

const usersList = document.getElementById("usersList");

async function korsetu() {
  if (!usersList) return;
  try {
    const res = await fetch("http://localhost:5000/users");
    const users = await res.json();

    usersList.innerHTML = "";
    users.forEach((user) => {
      usersList.innerHTML += `
        <tr>
          <td>${user.username}</td>
          <td>${user.email || '-'}</td>
        </tr>
      `;
    });
  } catch (err) {
    console.error("Error fetching users:", err);
  }
}

korsetu();



async function submitForm(e) {
  if (e) e.preventDefault();

  let usernameInput = document.querySelector(".usernameInput");
  let emailInput = document.querySelector(".email");
  let passwordInput = document.querySelector(".password");

  const username = usernameInput ? usernameInput.value.trim() : "";
  const password = passwordInput ? passwordInput.value.trim() : "";
  const email = emailInput ? emailInput.value.trim() : "";

  if (!username || !password || !email) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, email }),
    });

    const result = await res.json();

    if (res.ok) {
      alert(result.message || "Registration successful!");
      closeModal();

      if (usernameInput) usernameInput.value = "";
      if (emailInput) emailInput.value = "";
      if (passwordInput) passwordInput.value = "";

      korsetu(); 
    } else {
      alert(result.error || "Registration failed.");
    }
  } catch (err) {
    console.error("Register Error:", err);
    alert("Server error. Please try again later.");
  }
}

async function logInBas(e) {
  if (e) e.preventDefault();
  let loginEmail = document.querySelector(".loginEmail");
  let loginPassword = document.querySelector(".loginPassword");

  const email = loginEmail ? loginEmail.value.trim() : "";
  const password = loginPassword ? loginPassword.value.trim() : "";

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message || "Welcome back!");
      closeLoginModal();

      localStorage.setItem("user", JSON.stringify(data.user));

      if (loginEmail) loginEmail.value = "";
      if (loginPassword) loginPassword.value = "";
    } else {
      alert(data.error || "Wrong credentials. Please try again.");
    }
  } catch (err) {
    console.error("Login Error:", err);
    alert("Server error. Please try again later.");
  }
}
