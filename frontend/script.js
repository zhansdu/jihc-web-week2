const modal = document.getElementById('authModal');
const openBtn = document.getElementById('openLoginBtn');
const closeBtn = document.getElementById('closeModalBtn');
const tabLogin = document.getElementById('tabLoginBtn');
const tabReg = document.getElementById('tabRegisterBtn');
const formLogin = document.getElementById('loginForm');
const formReg = document.getElementById('registerForm');

openBtn.onclick = (e) => {
    e.preventDefault();
    modal.style.display = 'flex';
};

closeBtn.onclick = () => {
    modal.style.display = 'none';
};

window.onclick = (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
};

tabLogin.onclick = () => {
    formLogin.style.display = 'flex';
    formReg.style.display = 'none';

    tabLogin.classList.add('active');
    tabReg.classList.remove('active');
};

tabReg.onclick = () => {
    formLogin.style.display = 'none';
    formReg.style.display = 'flex';

    tabLogin.classList.remove('active');
    tabReg.classList.add('active');
};


// REGISTER
formReg.onsubmit = async (e) => {
    e.preventDefault();

    const user = {
        name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        destination: document.getElementById('regDestination').value,
        password: document.getElementById('regPassword').value
    };

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        const data = await response.json();

        alert(data.message);

        if (response.ok) {
            formReg.reset();
            modal.style.display = 'none';
        }
    } catch (error) {
        alert('Server is not running');
        console.log(error);
    }
};


// LOGIN
formLogin.onsubmit = async (e) => {
    e.preventDefault();

    const user = {
        username: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        const data = await response.json();

        alert(data.message);

        if (data.message === 'Login successful') {
            formLogin.reset();
            modal.style.display = 'none';
        }
    } catch (error) {
        alert('Server is not running');
        console.log(error);
    }
};


// GET USERS
async function getUsers() {
    const response = await fetch('http://localhost:3000/users');
    const users = await response.json();

    const table = document.getElementById('usersTableBody');

    if (!table) {
        return;
    }

    table.innerHTML = '';

    users.forEach((user, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.destination}</td>
        `;

        table.appendChild(row);
    });
}

getUsers();