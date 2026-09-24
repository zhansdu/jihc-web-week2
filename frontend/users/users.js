const userCount = document.getElementById("userCount");

async function renderUsersTable() {
  const tableBody = document.getElementById("usersTableBody");
  if (!tableBody) return;

  try {
    const response = await fetch("http://localhost:3000/users");
    const users = await response.json();
    tableBody.innerHTML = "";

    if (users.length === 0) {
      if (userCount) {
        userCount.textContent = "There are 0 users registered";
      }
      tableBody.innerHTML =
        "<tr><td colspan='2'>No one has registered yet.</td></tr>";
      return;
    }

    if (userCount) {
      userCount.textContent = `There are ${users.length} users registered`;
    }

    users.forEach((user) => {
      const row = document.createElement("tr");

      const usernameCell = document.createElement("td");
      usernameCell.textContent = user.username;

      const emailCell = document.createElement("td");
      emailCell.textContent = user.email;

      const actionCell = document.createElement("td");

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className = "btn btn-outline small";
      editBtn.addEventListener("click", () =>
        handleEdit(user.id, user.username),
      );

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "btn btn-outline small";
      deleteBtn.addEventListener("click", () => handleDelete(user.id));

      actionCell.append(editBtn, deleteBtn);

      row.append(usernameCell, emailCell, actionCell);
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Failed to load users", error);
  }
}

async function handleEdit(id, currentUsername) {
  const newUsername = prompt("New username:", currentUsername);

  if (!newUsername || newUsername.trim() === "") return;

  try {
    const response = await fetch(`http://localhost:3000/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: newUsername.trim() }),
    });
    const result = await response.json();

    if (!response.ok) {
      alert(result.error);
      return;
    }

    renderUsersTable();
  } catch (error) {
    console.error("Failed to update user", error);
    alert("Server error");
  }
}

async function handleDelete(id) {
  const sure = confirm("Delete this user?");
  if (!sure) return;

  try {
    const response = await fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();

    if (!response.ok) {
      alert(result.error);
      return;
    }

    renderUsersTable();
  } catch (error) {
    console.error("Failed to delete user", error);
    alert("Server error");
  }
}

renderUsersTable();
