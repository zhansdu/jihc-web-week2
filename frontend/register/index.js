const form = document.getElementById("registrationForm");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;

  const user = {
    username: name,
    email: email,
    phone: phone,
    password: password,
  };

  async function registerUser() {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      window.location.href = "/index.html";
    }
  }
  registerUser();
});
