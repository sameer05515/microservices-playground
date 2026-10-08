const express = require("express");
const router = express.Router();
const userService = require("../services/userService");

router.get("/login", (req, res) => {
  if (req.session.user) return res.redirect("/mail/inbox");
  res.render("login", { error: null });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = userService.authenticate(email, password);

  if (!user) return res.render("login", { error: "Invalid email or password" });

  req.session.user = {
    id: user.id,
    name: user.name,
    email: user.email
  };

  res.redirect("/mail/inbox");
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

module.exports = router;