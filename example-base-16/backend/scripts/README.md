# Database Scripts for MongoDB

This directory contains MongoDB scripts for database setup and management.

## Scripts

### 1. `create-admin-user.js`
Creates a default admin user with the following credentials:
- **Username:** `admin`
- **Password:** `admin123`
- **Email:** `admin@example.com`
- **Role:** `ADMIN`

**⚠️ IMPORTANT:** Change the password immediately after first login!

**Usage:**
```bash
# Using mongosh (MongoDB Shell 6.0+)
mongosh ex_base_16_backend < create-admin-user.js

# Or using --eval
mongosh ex_base_16_backend --eval "load('create-admin-user.js')"

# Or directly in mongosh
mongosh ex_base_16_backend
> load('create-admin-user.js')
```

### 2. `update-user-role.js`
Updates an existing user's role to ADMIN.

**Usage:**
1. Edit the script and replace `"your_username"` with the actual username
2. Run the script:
```bash
mongosh ex_base_16_backend < update-user-role.js
```

## Quick Setup

### Creating an Admin User

**Option 1: Using Script**
```bash
mongosh ex_base_16_backend < scripts/create-admin-user.js
```

**Option 2: Using MongoDB Compass or Any MongoDB Client**

1. Connect to MongoDB
2. Select database `ex_base_16_backend`
3. Navigate to `users` collection
4. Insert document:
```json
{
  "username": "admin",
  "password": "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  "email": "admin@example.com",
  "role": "ADMIN",
  "enabled": true,
  "createdAt": ISODate(),
  "updatedAt": null
}
```

**Option 3: Update Existing User**
```bash
mongosh ex_base_16_backend --eval "db.users.updateOne({username: 'your_username'}, {\$set: {role: 'ADMIN', updatedAt: new Date()}})"
```

## MongoDB Connection

Default connection string:
```
mongodb://localhost:27017/ex_base_16_backend
```

If MongoDB requires authentication:
```
mongodb://username:password@localhost:27017/ex_base_16_backend
```

Update the connection string in `src/main/resources/application.properties` if needed.

## Notes

- Collections are created automatically on first insert
- Indexes are created automatically based on `@Indexed` annotations in entity classes
- The admin user password is BCrypt encoded. To generate a new BCrypt hash, you can use:
  - Online BCrypt generators
  - Spring Boot's BCryptPasswordEncoder
  - Or register via the API endpoint to get a properly encoded password

## Old SQL Scripts

The old SQL scripts (`create-database.sql`, `create-tables.sql`, etc.) are no longer needed as this project uses MongoDB instead of MySQL. They are kept for reference only.
