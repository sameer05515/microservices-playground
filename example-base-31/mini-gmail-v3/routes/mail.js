const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/auth");
const mail = require("../services/mailService");

router.use(requireAuth);

async function renderMailbox(req, res, type, title) {
  const page = Math.max(
    1,
    Number.parseInt(req.query.page || "1", 10)
  );

  const search = (req.query.q || "").trim();

  const result = await mail.mailbox(
    req.user.id,
    type,
    page,
    search
  );

  const stats = await mail.getStats(req.user.id);

  res.render("mailbox", {
    title,
    type,
    search,
    ...result,
    ...stats
  });
}

router.get("/inbox", async (req, res) =>
  renderMailbox(req, res, "inbox", "Inbox")
);

router.get("/sent", async (req, res) =>
  renderMailbox(req, res, "sent", "Sent")
);

router.get("/starred", async (req, res) =>
  renderMailbox(req, res, "starred", "Starred")
);

router.get("/trash", async (req, res) =>
  renderMailbox(req, res, "trash", "Trash")
);

router.get("/drafts", async (req, res) =>
  renderMailbox(req, res, "drafts", "Drafts")
);

router.get("/search", async (req, res) =>
  renderMailbox(req, res, "inbox", "Search")
);

router.get("/compose", async (req, res) => {
  let email = null;

  if (req.query.draft) {
    email = await mail.getById(
      req.query.draft,
      req.user.id
    );

    if (!email || !email.draft) {
      email = null;
    }
  }

  const stats = await mail.getStats(req.user.id);

  res.render("compose", {
    email,
    error: null,
    ...stats
  });
});

router.post("/send", async (req, res) => {
  try {
    await mail.send(
      req.user.id,
      req.body.to,
      req.body.subject,
      req.body.body,
      req.body.id
    );

    res.redirect("/mail/sent");
  } catch (error) {
    const stats = await mail.getStats(req.user.id);

    res.render("compose", {
      email: req.body,
      error: error.message,
      ...stats
    });
  }
});

router.post("/draft", async (req, res) => {
  await mail.saveDraft(req.user.id, req.body);
  res.redirect("/mail/drafts");
});

router.get("/view/:id", async (req, res) => {
  const email = await mail.getById(
    req.params.id,
    req.user.id
  );

  if (!email) {
    return res.status(404).send("Email not found");
  }

  if (!email.draft) {
    await mail.markRead(
      req.params.id,
      req.user.id
    );
  }

  const stats = await mail.getStats(req.user.id);

  res.render("email", {
    email,
    ...stats
  });
});

router.get("/reply/:id", async (req, res) => {
  const email = await mail.getById(
    req.params.id,
    req.user.id
  );

  if (!email) {
    return res.status(404).send("Email not found");
  }

  const stats = await mail.getStats(req.user.id);

  res.render("compose", {
    email: {
      to: email.from.email,
      subject: email.subject.startsWith("Re:")
        ? email.subject
        : `Re: ${email.subject}`,
      body:
        `\n\n--- Original message ---\n${email.body}`
    },
    error: null,
    ...stats
  });
});

router.get("/forward/:id", async (req, res) => {
  const email = await mail.getById(
    req.params.id,
    req.user.id
  );

  if (!email) {
    return res.status(404).send("Email not found");
  }

  const stats = await mail.getStats(req.user.id);

  res.render("compose", {
    email: {
      to: "",
      subject: email.subject.startsWith("Fwd:")
        ? email.subject
        : `Fwd: ${email.subject}`,
      body:
        `\n\n--- Forwarded message ---\nFrom: ${email.from.email}\n\n${email.body}`
    },
    error: null,
    ...stats
  });
});

router.post("/star/:id", async (req, res) => {
  try {
    await mail.toggleStar(
      req.params.id,
      req.user.id
    );
  } catch {}

  res.redirect(req.get("Referer") || "/mail/inbox");
});

router.post("/trash/:id", async (req, res) => {
  try {
    await mail.moveTrash(
      req.params.id,
      req.user.id
    );
  } catch {}

  res.redirect(req.get("Referer") || "/mail/inbox");
});

router.post("/restore/:id", async (req, res) => {
  try {
    await mail.restore(
      req.params.id,
      req.user.id
    );
  } catch {}

  res.redirect("/mail/trash");
});

router.post("/delete/:id", async (req, res) => {
  try {
    await mail.permanentDelete(
      req.params.id,
      req.user.id
    );
  } catch {}

  res.redirect("/mail/trash");
});

module.exports = router;
