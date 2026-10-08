const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const upload = require("../middleware/upload");
const Email = require("../models/Email");
const User = require("../models/User");
const mail = require("../services/mailService");

router.use(requireAuth);

async function counts(req, res) {
  res.locals.mailStats = await mail.stats(req.user._id);
}

router.get("/", async (req, res) => {
  const box = req.query.box || "inbox";
  const page = Math.max(1, Number(req.query.page) || 1);
  const q = req.query.q || "";
  const result = await mail.list(req.user._id, box, page, 10, q);
  await counts(req, res);
  res.render("mailbox", { box, q, ...result });
});

router.get("/compose", async (req, res) => {
  await counts(req, res);
  let draft = null;
  if (req.query.draft) {
    draft = await Email.findOne({ _id: req.query.draft, from: req.user._id, isDraft: true })
      .populate("to cc bcc", "email");
  }
  res.render("compose", { draft });
});

router.post("/send", upload.array("attachments", 5), async (req, res) => {
  try {
    await mail.send({
      user: req.user,
      to: req.body.to,
      cc: req.body.cc,
      bcc: req.body.bcc,
      subject: req.body.subject,
      body: req.body.body,
      files: req.files || [],
      draftId: req.body.draftId
    });
    res.redirect("/");
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post("/draft", upload.array("attachments", 5), async (req, res) => {
  try {
    await mail.saveDraft({
      user: req.user,
      to: req.body.to,
      cc: req.body.cc,
      bcc: req.body.bcc,
      subject: req.body.subject,
      body: req.body.body,
      files: req.files || [],
      draftId: req.body.draftId
    });
    res.redirect("/?box=drafts");
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/:id", async (req, res) => {
  const email = await Email.findOne({
    _id: req.params.id,
    $or: [{ from: req.user._id }, { to: req.user._id }, { cc: req.user._id }, { bcc: req.user._id }]
  }).populate("from to cc bcc", "name email");

  if (!email) return res.status(404).send("Email not found");

  if (email.to.some(u => u._id.equals(req.user._id)) || email.cc.some(u => u._id.equals(req.user._id))) {
    email.isRead = true;
    await email.save();
  }

  await counts(req, res);
  res.render("email", { email });
});

router.post("/:id/read", async (req, res) => {
  await Email.updateOne({ _id: req.params.id, to: req.user._id }, { isRead: true });
  res.redirect("back");
});

router.post("/:id/unread", async (req, res) => {
  await Email.updateOne({ _id: req.params.id, to: req.user._id }, { isRead: false });
  res.redirect("back");
});

router.post("/:id/star", async (req, res) => {
  await Email.updateOne(
    { _id: req.params.id, $or: [{ from: req.user._id }, { to: req.user._id }] },
    { starred: req.body.value === "true" }
  );
  res.redirect("back");
});

router.post("/:id/important", async (req, res) => {
  await Email.updateOne(
    { _id: req.params.id, $or: [{ from: req.user._id }, { to: req.user._id }] },
    { important: req.body.value === "true" }
  );
  res.redirect("back");
});

router.post("/:id/trash", async (req, res) => {
  await Email.updateOne(
    { _id: req.params.id, $or: [{ from: req.user._id }, { to: req.user._id }] },
    { $addToSet: { labels: "TRASH" }, deletedAt: new Date() }
  );
  res.redirect("back");
});

router.post("/:id/restore", async (req, res) => {
  await Email.updateOne(
    { _id: req.params.id, $or: [{ from: req.user._id }, { to: req.user._id }] },
    { $pull: { labels: "TRASH" }, $unset: { deletedAt: 1 } }
  );
  res.redirect("back");
});

router.post("/:id/delete", async (req, res) => {
  await Email.deleteOne({ _id: req.params.id, from: req.user._id });
  res.redirect("/?box=trash");
});

router.get("/:id/reply", async (req, res) => {
  const email = await Email.findById(req.params.id).populate("from", "email");
  if (!email) return res.status(404).send("Email not found");
  await counts(req, res);
  res.render("compose", {
    draft: {
      to: [email.from],
      cc: [],
      bcc: [],
      subject: email.subject.startsWith("Re:") ? email.subject : `Re: ${email.subject}`,
      body: `\\n\\n--- Original Message ---\\n${email.body}`
    }
  });
});

router.get("/:id/forward", async (req, res) => {
  const email = await Email.findById(req.params.id);
  if (!email) return res.status(404).send("Email not found");
  await counts(req, res);
  res.render("compose", {
    draft: {
      to: [],
      cc: [],
      bcc: [],
      subject: email.subject.startsWith("Fwd:") ? email.subject : `Fwd: ${email.subject}`,
      body: `\\n\\n--- Forwarded Message ---\\n${email.body}`,
      attachments: email.attachments || []
    }
  });
});

router.get("/contacts/list", async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select("name email").sort({ name: 1 });
  res.render("contacts", { users });
});

module.exports = router;
