const cors = require('cors');
const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const SALT_ROUNDS = 10;

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, gmail, created_at FROM users ORDER BY id'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/register', async (req, res) => {
  try {
    const { name, gmail, password } = req.body;

    if (!name || !gmail || !password) {
      return res.status(400).json({ message: 'name, gmail and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      'INSERT INTO users (name, gmail, password) VALUES ($1, $2, $3) RETURNING id, name, gmail',
      [name, gmail, hashedPassword]
    );

    res.json({ message: 'User registered', user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'This email is already registered' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { gmail, password } = req.body;

    if (!gmail || !password) {
      return res.status(400).json({ message: false });
    }

    const result = await pool.query('SELECT * FROM users WHERE gmail = $1', [gmail]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: false });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (passwordMatches) {
      res.json({ message: true });
    } else {
      res.status(401).json({ message: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'name is required' });
    }

    const result = await pool.query(
      'UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, gmail',
      [name, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Username updated', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /users/:id - delete a user
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, name, gmail',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});