const express = require("express");
const session = require("express-session");
const path = require("path");

const authRoutes = require("./routes/auth");
const mailRoutes = require("./routes/mail");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: "mini-gmail-secret",
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.get("/", (req, res) => {
  res.redirect(req.session.user ? "/mail/inbox" : "/login");
});

app.use("/", authRoutes);
app.use("/mail", mailRoutes);

app.use((req, res) => res.status(404).send("Page not found"));

app.listen(3078, () => {
  console.log("Mini Gmail running at http://localhost:3078");
});