# Mini Gmail v2 - Fixed

## Features

- Login
- Registration
- Inbox
- Sent
- Compose
- Drafts
- Star / Unstar
- Trash
- Restore
- Permanent Delete
- Reply
- Forward
- Search
- Unread count
- Multiple users
- JSON storage
- Gmail-like UI

## Bug fixes

- Fixed `unread is not defined` on Compose page
- Fixed `unread is not defined` on Reply page
- Fixed `unread is not defined` on Forward page
- Fixed unread count on Email View page
- Added draft loading with `/mail/compose?draft=ID`
- Added proper draft edit authorization
- Removed unnecessary optional chaining from EJS form fields

## Run

```bash
npm install
npm run dev
```

Open:

http://localhost:3000

Demo:

prem@gmail.com / 123456
