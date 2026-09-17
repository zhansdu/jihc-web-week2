fetch("components/navbar.html")
  .then(function (response) {
    return response.text();
  })
  .then(function (data) {
    document.querySelector("#navbar").innerHTML = data;
  });

fetch("components/footer.html")
  .then(function (response) {
    return response.text();
  })
  .then(function (data) {
    document.querySelector("footer").innerHTML = data;
  });
////
function openModal() {
  console.log("cliked");
  let logbtn = document.querySelector(".logbtn");
  logbtn.style.color = logbtn.style.color === "red" ? "black" : "red";
  let logcontainer = document.querySelector(".logcontainer");
  logcontainer.classList.toggle("open");
}

// Register Form Handling
let register = document.querySelector("#registerForm");
if (register) {
  register.addEventListener("submit", async function (event) {
    event.preventDefault();

    let user = {
      name: document.querySelector(".name").value,
      email: document.querySelector(".email1").value,
      password: document.querySelector(".password1").value,
      age: document.querySelector(".age").value,
    };

    const res = await fetch("http://localhost:4000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const result = await res.json();

    if (res.ok) {
      register.reset();
      document.querySelector(".registerMessage").textContent = result.message;
    } else {
      document.querySelector(".registerMessage").textContent = result.error;
    }
  });
}

// Users Table Loading
let userstable = document.querySelector(".usersTable");
if (userstable) {
  (async function () {
    const res = await fetch("http://localhost:4000/users");
    const result = await res.json();

    if (res.ok) {
      let users = result.users;
      userstable.innerHTML = "";
      for (let i = 0; i < users.length; i = i + 1) {
        let element = users[i];
        userstable.innerHTML += `<table>
        <thead>
          <tr>
            <th>${i + 1}</th>
            <th>${element.name}</th>
            <th>${element.email}</th>
            <th>${element.age}</th>
          </tr>
        </thead>
      </table>`;
      }
    } else {
      userstable.textContent = result.error || "Could not load users";
    }
  })();
}

// Login Form Handling
let loginForm = document.querySelector("#loginForm");
if (loginForm) {
  let loginMessage = document.querySelector(".loginMessage");
  let emailuse = loginForm.querySelector(".email");
  let passworduse = loginForm.querySelector(".password");

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    let loginData = {
      email: emailuse.value,
      password: passworduse.value,
    };

    const res = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    const result = await res.json();

    if (res.ok) {
      alert(result.message);
      let logbtn = document.querySelector(".logbtn");
      if (logbtn) {
        logbtn.textContent = "Logged in";
        logbtn.style.color = "green";
      }
      document.querySelector(".logcontainer").classList.remove("open");
    } else {
      loginMessage.textContent = result.error;
    }
  });
}
