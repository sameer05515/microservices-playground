const express = require("express");
const router = express.Router();
const { register, login } = require("../services/authService");

router.get("/login", (req, res) => res.render("login", { error: null }));
router.get("/register", (req, res) => res.render("register", { error: null }));

router.post("/register", async (req, res) => {
  try {
    await register(req.body.name, req.body.email, req.body.password);
    res.redirect("/auth/login?registered=1");
  } catch (e) {
    res.status(400).render("register", { error: e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { token } = await login(req.body.email, req.body.password);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000
    });
    res.redirect("/");
  } catch (e) {
    res.status(401).render("login", { error: e.message });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/auth/login");
});

module.exports = router;
