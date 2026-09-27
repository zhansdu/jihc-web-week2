import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post('/register', async (req, res) => {
    const { fname, lname, email, password, number } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users (fname, lname, email, password, number) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [fname, lname, email, password, number]
        );
        res.json({ message: 'done', user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND password = $2',
            [email, password]
        );

        if (result.rows.length > 0) {
            res.json({ success: true });
        } else {
            res.status(400).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { fname, lname, email, number } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET fname = $1, lname = $2, email = $3, number = $4 WHERE id = $5 RETURNING *',
            [fname, lname, email, number, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User updated successfully', user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM users WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});