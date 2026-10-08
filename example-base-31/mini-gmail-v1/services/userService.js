const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "../data/users.json");

function getUsers() {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function authenticate(email, password) {
  const user = getUsers().find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  return user || null;
}

module.exports = { getUsers, authenticate };