require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const mailRoutes = require("./routes/mail");
const apiRoutes = require("./routes/api");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.use("/", authRoutes);
app.use("/mail", mailRoutes);
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.redirect("/mail/inbox");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal server error");
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Mini Gmail v3 running at http://localhost:${PORT}`);
  });
});
