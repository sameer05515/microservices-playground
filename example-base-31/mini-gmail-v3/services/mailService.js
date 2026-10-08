const mongoose = require("mongoose");
const Email = require("../models/Email");
const User = require("../models/User");

const PAGE_SIZE = 10;

function userId(id) {
  return new mongoose.Types.ObjectId(id);
}

async function resolveRecipient(email) {
  if (!email) return null;

  return User.findOne({
    email: email.toLowerCase().trim()
  });
}

async function mailbox(userIdValue, type, page = 1, search = "") {
  const uid = userId(userIdValue);
  const skip = (page - 1) * PAGE_SIZE;

  let filter = {};

  if (type === "inbox") {
    filter = {
      to: uid,
      deleted: false,
      draft: false
    };
  } else if (type === "sent") {
    filter = {
      from: uid,
      deleted: false,
      draft: false
    };
  } else if (type === "starred") {
    filter = {
      $or: [{ from: uid }, { to: uid }],
      starred: true,
      deleted: false,
      draft: false
    };
  } else if (type === "trash") {
    filter = {
      $or: [{ from: uid }, { to: uid }],
      deleted: true
    };
  } else if (type === "drafts") {
    filter = {
      from: uid,
      draft: true,
      deleted: false
    };
  }

  if (search) {
    const regex = new RegExp(
      search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );

    filter.$and = [
      filter.$and || {},
      {
        $or: [
          { subject: regex },
          { body: regex },
          { toEmail: regex }
        ]
      }
    ];
  }

  const [emails, total] = await Promise.all([
    Email.find(filter)
      .populate("from", "name email")
      .populate("to", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(PAGE_SIZE)
      .lean(),

    Email.countDocuments(filter)
  ]);

  return {
    emails,
    page,
    pageSize: PAGE_SIZE,
    total,
    pages: Math.max(1, Math.ceil(total / PAGE_SIZE))
  };
}

async function unreadCount(id) {
  return Email.countDocuments({
    to: userId(id),
    deleted: false,
    draft: false,
    read: false
  });
}

async function send(fromId, toEmail, subject, body, id) {
  const recipient = await resolveRecipient(toEmail);

  if (!recipient) {
    throw new Error("Recipient is not registered");
  }

  const data = {
    from: userId(fromId),
    to: recipient._id,
    toEmail: recipient.email,
    subject,
    body,
    draft: false,
    deleted: false,
    read: false
  };

  if (id) {
    const updated = await Email.findOneAndUpdate(
      {
        _id: id,
        from: userId(fromId),
        draft: true
      },
      data,
      { new: true }
    );

    if (!updated) {
      throw new Error("Draft not found");
    }

    return updated;
  }

  return Email.create(data);
}

async function saveDraft(fromId, data) {
  const draft = {
    from: userId(fromId),
    toEmail: data.toEmail || "",
    subject: data.subject || "",
    body: data.body || "",
    draft: true,
    deleted: false
  };

  if (data.id) {
    return Email.findOneAndUpdate(
      {
        _id: data.id,
        from: userId(fromId),
        draft: true
      },
      draft,
      { new: true }
    );
  }

  return Email.create(draft);
}

async function getById(id, currentUserId) {
  const email = await Email.findOne({
    _id: id,
    $or: [
      { from: userId(currentUserId) },
      { to: userId(currentUserId) }
    ]
  })
    .populate("from", "name email")
    .populate("to", "name email");

  return email;
}

async function markRead(id, currentUserId) {
  return Email.findOneAndUpdate(
    {
      _id: id,
      to: userId(currentUserId)
    },
    { read: true },
    { new: true }
  );
}

async function toggleStar(id, currentUserId) {
  const email = await getById(id, currentUserId);

  if (!email) {
    throw new Error("Email not found");
  }

  email.starred = !email.starred;
  return email.save();
}

async function moveTrash(id, currentUserId) {
  const email = await getById(id, currentUserId);

  if (!email) {
    throw new Error("Email not found");
  }

  email.deleted = true;
  return email.save();
}

async function restore(id, currentUserId) {
  const email = await Email.findOne({
    _id: id,
    deleted: true,
    $or: [
      { from: userId(currentUserId) },
      { to: userId(currentUserId) }
    ]
  });

  if (!email) {
    throw new Error("Email not found");
  }

  email.deleted = false;
  return email.save();
}

async function permanentDelete(id, currentUserId) {
  const result = await Email.deleteOne({
    _id: id,
    deleted: true,
    $or: [
      { from: userId(currentUserId) },
      { to: userId(currentUserId) }
    ]
  });

  return result.deletedCount === 1;
}

async function getStats(id) {
  const uid = userId(id);

  const [unread, drafts, starred] = await Promise.all([
    Email.countDocuments({
      to: uid,
      read: false,
      deleted: false,
      draft: false
    }),
    Email.countDocuments({
      from: uid,
      draft: true,
      deleted: false
    }),
    Email.countDocuments({
      $or: [{ from: uid }, { to: uid }],
      starred: true,
      deleted: false,
      draft: false
    })
  ]);

  return { unread, drafts, starred };
}

module.exports = {
  mailbox,
  unreadCount,
  send,
  saveDraft,
  getById,
  markRead,
  toggleStar,
  moveTrash,
  restore,
  permanentDelete,
  getStats
};
