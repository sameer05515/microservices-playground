require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const { loadUser } = require("./middleware/auth");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(loadUser);

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.mailStats = res.locals.mailStats || { unread: 0, drafts: 0, starred: 0 };
  next();
});

app.get("/", (req, res) => {
  if (!req.user) return res.redirect("/auth/login");
  res.redirect("/?box=inbox");
});

app.use("/auth", require("./routes/auth"));
app.use("/mail", require("./routes/mail"));
app.use("/api", require("./routes/api"));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Mini Gmail v4 running at http://localhost:${PORT}`)))
  .catch(err => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
