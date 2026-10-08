const express = require("express");
const router = express.Router();

const { requireApiAuth } = require("../middleware/auth");
const mail = require("../services/mailService");

router.use(requireApiAuth);

router.get("/mail/inbox", async (req, res) => {
  const result = await mail.mailbox(
    req.user.id,
    "inbox",
    Number(req.query.page || 1),
    req.query.q || ""
  );

  res.json(result);
});

router.get("/mail/sent", async (req, res) => {
  const result = await mail.mailbox(
    req.user.id,
    "sent",
    Number(req.query.page || 1),
    req.query.q || ""
  );

  res.json(result);
});

router.get("/mail/:id", async (req, res) => {
  const email = await mail.getById(
    req.params.id,
    req.user.id
  );

  if (!email) {
    return res.status(404).json({
      error: "Email not found"
    });
  }

  res.json(email);
});

router.post("/mail/send", async (req, res) => {
  try {
    const email = await mail.send(
      req.user.id,
      req.body.to,
      req.body.subject,
      req.body.body
    );

    res.status(201).json(email);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

router.get("/stats", async (req, res) => {
  res.json(await mail.getStats(req.user.id));
});

module.exports = router;
