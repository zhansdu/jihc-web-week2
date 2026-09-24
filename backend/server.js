import http from "http";
import fs from "fs";
import { json } from "co-body";

const dataPath = "./data.json";

function getUsers() {
  const data = fs.readFileSync(dataPath, "utf8");
  return JSON.parse(data);
}

function saveUsers(users) {
  fs.writeFileSync(dataPath, JSON.stringify(users));
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/users") {
    const users = getUsers();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
    return;
  }

  if (req.method === "POST" && req.url === "/register") {
    try {
      const newUser = await json(req);
      const users = getUsers();

      users.push(newUser);
      saveUsers(users);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User registered successfullyy" }));
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid request" }));
    }
    return;
  }

  if (req.method === "POST" && req.url === "/login") {
    try {
      const loginData = await json(req);

      const users = getUsers();

      const user = users.find(
        (user) =>
          user.username === loginData.username &&
          user.password === loginData.password,
      );

      if (user) {
        res.writeHead(200, { "Content-Type": "application/json" });

        res.end(JSON.stringify({ message: "Login successful" }));
      } else {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Incorrect username or password" }));
      }
    } catch (error) {
      console.error("error : ", error);

      res.writeHead(400, { "Content-Type": "application/json" });

      res.end(JSON.stringify({ message: "Invalid request" }));
    }
    return;
  }
});

server.listen(3000, () => {
  console.log("Server is runningg on 3000");
});
