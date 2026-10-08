const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Email = require("../models/Email");

async function auth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Missing bearer token" });
    const p = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(p.userId).select("-password");
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
}

router.get("/stats", auth, async (req, res) => {
  const uid = req.user._id;
  const [unread, drafts, starred] = await Promise.all([
    Email.countDocuments({ to: uid, labels: "INBOX", isRead: false }),
    Email.countDocuments({ from: uid, isDraft: true }),
    Email.countDocuments({ $or: [{ from: uid }, { to: uid }], starred: true })
  ]);
  res.json({ unread, drafts, starred });
});

router.get("/mail/:box", auth, async (req, res) => {
  const uid = req.user._id;
  let filter = req.params.box === "sent"
    ? { from: uid, labels: "SENT" }
    : { to: uid, labels: "INBOX" };
  const emails = await Email.find(filter).populate("from to", "name email").sort({ createdAt: -1 });
  res.json(emails);
});

module.exports = router;
