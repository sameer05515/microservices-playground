const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const mail = require("../services/emailService");

router.use(auth);

function common(req) {
  return {
    unread: mail.countUnread(req.session.user.email)
  };
}

function page(req, res, title, emails, extra = {}) {
  res.render("mailbox", {
    title,
    emails,
    page: title.toLowerCase(),
    ...common(req),
    ...extra
  });
}

router.get("/inbox", (req, res) =>
  page(req, res, "Inbox", mail.inbox(req.session.user.email))
);

router.get("/sent", (req, res) =>
  page(req, res, "Sent", mail.sent(req.session.user.email))
);

router.get("/starred", (req, res) =>
  page(req, res, "Starred", mail.starred(req.session.user.email))
);

router.get("/trash", (req, res) =>
  page(req, res, "Trash", mail.trash(req.session.user.email))
);

router.get("/drafts", (req, res) =>
  page(req, res, "Drafts", mail.drafts(req.session.user.email))
);

router.get("/compose", (req, res) => {
  const userEmail = req.session.user.email;
  let email = null;

  if (req.query.draft) {
    const draft = mail.find(req.query.draft);

    if (
      draft &&
      draft.draft &&
      draft.from === userEmail
    ) {
      email = draft;
    }
  }

  res.render("compose", {
    email,
    error: null,
    unread: mail.countUnread(userEmail)
  });
});

router.post("/send", (req, res) => {
  const { to, subject, body, id } = req.body;

  if (!to || !subject || !body) {
    return res.render("compose", {
      email: req.body,
      error: "To, subject and message are required",
      unread: mail.countUnread(req.session.user.email)
    });
  }

  if (id) {
    mail.update(id, {
      to,
      subject,
      body,
      draft: false,
      read: false
    });
  } else {
    mail.create({
      from: req.session.user.email,
      to,
      subject,
      body
    });
  }

  res.redirect("/mail/sent");
});

router.post("/draft", (req, res) => {
  const { to = "", subject = "", body = "", id } = req.body;

  if (id) {
    mail.update(id, {
      to,
      subject,
      body,
      draft: true
    });
  } else {
    mail.create({
      from: req.session.user.email,
      to,
      subject,
      body,
      draft: true
    });
  }

  res.redirect("/mail/drafts");
});

router.get("/view/:id", (req, res) => {
  const userEmail = req.session.user.email;
  const email = mail.find(req.params.id);

  if (
    !email ||
    (email.from !== userEmail && email.to !== userEmail)
  ) {
    return res.status(404).send("Email not found");
  }

  if (!email.draft) {
    mail.markRead(email.id, userEmail);
  }

  res.render("email", {
    email,
    unread: mail.countUnread(userEmail)
  });
});

router.get("/reply/:id", (req, res) => {
  const email = mail.find(req.params.id);

  if (!email) {
    return res.status(404).send("Email not found");
  }

  res.render("compose", {
    email: {
      to: email.from,
      subject: email.subject.startsWith("Re:")
        ? email.subject
        : "Re: " + email.subject,
      body:
        "\n\n--- Original message ---\n" +
        email.body
    },
    error: null,
    unread: mail.countUnread(req.session.user.email)
  });
});

router.get("/forward/:id", (req, res) => {
  const email = mail.find(req.params.id);

  if (!email) {
    return res.status(404).send("Email not found");
  }

  res.render("compose", {
    email: {
      to: "",
      subject: email.subject.startsWith("Fwd:")
        ? email.subject
        : "Fwd: " + email.subject,
      body:
        "\n\n--- Forwarded message ---\n" +
        "From: " +
        email.from +
        "\n\n" +
        email.body
    },
    error: null,
    unread: mail.countUnread(req.session.user.email)
  });
});

router.post("/star/:id", (req, res) => {
  mail.toggleStar(
    req.params.id,
    req.session.user.email
  );

  res.redirect(req.get("Referer") || "/mail/inbox");
});

router.post("/trash/:id", (req, res) => {
  mail.moveTrash(
    req.params.id,
    req.session.user.email
  );

  res.redirect(req.get("Referer") || "/mail/inbox");
});

router.post("/restore/:id", (req, res) => {
  mail.restore(
    req.params.id,
    req.session.user.email
  );

  res.redirect("/mail/trash");
});

router.post("/delete/:id", (req, res) => {
  mail.permanentDelete(
    req.params.id,
    req.session.user.email
  );

  res.redirect("/mail/trash");
});

router.get("/search", (req, res) => {
  const search = req.query.q || "";

  page(
    req,
    res,
    "Search",
    mail.search(
      req.session.user.email,
      search
    ),
    { search }
  );
});

module.exports = router;
