function loadNavbar() {
  const modal = document.getElementById("loginModal");

  document.getElementById("modalLink").addEventListener("click", () => {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  });

  document.getElementById("close").addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  });

  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    const data = {
      username: username,
      password: password,
    };

    async function loginUser() {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        window.alert("Successful login !");
        window.location.href = "/index.html";
      } else {
        const error = document.getElementById("loginError");
        error.textContent = "Incorrect username or password";
        error.classList.remove("hidden");
      }
    }
    loginUser();
  });
}
