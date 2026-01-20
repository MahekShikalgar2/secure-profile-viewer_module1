// server.js
const express = require("express");
const app = express();
const users = require("./users");

app.use(express.json());
app.use(express.static("public"));

let loggedInUser = null;

// LOGIN API
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  loggedInUser = users.find(
    u => u.username === username && u.password === password
  );

  if (loggedInUser) {
    res.json({ success: true, userId: loggedInUser.id });
  } else {
    res.status(401).json({ success: false });
  }
});

// ✅ SECURE PROFILE ROUTE (IDOR FIX)
app.get("/profile/:id", (req, res) => {
  if (!loggedInUser || loggedInUser.id != req.params.id) {
    return res.status(403).json({ message: "Access Denied" });
  }
  res.json(loggedInUser);
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
