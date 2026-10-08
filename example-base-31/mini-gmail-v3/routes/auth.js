const express = require("express");
const router = express.Router();
const auth = require("../services/authService");

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: false,
  maxAge: 24 * 60 * 60 * 1000
};

router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

router.post("/login", async (req, res) => {
  try {
    const result = await auth.login(
      req.body.email,
      req.body.password
    );

    res.cookie(
      "access_token",
      result.token,
      cookieOptions
    );

    res.redirect("/mail/inbox");
  } catch (error) {
    res.render("login", {
      error: error.message
    });
  }
});

router.get("/register", (req, res) => {
  res.render("register", { error: null });
});

router.post("/register", async (req, res) => {
  try {
    const result = await auth.register(
      req.body.name,
      req.body.email,
      req.body.password
    );

    res.cookie(
      "access_token",
      result.token,
      cookieOptions
    );

    res.redirect("/mail/inbox");
  } catch (error) {
    res.render("register", {
      error: error.message
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.redirect("/login");
});

module.exports = router;
