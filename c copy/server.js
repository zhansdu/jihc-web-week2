import http from "node:http"; 
import { readFileSync, writeFileSync } from "node:fs"
import { json } from "co-body";

const server = http.createServer(async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/users") {
    const users = JSON.parse(readFileSync("./data.json", "utf-8"));
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ users: users }));
    return;
  }
  //create
  if (req.method === "POST" && req.url === "/register") {
    const body = await json(req);
    const users = JSON.parse(readFileSync("./data.json", "utf-8"));
    let userExists = false;
    for (let i = 0; i < users.length; i = i + 1) {
      if (users[i].email === body.email) {
        userExists = true;
        break;
      }
    }
    if (userExists) {
      res.writeHead(400, { "Content-Type": "application/json" });//pl
      res.end(JSON.stringify({ error: "User with this email already exists" }));
      return;
    }
    users.push(body);
    writeFileSync("./data.json", JSON.stringify(users, null, 2));
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Registration saved" }));
    return; 
  }
  //
  if (req.method === "POST" && req.url === "/login") {
    const body = await json(req);
    const users = JSON.parse(readFileSync("./data.json", "utf-8"));
    const user = users.find(function (element) {
      return element.email === body.email && element.password === body.password;
    });

    if (user) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Logged in", user: user }));
    } else {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Email or password is wrong" }));
    }
    return;
  }
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});
server.listen(4000, function () {
  console.log("Server is running on port 4000");
});