const crypto = require("crypto");
const Email = require("../models/Email");
const User = require("../models/User");

async function findRecipients(addresses = []) {
  // HTML form fields arrive as strings, while API callers may send arrays.
  // Normalize both forms before processing comma-separated addresses.
  const values = Array.isArray(addresses) ? addresses : [addresses];

  const emails = values
    .flatMap(value => String(value || "").split(","))
    .map(email => email.trim().toLowerCase())
    .filter(Boolean);

  if (!emails.length) return [];

  const users = await User.find({ email: { $in: emails } });
  const found = new Set(users.map(user => user.email));
  const missing = emails.filter(email => !found.has(email));

  if (missing.length) {
    throw new Error(`User not found: ${missing.join(", ")}`);
  }

  return users;
}

function mailboxFilter(userId, box) {
  const uid = userId.toString();
  if (box === "sent") return { from: uid, isDraft: false, "labels": "SENT" };
  if (box === "drafts") return { from: uid, isDraft: true, "labels": "DRAFT" };
  if (box === "starred") return { $or: [{ from: uid }, { to: uid }], starred: true, isDraft: false, "labels": { $ne: "TRASH" } };
  if (box === "trash") return { $or: [{ from: uid }, { to: uid }], "labels": "TRASH" };
  if (box === "important") return { $or: [{ from: uid }, { to: uid }], important: true, "labels": { $ne: "TRASH" }, isDraft: false };
  return { to: uid, "labels": "INBOX", isDraft: false };
}

async function list(userId, box, page = 1, limit = 10, q = "") {
  let filter = mailboxFilter(userId, box);
  if (q.trim()) {
    const search = { $or: [
      { subject: { $regex: q.trim(), $options: "i" } },
      { body: { $regex: q.trim(), $options: "i" } }
    ]};
    filter = { $and: [filter, search] };
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Email.find(filter).populate("from to cc bcc", "name email").sort({ createdAt: -1 }).skip(skip).limit(limit),
    Email.countDocuments(filter)
  ]);

  return { items, total, page, pages: Math.max(1, Math.ceil(total / limit)) };
}

async function stats(userId) {
  const uid = userId.toString();
  const [unread, drafts, starred] = await Promise.all([
    Email.countDocuments({ to: uid, labels: "INBOX", isDraft: false, isRead: false }),
    Email.countDocuments({ from: uid, labels: "DRAFT", isDraft: true }),
    Email.countDocuments({ $or: [{ from: uid }, { to: uid }], starred: true, labels: { $ne: "TRASH" } })
  ]);
  return { unread, drafts, starred };
}

function createThreadId() {
  return crypto.randomUUID();
}

async function send({ user, to, cc, bcc, subject, body, files = [], draftId }) {
  const recipients = await findRecipients(to);
  const ccUsers = await findRecipients(cc || []);
  const bccUsers = await findRecipients(bcc || []);

  const attachments = files.map(f => ({
    originalName: f.originalname,
    filename: f.filename,
    path: `/${f.path.replace(/\\/g, "/")}`,
    mimetype: f.mimetype,
    size: f.size
  }));

  if (draftId) {
    const draft = await Email.findOne({ _id: draftId, from: user._id, isDraft: true });
    if (!draft) throw new Error("Draft not found");
    draft.to = recipients.map(u => u._id);
    draft.cc = ccUsers.map(u => u._id);
    draft.bcc = bccUsers.map(u => u._id);
    draft.subject = subject || "";
    draft.body = body || "";
    draft.attachments = attachments;
    draft.labels = ["SENT", "INBOX"];
    draft.isDraft = false;
    draft.isRead = true;
    return draft.save();
  }

  return Email.create({
    threadId: createThreadId(),
    from: user._id,
    to: recipients.map(u => u._id),
    cc: ccUsers.map(u => u._id),
    bcc: bccUsers.map(u => u._id),
    subject: subject || "",
    body: body || "",
    attachments,
    // Keep SENT for the sender and INBOX for recipients on the same
    // message document. Inbox queries are based on recipient + INBOX.
    labels: ["SENT", "INBOX"],
    isRead: true,
    isDraft: false
  });
}

async function saveDraft({ user, to, cc, bcc, subject, body, files = [], draftId }) {
  let draft = draftId
    ? await Email.findOne({ _id: draftId, from: user._id, isDraft: true })
    : null;

  if (!draft) {
    draft = new Email({
      threadId: createThreadId(),
      from: user._id,
      labels: ["DRAFT"],
      isDraft: true
    });
  }

  const recipients = to ? await findRecipients(to) : [];
  const ccUsers = cc ? await findRecipients(cc) : [];
  const bccUsers = bcc ? await findRecipients(bcc) : [];

  draft.to = recipients.map(u => u._id);
  draft.cc = ccUsers.map(u => u._id);
  draft.bcc = bccUsers.map(u => u._id);
  draft.subject = subject || "";
  draft.body = body || "";
  if (files.length) {
    draft.attachments = files.map(f => ({
      originalName: f.originalname,
      filename: f.filename,
      path: `/${f.path.replace(/\\/g, "/")}`,
      mimetype: f.mimetype,
      size: f.size
    }));
  }
  return draft.save();
}

module.exports = { list, stats, send, saveDraft };
