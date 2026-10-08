const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const emailService = require("../services/emailService");

router.use(auth);

router.get("/inbox", (req, res) => {
  res.render("inbox", {
    emails: emailService.getInbox(req.session.user.email),
    page: "inbox",
    search: ""
  });
});

router.get("/sent", (req, res) => {
  res.render("sent", {
    emails: emailService.getSent(req.session.user.email),
    page: "sent",
    search: ""
  });
});

router.get("/compose", (req, res) => {
  res.render("compose", { error: null });
});

router.post("/send", (req, res) => {
  const { to, subject, body } = req.body;

  if (!to || !subject || !body) {
    return res.render("compose", { error: "All fields are required" });
  }

  emailService.sendEmail({
    from: req.session.user.email,
    to, subject, body
  });

  res.redirect("/mail/sent");
});

router.get("/view/:id", (req, res) => {
  const email = emailService.markAsRead(req.params.id);

  if (!email) return res.status(404).send("Email not found");

  if (email.from !== req.session.user.email && email.to !== req.session.user.email) {
    return res.status(403).send("Access denied");
  }

  res.render("email", { email, page: "inbox", search: "" });
});

router.post("/delete/:id", (req, res) => {
  emailService.deleteEmail(req.params.id);
  res.redirect("/mail/inbox");
});

router.get("/search", (req, res) => {
  const search = req.query.q || "";
  res.render("inbox", {
    emails: emailService.search(req.session.user.email, search),
    page: "search",
    search
  });
});

module.exports = router;