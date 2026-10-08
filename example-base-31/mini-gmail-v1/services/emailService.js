const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "../data/emails.json");

function getEmails() {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function saveEmails(emails) {
  fs.writeFileSync(file, JSON.stringify(emails, null, 2), "utf8");
}

function sortByDate(emails) {
  return emails.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getInbox(email) {
  return sortByDate(getEmails().filter(e => e.to === email && !e.deleted));
}

function getSent(email) {
  return sortByDate(getEmails().filter(e => e.from === email && !e.deleted));
}

function findById(id) {
  return getEmails().find(e => e.id === Number(id));
}

function markAsRead(id) {
  const emails = getEmails();
  const email = emails.find(e => e.id === Number(id));
  if (email) {
    email.read = true;
    saveEmails(emails);
  }
  return email;
}

function sendEmail({ from, to, subject, body }) {
  const emails = getEmails();
  const id = emails.length ? Math.max(...emails.map(e => e.id)) + 1 : 1;
  const email = {
    id, from, to, subject, body,
    date: new Date().toISOString(),
    read: false,
    deleted: false
  };
  emails.push(email);
  saveEmails(emails);
  return email;
}

function deleteEmail(id) {
  const emails = getEmails();
  const email = emails.find(e => e.id === Number(id));
  if (email) {
    email.deleted = true;
    saveEmails(emails);
  }
}

function search(email, keyword) {
  const value = keyword.toLowerCase();
  return sortByDate(getEmails().filter(mail => {
    if (mail.deleted || (mail.from !== email && mail.to !== email)) return false;
    return [mail.subject, mail.body, mail.from, mail.to]
      .some(v => v.toLowerCase().includes(value));
  }));
}

module.exports = {
  getInbox, getSent, findById, markAsRead, sendEmail, deleteEmail, search
};