import http from 'http';
import CoBody from 'co-body';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    database: 'travel_db',
    user: 'adin',
    host: 'localhost',
    port: 5432
});

pool.query('SELECT NOW()', (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Database connected!');
    }
});

async function registerUser(req) {
    const body = await CoBody.json(req);

    await pool.query(
        `INSERT INTO users (name, email, destination, password)
         VALUES ($1, $2, $3, $4)`,
        [
            body.name,
            body.email,
            body.destination,
            body.password
        ]
    );

    return {
        message: 'User registered successfully'
    };
}

async function updateUser(req) {
    const id = req.url.split('/')[2];

    const body = await CoBody.json(req);

    await pool.query(
        `UPDATE users
         SET name = $1
         WHERE id = $2`,
        [body.name, id]
    );

    return {
        message: 'User updated successfully'
    };
}

async function deleteUser(req) {
    const id = req.url.split('/')[2];

    await pool.query(
        `DELETE FROM users
         WHERE id = $1`,
        [id]
    );

    return {
        message: 'User deleted successfully'
    };
}

function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });

    res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
        sendResponse(res, 200, {});
        return;
    }

    try {
        if (req.method === 'GET' && req.url === '/users') {
        const result = await pool.query('SELECT * FROM users');

        sendResponse(res, 200, result.rows);
        return;
}

        if (req.method === 'POST' && req.url === '/register') {
            const result = await registerUser(req);
            sendResponse(res, 200, result);
            return;
        }

        if (req.method === 'POST' && req.url === '/login') {
            const result = await loginUser(req);
            sendResponse(res, 200, result);
            return;
        }

        if (req.method === 'PUT' && req.url.startsWith('/users/')) {
            const result = await updateUser(req);
            sendResponse(res, 200, result);
            return;
        }

        if (req.method === 'DELETE' && req.url.startsWith('/users/')) {
            const result = await deleteUser(req);
            sendResponse(res, 200, result);
            return;
        }

        sendResponse(res, 404, {
            message: 'Not found'
        });
    } catch (error) {
        console.log(error);

        sendResponse(res, 500, {
            message: 'Server error'
        });
    }
});

server.listen(3000, () => {
    console.log('Server started on port 3000');
});