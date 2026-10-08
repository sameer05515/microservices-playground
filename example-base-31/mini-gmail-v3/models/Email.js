const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    toEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: ""
    },
    subject: {
      type: String,
      default: ""
    },
    body: {
      type: String,
      default: ""
    },
    read: {
      type: Boolean,
      default: false
    },
    starred: {
      type: Boolean,
      default: false
    },
    deleted: {
      type: Boolean,
      default: false
    },
    draft: {
      type: Boolean,
      default: false
    },
    labels: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

emailSchema.index({ from: 1, createdAt: -1 });
emailSchema.index({ to: 1, createdAt: -1 });
emailSchema.index({ subject: "text", body: "text" });

module.exports = mongoose.model("Email", emailSchema);
