import "dotenv/config";
import http from "node:http";
import parse from "co-body";
import pg from "pg";
import bcrypt from "bcrypt";

interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
}

interface AuthBody {
  username?: string;
  email?: string;
  password?: string;
}

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
});

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, OPTIONS, PUT, DELETE",
  );

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    return res.end();
  }

  if (req.url === "/users" && req.method === "GET") {
    if (!req.url) return;
    try {
      const result = await pool.query<User>(
        "SELECT id, username, email FROM users ORDER BY id DESC",
      );
      res.statusCode = 200;
      return res.end(JSON.stringify(result.rows));
    } catch (err) {
      console.error("error with getting users:", err);
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: "Server error" }));
    }
  }

  if (req.url?.startsWith("/users/") && req.method === "DELETE") {
    if (!req.url) return;
    const userId = req.url?.split("/")[2];

    if (!userId) {
  res.statusCode = 400;
  return res.end(JSON.stringify({ error: "User ID is missing" }));
} 

    try {
      const result = await pool.query(
        "DELETE FROM users WHERE id = $1 RETURNING id",
        [userId],
      );

      if (result.rows.length === 0) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: "User not found" }));
      }

      res.statusCode = 200;
      return res.end(JSON.stringify({ message: "User deleted successfully" }));
    } catch (err) {
      console.error("Error deleting user:", err);
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: "Server error" }));
    }
  }

  if (req.url?.startsWith("/users/edit/") && req.method === "PUT") {
    if (!req.url) return;
    const userId = req.url?.split("/")[3];

    if (!userId) {
  res.statusCode = 400;
  return res.end(JSON.stringify({ error: "User ID is missing" }));
}

    try {
      const body = await parse.json(req);
      
      const { username, email } = body;

      await pool.query(
        "UPDATE users SET username = $1, email = $2 WHERE id = $3",
        [username, email, userId],
      );

      res.statusCode = 200;
      return res.end(JSON.stringify({ message: "User updated successfully" }));
    } catch (err) {
      console.error("Error updating user:", err);
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: "Server error" }));
    }
  }

  if (req.url === "/register" && req.method === "POST") {
    if (!req.url) return;
    try {
      const body = await parse.json(req) as AuthBody;
      const { username, password, email } = body;

      if (!username || !password || !email) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: "Fill in all fields!" }));
      }

      const checkUser = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email],
      );

      if (checkUser.rows.length > 0) {
        res.statusCode = 400;
        return res.end(
          JSON.stringify({
            error: "User with that email already exists!",
          }),
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await pool.query(
        "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id, username, email",
        [username, hashedPassword, email],
      );

      res.statusCode = 201;
      return res.end(
        JSON.stringify({
          message: "Welcome!",
          user: result.rows[0],
        }),
      );
    } catch (err) {
      console.error("Error during registration:", err);
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: "Server error" }));
    }
  }

  if (req.url === "/login" && req.method === "POST") {
    if (!req.url) return;
    try {
      const body = await parse.json(req);
      const { email, password } = body;

      if (!email || !password) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: "Fill in all fields!" }));
      }

      const result = await pool.query(
        "SELECT id, username, email, password FROM users WHERE email = $1",
        [email],
      );

      if (result.rows.length === 0) {
        res.statusCode = 401;
        return res.end(JSON.stringify({ error: "Wrong email or password" }));
      }

      const user = result.rows[0] as User;

      const isPasswordCorrect = await bcrypt.compare(password, user.password!);

      if (!isPasswordCorrect) {
        res.statusCode = 401;
        return res.end(JSON.stringify({ error: "Wrong email or password" }));
      }

      const userResponse: Partial<User> = { ...user };
      delete userResponse.password;

      res.statusCode = 200;
      return res.end(
        JSON.stringify({
          message: "Successful login!",
          user,
        }),
      );
    } catch (err) {
      console.error("Error during login:", err);
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: "Server error" }));
    }
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(5000, () => {
  console.log("Server is listening on port 5000");
});