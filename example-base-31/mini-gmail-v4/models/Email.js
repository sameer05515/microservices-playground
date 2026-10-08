const mongoose = require("mongoose");

const AttachmentSchema = new mongoose.Schema({
  originalName: String,
  filename: String,
  path: String,
  mimetype: String,
  size: Number
}, { _id: true });

const EmailSchema = new mongoose.Schema({
  threadId: { type: String, index: true },
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  to: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  cc: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  bcc: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  subject: { type: String, default: "" },
  body: { type: String, default: "" },
  attachments: [AttachmentSchema],
  labels: [{ type: String, enum: ["INBOX", "SENT", "STARRED", "TRASH", "DRAFT", "IMPORTANT"] }],
  isRead: { type: Boolean, default: false },
  isDraft: { type: Boolean, default: false },
  starred: { type: Boolean, default: false },
  important: { type: Boolean, default: false },
  deletedAt: Date,
  scheduledAt: Date
}, { timestamps: true });

EmailSchema.index({ from: 1, createdAt: -1 });
EmailSchema.index({ to: 1, createdAt: -1 });
EmailSchema.index({ subject: "text", body: "text" });

module.exports = mongoose.model("Email", EmailSchema);
