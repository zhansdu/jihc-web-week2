const nav = document.getElementById("nav");
const footer = document.getElementById("footer");

const componentUrl = (fileName) =>
  new URL(`components/${fileName}`, document.currentScript.src);

const loadComponent = async (element, fileName) => {
  const response = await fetch(componentUrl(fileName));

  if (!response.ok) {
    throw new Error(`Could not load ${fileName}: ${response.status}`);
  }

  element.innerHTML = await response.text();
};

if (nav) {
  loadComponent(nav, "nav.html").catch(console.error);
}

if (footer) {
  loadComponent(footer, "footer.html").catch(console.error);
}

async function jukteUsers() {
  try {
    const res = await fetch("http://localhost:5000/users");
    const users = await res.json();
    const tbody = document.getElementById("usersList");
    if (!tbody) return;

    tbody.innerHTML = "";
    users.forEach((u) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${u.username}</td>
        <td>${u.email ?? "-"}</td>
        <td>
          <button class="editBtn" onclick="edit(${u.id}, '${u.username}', '${u.email || ""}')">Edit</button>
          <button class="deleteBtn" onclick="deleteUser(${u.id})">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Users load error:", err);
  }
}

jukteUsers();

async function deleteUser(userId) {
  if (!confirm("Are u sure about it?")) return;

  try {
    const res = await fetch(`http://localhost:5000/users/${userId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      jukteUsers(); 
    } else {
      console.error("Error deleting user:", await res.text());
    }
  } catch (err) {
    console.error("Error deleting user:", err);
  }
}

async function edit(userId, currentUsername, currentEmail) {
  const newName = prompt("Enter new username:", currentUsername);
  const newEmail = prompt("Enter new email:", currentEmail);

  if (!newName || !newEmail) return;

  try {
    const res = await fetch(`http://localhost:5000/users/edit/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: newName, email: newEmail }),
    });

    if (res.ok) {
      jukteUsers(); 
    } else {
      console.error("Error editing user:", await res.text());
    }
  } catch (err) {
    console.error("Error editing user:", err);
  }
}